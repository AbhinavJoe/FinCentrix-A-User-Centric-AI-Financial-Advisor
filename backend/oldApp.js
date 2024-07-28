import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import { Ollama } from 'ollama';
import { addFilesToCollection } from './data_loader.js';

const app = express();
const port = 5000;


const ollama = new Ollama({ host: process.env.OLLAMA_URL || 'http://localhost:11434' });

const client = new ChromaClient({
    path: process.env.CHROMA_URL || "http://localhost:8000"
});
const emb_fn = new DefaultEmbeddingFunction();

await fillDB();

app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your Next.js client
    methods: ['POST', 'GET']  // Adjust according to your needs
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
    console.log("query receiced!");
    const { query } = req.body;
    const collection = await getOrCreateCollection("News");
    const dbres = await queryCollection(collection, 5, [query]);
    const context = dbres.documents[0];
    // const final_query = `Give your answers formatted in HTML tags only. Do not add any non html content, start and end with <div> </div> only. Format different lines, important keywords, etc with bullets, bold, etc. You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. Use the relevant part of the context provided. If you don\'t know the answer, just say that you don\'t know. Question: ${query} Context: ${context}. Properly format your answer with html tags Answer:`;
    const final_query = `
    Format your answers in Markdown. After providing the financial advice, explain why you made that specific recommendation based on the user's query and the context provided. Use the following pieces of retrieved context to answer the question. Use the relevant part of the context provided. If you don\'t know the answer, just say that you don\'t know. Question: ${query} Context: ${context}. Start your response with your advice and follow with an explanation section.

### Answer:
Provide your answer here in markdown format. After your advice, include a section titled "Explanation" where you describe why this advice is appropriate based on the context.

#### Explanation:
Provide the reasoning behind your advice here. Use bullet points or numbered lists to organize your thoughts if necessary.

Please ensure to use appropriate Markdown formatting for headers, lists, and emphasis. If you do not know the answer, clearly state that you do not know. Generate the entire output in not more than 150 words.`;

    console.log(final_query);
    const response = await ollama.chat({
        // model: 'llama3',
        model: 'gemma:2b-instruct-q5_0',
        messages: [{ role: 'user', content: final_query }]
    });
    console.log(response.message.content);
    res.send(response);
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