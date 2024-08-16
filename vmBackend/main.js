import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChromaClient } from 'chromadb';
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";
import { addFilesToCollection } from './dataLoader.js';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const ip = '0.0.0.0';
const port = 5000;

// Azure Blob Storage setup
const account = process.env.ACCOUNT_NAME
const accountSas = process.env.ACCOUNT_SAS
const containerName = 'aidata'

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/?${accountSas}`,
    new AnonymousCredential()
);

// Azure OpenAI Embedding setup
const embDeployment = "bob-In-emb-3-large";

// Azure OpenAI Chat setup
const endpoint = process.env.AZURE_OPENAI_ENDPOINT
const apiKey = process.env.AZURE_OPENAI_API_KEY
const apiVersion = "2024-05-01-preview";
const deployment = "bob-in-35-turbo";
const azureOpenAIClient = new AzureOpenAI({ endpoint, apiKey, apiVersion });

const client = new ChromaClient({
    path: process.env.CHROMA_URL
});

// Custom embedding function using Azure OpenAI
const emb_fn = async function customEmbeddingFunction(texts) {
    try {
        const embeddingsResponse = await azureOpenAIClient.embeddings.create({
            input: texts,
            model: embDeployment
        });
        return embeddingsResponse.data.map(embed => embed.embedding);
    } catch (error) {
        console.error('Failed to get embeddings:', error);
        return [];
    }
}

await fillDB();

app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://jolly-beach-09f149d00.5.azurestaticapps.net'],
    credentials: true
}));

app.post('/uploadFiles', async (req, res) => {
    const { filePath } = req.body;
    const collection = await getOrCreateCollection("News");
    await addFilesToCollection(filePath, collection);
    res.send({ message: 'Files added to database successfully' });
});

app.post('/chat', async (req, res) => {
    console.log("query received!");
    const { query } = req.body;
    const collection = await getOrCreateCollection("News");
    const dbres = await queryCollection(collection, 5, [query]);
    const context = dbres.documents[0];
    console.log('Context:', context)

    let systemQuery, userQuery;
    const isFinanceQuery = await analyzeQuery(query);

    if (isFinanceQuery) {
        systemQuery = `
            You are FinCentrix, an AI assistant for Bank of Baroda, who is a world-class financial advisor. 
            You are smart and reliable and can give financial advice specific to the user, including autonomously processing bank statements and displaying transaction data in tables if relevant or asked by the user. 
            Deliver your financial advice in Markdown format. Begin with the advice itself, followed by a detailed explanation of the reasoning behind the advice. 
            Form your response based on the user's question and the retrieved context: ${context}

            ## Financial Advice:
            Your advice here in markdown format. Start directly with the advice, ensuring it is specific and actionable. If the answer is not clear from the context, respond in a witty and humorous way, acknowledging the mismatch and don't provide an explanation in this case.

            ## Transaction Details:
            If deemed relevant or if the user asks for it, generate a table showing pertinent transactions from the user bank statement here using Markdown table formatting to clarify the financial situation or illustrate the advice.

            ## Why This Advice:
            Here, explain the logic behind your advice. Use bullet points or numbered lists to make your explanation clear and easy to follow. Base your reasoning on the user's query and the provided context.

            Please adhere to Markdown formatting for headers, lists, and emphasis, and always stay in character as FinCentrix, an AI assistant for Bank of Baroda, who is a world-class financial advisor.
        `;
        userQuery = query;
    } else {
        systemQuery = `You are FinCentrix, an AI assistant for Bank of Baroda, who is a world-class financial advisor.`;
        userQuery = `
            You are FinCentrix, an AI assistant for Bank of Baroda, who is a world-class financial advisor.
            Respond to the following user query in a friendly and helpful manner:

            User query: ${query}

            If the user is making small talk or asking an unrelated question, respond accordingly and steer the conversation back to finance.
    
            Remember to always stay in character as FinCentrix, an AI assistant for Bank of Baroda, who is a world-class financial advisor.
            `;
    }

    try {
        const response = await azureOpenAIClient.chat.completions.create({
            messages: [
                { role: 'system', content: systemQuery },
                { role: 'user', content: userQuery }
            ],
            model: deployment,
            temperature: 0.9,
            max_tokens: 300
        });

        if (response.choices && response.choices.length > 0) {
            const messages = response.choices.map(choice => choice.message.content).join('\n');
            console.log(messages);
            res.json({ messages: messages }); // Send JSON response
        } else {
            res.status(500).json({ error: "No response from AI model." });
        }
    } catch (error) {
        console.error("Error in AI response:", error);
        res.status(500).json({ error: "Failed to get AI response." });
    }
});

async function analyzeQuery(query) {
    const prompt = `
    Determine if the following user input is a specific query about finacial advice or anything related to finance or banks, or a general chat message:

    User input: ${query}

    Respond with only 'FINANCE' if it's a query about finance or financial advice, or 'CHAT' if it's a general chat message.
    `;
    try {
        const response = await azureOpenAIClient.chat.completions.create({
            messages: [
                { role: 'system', content: "You are an AI assistant that categorizes user inputs into one of the two: 'FINANCE' or 'CHAT'." },
                { role: 'user', content: prompt }
            ],
            model: deployment,
            temperature: 0.2,
            max_tokens: 10
        });

        if (response && response.choices && response.choices.length > 0) {
            const messageContent = response.choices[0].message.content.trim();
            console.log("Categorized as:", messageContent);
            return messageContent === 'FINANCE';
        } else {
            console.error("No valid response from AI Model or no choices available");
            return false;
        }
    } catch (error) {
        console.error(`Error determining query type: ${error}`);
        return false;
    }
}


async function getOrCreateCollection(name) {
    const collection = await client.getOrCreateCollection({
        name,
        metadata: {
            description: "Private Docs",
            "hnsw:space": "l2"
        },
        embeddingFunction: {
            generate: emb_fn
        }
    });
    return collection;
}

async function queryCollection(collection, nResults, queryTexts) {
    const results = await collection.query({
        nResults,
        queryTexts,
    });
    return results;
}

async function fillDB(retryCount = 5, delay = 5000) {
    try {
        const collection = await getOrCreateCollection("News");
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobList = containerClient.listBlobsFlat();

        for await (const blob of blobList) {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadBlockBlobResponse = await blobClient.download(0);
            const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
            console.log(`Ingesting File ${blob.name}`);
            await addFilesToCollection(downloaded, blob.name, collection);
        }

        console.log("Documents ingested successfully!");
    } catch (error) {
        console.error("Error filling DB:", error.message);

        if (retryCount > 0) {
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await sleep(delay);
            await fillDB(retryCount - 1, delay);
        } else {
            console.error("Max retries reached. Failed to fill DB.");
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

app.listen(port, ip, () => {
    console.log(`Server running on port ${port}`);
});
