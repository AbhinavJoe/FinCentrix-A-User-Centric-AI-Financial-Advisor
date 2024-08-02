# FinCentrix - A User-Centric AI Financial Advisor
- Deployment - https://jolly-beach-09f149d00.5.azurestaticapps.net/
- The complexity of financial markets, combined with the rapid growth of the AI Industry especially Generative AI, creates a spot where both can be used together in harmony to make well-informed financial decisions. This is where FinCentrix comes into the picture. FinCentrix, an AI-driven financial advisory solution is set to revolutionize how people access financial guidance. By making personalized advice accessible and affordable, it addresses a crucial need in today's complex financial landscape. For individuals, it's like having a knowledgeable financial advisor on call, helping them make smarter money decisions anytime.
- NOTE: If the AI Reponse does not come in the chat page, then the LLM Backend Virtual Machine is probably deallocated(stopped) to conserve Azure Credits :(

## Accessing the application
- Currently the application is setup such that users will not be able to login with their email and password after signup unless they are approved by the admin (me).
- For this, a sample user email and password has been provided below, to login in, to access the application:
  - Email: bob.user@outlook.com
  - Password: user@bob

## Features
- Automated Real-Time Responses: Uses generative AI to provide immediate, accurate responses to customer queries.
- Personalized Financial Recommendations: Tailors recommendations based on customer data, real-time stock information, and current market trends.
- Integration with Existing Platforms: Can seamlessly integrate with existing banking services and platforms to add an additional layer of functionality for the user to interact and use.
- Enhanced Security and Privacy: Adheres to the standards of data security and privacy.

## Architecture
![image](https://github.com/user-attachments/assets/cd513ed1-3039-4ea6-9774-b60774f8ab5a)

## Solution Structure
- The application follows a modular arcchitecture where the frontend and backend are both seperate so, changes made to any one will not affect the other.
- The user interface (frontend and backend) is hosted on Azure Static Web Apps and the LLM backend is running as a docker container in an Azure VM.
- This repo shows only the frontend of the project. The LLM Backend is running as a standalone backend service on Azure VM, to which the frontend makes requests and gets responses.
- This structure prevents no data leakage ensuing user data security and privacy.

## License
- The project is licened under the MIT License.
