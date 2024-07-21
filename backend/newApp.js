import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import OpenAI from "openai";
import { addFilesToCollection } from './data_loader.js';

const app = express();
const port = 5000;

const openai = new OpenAI({
    apiKey: "sk-proj-Y6VbDgVRYc0YkAyUXSKXT3BlbkFJx9NMQYXCcEaef98xutG7"
});

const client = new ChromaClient({
    path: process.env.CHROMA_URL || "http://localhost:8000"
});
const emb_fn = new DefaultEmbeddingFunction();

await fillDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET']
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

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
    const final_query = `Question: ${query} Context: ${context}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: final_query }],
            stream: true
        });

        let aiResponse = '';
        for await (const chunk of response) {
            aiResponse += chunk.choices[0]?.delta?.content || "";
        }

        res.send({ message: { content: aiResponse } });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).send({ error: 'Failed to fetch response from OpenAI' });
    }
});

async function getOrCreateCollection(name) {
    const collection = await client.getOrCreateCollection({
        name,
        metadata: {
            description: "Private Docs",
            "hnsw:space": "l2"
        },
        embeddingFunction: emb_fn
    });
    return collection;
}

async function queryCollection(collection, nResults, queryTexts) {
    const results = await collection.query({
        nResults,
        queryTexts
    });
    return results;
}

async function fillDB(retryCount = 5, delay = 5000) {
    try {
        const collection = await getOrCreateCollection("News");
        const pdfPath = 'backend/Docs/';
        await addFilesToCollection(pdfPath, collection);
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
