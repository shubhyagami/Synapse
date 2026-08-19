# Synapse Council

> A multi-agent AI boardroom platform where 10 specialized AI experts collaborate, debate, critique, and reach consensus before answering.

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)]()
[![React 19](https://img.shields.io/badge/React-19-blue.svg)]()
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)]()
[![License: Private](https://img.shields.io/badge/license-private-red.svg)]()

## Features

- **Multi-Agent Collaboration**: 10 specialized AI agents act as an executive board, each providing a distinct domain perspective.
- **Structured Debate Workflow**: Agents think independently, cross-review each other's input, critique, and iterate before reaching consensus.
- **Live Streaming**: Real-time agent interactions streamed via WebSocket and Server-Sent Events (SSE).
- **Visual Graphs**: Interactive agent relationship and workflow mapping using React Flow.

## Architecture

| Layer | Tech Stack |
|-------|------------|
| **Frontend** | React 19, TypeScript, TailwindCSS v4, Framer Motion, React Flow |
| **Backend** | Spring Boot 3.4, Java 21, WebSocket, SSE |
| **AI** | NVIDIA NIM (10 independent agents) |
| **Database** | PostgreSQL 16, Redis 7, Qdrant 1.9 |
| **Storage** | MinIO |
| **Infra** | Docker Compose |

## Getting Started

The project is divided into three main components: infrastructure (databases/queue), backend (Spring Boot), and frontend (React). Ensure you have Docker, Java 21, and Node.js installed before proceeding.

### 1. Start Infrastructure

Spin up the required databases and storage services using Docker Compose:

```bash
docker compose up -d
```

### 2. Configure Environment Variables

Copy the example environment file and add your NVIDIA NIM API keys:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

### 3. Run the Backend

Start the Spring Boot server. Ensure you are in the `backend` directory:

```bash
cd backend
mvn spring-boot:run
```

### 4. Run the Frontend

Install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

### 5. View the Application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser to access the platform.

## AI Board Members

| Agent | Role | Model |
|-------|------|-------|
| Alexandra Chen | CEO | z-ai/glm-5.2 |
| Marcus Rivera | Product Manager | z-ai/glm-5.2 |
| Priya Sharma | Backend Engineer | poolside/laguna-xs-2.1 |
| Jake Yamamoto | Frontend Engineer | google/gemma-4-31b-it |
| Fatima Al-Hassan | Cloud Architect | poolside/laguna-xs-2.1 |
| Dmitri Volkov | Security Engineer | nvidia/nemotron-3-ultra-550b-a55b |
| Sarah Kim | QA Engineer | stepfun-ai/step-3.7-flash |
| Leo Dubois | Marketing Strategist | moonshotai/kimi-k2.6 |
| Aisha Patel | Customer Analyst | moonshotai/kimi-k2.6 |
| Emma Lindström | UI/UX Designer | google/gemma-4-31b-it |

## Discussion Workflow

```text
User Query → Independent Analysis (10 Agents) → Cross-Review →
Critique & Debate → Iterative Improvement → Consensus Engine → CEO Summary → User
```

## Changelog

### v1.2.0 - 2026-08-20
- Standardized environment configuration and documentation.
- Enhanced live SSE streaming for faster agent state updates.
- Refined cross-review and critique workflow logic.

## License

Private — All rights reserved.
