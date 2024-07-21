import fs from 'fs';
import path from 'path';


function chunkText(text) {
    const words = text.split(/\s+/);
    const chunkSize = 100
        ;
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
    }

    return chunks;
}


// Chunk and add text to collection
export async function addTextToCollection(text, filePath, collection) {
    console.log(`Ingesting File ${filePath}\n...`)
    const chunks = chunkText(text);
    const fileName = filePath.split('/').pop(); // Get PDF name from path
    const ids = chunks.map((_, index) => `${fileName}_chunk_${index + 1}`);
    const metadatas = chunks.map(() => ({ source: fileName }));

    const er1 = await collection.add({
        ids,
        metadatas,
        documents: chunks,
    });

    console.log(er1);
}


//Master Parser
export async function addFilesToCollection(folderPath, collection) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (path.extname(file).toLowerCase() === '.txt') {
            const text = fs.readFileSync(filePath, 'utf8');
            await addTextToCollection(text, filePath, collection);
        }
        else
            continue;
    }
}