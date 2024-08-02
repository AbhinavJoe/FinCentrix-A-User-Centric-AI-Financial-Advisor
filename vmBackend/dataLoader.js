import pdf from 'pdf-parse-fork';
import docx from 'docx-parser';

function chunkText(text) {
    const words = text.split(/\s+/);
    const chunkSize = 100;
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
    }

    return chunks;
}

async function extractTextFromPDFBuffer(dataBuffer) {
    try {
        const pdfText = await pdf(dataBuffer);
        return pdfText.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw error;
    }
}

async function extractTextFromDocxBuffer(buffer) {
    return new Promise((resolve, reject) => {
        docx.parseDocx(buffer, function (data) {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data returned from parseDocx"));
            }
        });
    });
}

async function addTextToCollection(text, fileName, collection) {
    console.log(`Ingesting File ${fileName}\n...`);
    const chunks = chunkText(text);
    const ids = chunks.map((_, index) => `${fileName}_chunk_${index + 1}`);
    const metadatas = chunks.map(() => ({ source: fileName }));

    console.log('Collection Object:', collection);

    try {
        const response = await collection.add({
            ids,
            metadatas,
            documents: chunks,
        });
        console.log("File added to collection successfully:", response);
    } catch (error) {
        console.error("Error adding text to collection:", error);
        throw error;
    }
}

export async function addFilesToCollection(buffer, fileName, collection) {
    try {
        const fileType = await determineFileType(buffer);

        if (fileType === 'pdf') {
            const text = await extractTextFromPDFBuffer(buffer);
            await addTextToCollection(text, fileName, collection);
        } else if (fileType === 'docx') {
            const text = await extractTextFromDocxBuffer(buffer);
            await addTextToCollection(text, fileName, collection);
        } else if (fileType === 'txt') {
            const text = buffer.toString('utf8');
            await addTextToCollection(text, fileName, collection);
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        console.error("Error handling file type:", error);
    }
}

async function determineFileType(buffer) {
    const pdfHeader = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
    const docxHeader = Buffer.from([0x50, 0x4B, 0x03, 0x04]); // PK (zip file signature)

    if (buffer.slice(0, 4).equals(pdfHeader)) {
        return 'pdf';
    } else if (buffer.slice(0, 4).equals(docxHeader)) {
        return 'docx';
    } else {
        return 'txt';
    }
}
