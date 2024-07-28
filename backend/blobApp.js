import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { addFilesToCollection } from './data_loader.js';
import 'dotenv/config';
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";

const app = express();
const ip = '192.168.1.114';
const port = 5000;

const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
const deployment = "bob-gpt-35-turbo-1106";
const apiVersion = "2024-04-01-preview";
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"]
const apiKey = process.env["AZURE_OPENAI_API_KEY"]
const model = "gpt-35-turbo"
const openAIClient = new AzureOpenAI({ apiKey, deployment, apiVersion, endpoint });

const client = new ChromaClient({
    path: process.env.CHROMA_URL || "http://localhost:8000"
});
const emb_fn = new DefaultEmbeddingFunction();

// Configure Azure Blob Storage
const account = process.env.ACCOUNT_NAME;
const accountSas = process.env.ACCOUNT_SAS;
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/aidata?${accountSas}`,
    new AnonymousCredential()
);

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET']
}));

app.post('/uploadFiles', async (req, res) => {
    const { filePath } = req.body;
    const collection = await getOrCreateCollection("News");
    await addFilesToCollection(filePath, collection);
    res.send({ message: 'Files added to database successfully' });
});

app.post('/chat', async (req, res) => {
    const { query } = req.body;
    const collection = await getOrCreateCollection("News");
    const dbres = await queryCollection(collection, 5, [query]);
    const context = dbres.documents[0];
    const final_query = `
    You are FinBot, a world-class financial advisor providing user-curated financial advisory. Format your responses in Markdown. Start your response with your advice under the 'Answer' section, then explain your reasoning in the 'Explanation' section based on user query: ${query}, and the provided context: ${context}. If the answer to a question is not in the context then simply say that you don't know the answer.

### Answer:
- Provide your financial advice here using markdown formatting. If the answer is not clear from the context, state: "I don't have relevant information on the topic. Please ask questions related to finance."

### Explanation:
- As FinBot, explain the reasoning behind your financial advice. Use bullet points or numbered lists to structure your explanation, showing how the advice fits with the user's financial situation and the context provided.

Please ensure proper use of Markdown for headers, lists, and emphasis, keeping the entire response within 150 words.`;

    try {
        const response = await openAIClient.chat.completions.create({
            messages: [
                { role: 'user', content: final_query }
            ],
            model: model,
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
        embeddingFunction: emb_fn,
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
        const containerName = "aidata"; // Set your container name
        const containerClient = blobServiceClient.getContainerClient(containerName);
        let blobs = containerClient.listBlobsFlat();

        const collection = await getOrCreateCollection("News");
        for await (const blob of blobs) {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadBlockBlobResponse = await blobClient.download(0);
            const downloadedContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);
            // Assuming the content is the file content you need to index
            await addFilesToCollection(downloadedContent, collection);
        }
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

async function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString('utf-8')));
        stream.on("error", reject);
    });
}

app.listen(port, ip, () => {
    console.log(`Server running on port ${port}`);
});
