import { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

export async function main() {
    const scope = "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
    const endpoint = process.env["AZURE_OPENAI_ENDPOINT"]
    const apiKey = process.env["AZURE_OPENAI_API_KEY"]
    const deployment = "gpt-35-turbo";
    const apiVersion = "2024-04-01-preview";
    const client = new AzureOpenAI({ azureADTokenProvider, deployment, apiVersion, endpoint, apiKey });
    const result = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
            { role: "user", content: "Can you help me?" },
        ],
        model: '',
    });

    for (const choice of result.choices) {
        console.log(choice.message);
    }
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});