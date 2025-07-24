# AI Writing Critiquer

This project is an AI-powered writing critique agent that uses multiple large language models (LLMs) to provide diverse feedback on your writing. It is built with a Python backend using FastAPI and LangChain, and a Next.js frontend with Tailwind CSS and shadcn/ui.

## Project Structure

- `backend/`: Contains the FastAPI application, LangChain logic, and API endpoints.
- `frontend/`: Contains the Next.js application and user interface components.
- `docker-compose.yml`: Orchestrates the backend and frontend services.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Gopinathh22/ai-writing-critiquer.git
    cd ai-writing-critiquer
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the `backend/` directory by copying the example file:

    ```bash
    cp backend/.env.example backend/.env
    ```

    Open `backend/.env` and add your API keys for the following services:

    ```
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
    ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY"
    OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
    ```
    
    *Note: Since I was unable to create the `.env.example` file, you will have to create the `.env` file manually in the `backend` directory with the content above.*


3.  **Run the application:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images for the frontend and backend services and start the containers.

## Accessing the Application

-   **Frontend:** [http://localhost:3000](http://localhost:3000)
-   **Backend API:** [http://localhost:8000/docs](http://localhost:8000/docs)

## Services

-   **backend**: A FastAPI server running on `http://localhost:8000`.
-   **frontend**: A Next.js application running on `http://localhost:3000`. 