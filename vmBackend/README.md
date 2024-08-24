# LLM Backend running on VM
- This is a seperate part of the solution where the LLM Backend is running as a docker container on an Azure VM. 
- It is set up such that the docker containers will start every time the VM runs, so there will be no need to manually go into the code and run the container from there. It will autorun as soon as the Azure VM starts.
- The entire backend is written in Node.js and uses Express to serve the ports

## Running Locally
- To run the backend locally, clone the repository using 
```
git clone https://github.com/AbhinavJoe/FinCentrix-A-User-Centric-AI-Financial-Advisor.git
```
- After cloning, go to the vmBackend directory by running `cd vmBackend` in the terminal.
- Then, run `npm install` to download all packages.
- I've not provided the `.env` file for obvious reasons.
- Make an Azure Storage resource, create a container in the blob storage, and upload the file in the path `Docs/knowledge_base.txt` there inside a blob container named `aidata`.
- Repeat the same for Azure Open AI service.
- After doing all that, create a `.env` file and add all the necessary env variables there from the `main.js` file.
- Make sure you have docker installed locally. After this, run `docker-compose up`. This will pull the relevant dependencies and start docker containers for chromaDB and the main.js file.
