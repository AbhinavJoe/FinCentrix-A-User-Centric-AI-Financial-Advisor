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
const containerName = process.env.CONTAINER

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
        console.log('Embeddings Response:', embeddingsResponse.data);
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
    const final_query = `
You are FinCentrix - a world-class Financial Advisor. You are smart and reliable and can give financial advice specific to the user, including autonomously processing bank statements and deciding when to display transaction data in tables if relevant. Deliver your financial advice in Markdown format. Begin with the advice itself, followed by a detailed explanation of the reasoning behind the recommendation. Form your response based on the user's question and the retrieved context: ${context}

If the user query is a basic conversation or about non-financial matters, respond:
> **I'm a financial advisor, so it'd be best if we talk about financial matters.** 🎩✨ While I'm great at conjuring financial wisdom, I'm here to provide monetary advice. Can we try something a bit more... monetary?

Financial Advice:
Your advice here in markdown format. Start directly with the advice, ensuring it is specific and actionable. If the answer is not clear from the context, respond in a witty and humorous way, acknowledging the mismatch and don't provide an explanation in this case. Example of a non-financial query response:
> **Oops!** 🎩✨ It looks like your question wandered into the wrong magic show! While I'm great at conjuring financial wisdom, this question doesn't fit the bill. Can we try something a bit more... monetary?

Transaction Details:
If deemed relevant, generate a table showing pertinent transactions from the user bank statement here using Markdown table formatting to clarify the financial situation or illustrate the advice.

Why This Advice:
Here, explain the logic behind your advice. Use bullet points or numbered lists to make your explanation clear and easy to follow. Base your reasoning on the user's query and the provided context.

Please adhere to Markdown formatting for headers, lists, and emphasis.`;


    try {
        const response = await azureOpenAIClient.chat.completions.create({
            messages: [
                { role: 'system', content: final_query },
                { role: 'user', content: query }
            ],
            model: deployment,
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

async function getOrCreateCollection(name) {
    const collection = await client.getOrCreateCollection({
        name,
        metadata: {
            description: "Private Docs",
            "hnsw:space": "l2"
        },
        // embeddingFunction: emb_fn,
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
    console.log('Query Results:', results);
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
