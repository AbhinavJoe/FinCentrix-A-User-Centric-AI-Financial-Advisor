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

## Screenshots
### Desktop
![Login](https://github.com/user-attachments/assets/2b6d3877-a91c-45b3-bb18-cba169ec1cdf)
![Disclaimer](https://github.com/user-attachments/assets/a9b70b80-ef98-4bc4-99cf-ca906852fc60)
![Questionairre](https://github.com/user-attachments/assets/290b87f2-ee36-4341-bd80-ee5ebb45742d)
![Chat Page](https://github.com/user-attachments/assets/6f7fafd5-c3a9-421d-b7fc-8d5e2efbecce)

### Mobile Devices
![Mobile Login](https://github.com/user-attachments/assets/7fadd46b-272e-42cb-91f2-2b61aea189ea)
![Mobile Disclaimer](https://github.com/user-attachments/assets/6e48d6df-7a55-4bce-a75d-71e59e4f414e)
![Mobile Questionairre](https://github.com/user-attachments/assets/a0e560c6-eebf-4a5e-a3be-97d0d6cc0af2)
![Mobile Chat Page](https://github.com/user-attachments/assets/a5e454d1-8633-4086-840a-00994f0ab418)

## License
- The project is licened under the MIT License.
