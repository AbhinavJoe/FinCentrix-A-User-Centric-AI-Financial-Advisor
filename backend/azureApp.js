import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { addFilesToCollection } from './data_loader.js';
import 'dotenv/config';

const app = express();
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

await fillDB();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your Next.js client
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
    Format your answers in Markdown. After providing the financial advice, explain why you made that specific recommendation based on the user's query and the context provided. Use the following pieces of retrieved context to answer the question. Question: ${query} Context: ${context}. Start your response with your advice and follow with an explanation section.

### Answer:
Provide your answer here in markdown format. After your advice, include a section titled "Explanation" where you describe why this advice is appropriate based on the context.

#### Explanation:
Provide the reasoning behind your advice here. Use bullet points or numbered lists to organize your thoughts if necessary.

Please ensure to use appropriate Markdown formatting for headers, lists, and emphasis. If you do not know the answer, clearly state that you do not know. Generate the entire output in not more than 150 words.`;

    try {
        const response = await openAIClient.chat.completions.create({
            messages: [
                { role: 'user', content: final_query }
            ],
            model: model,
        },
            // stre
        );

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
        const collection = await getOrCreateCollection("News");
        const pdfPath = 'Docs/';
        await addFilesToCollection(pdfPath, collection);
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
