# Synapse Council: A Multi-Agent AI Boardroom Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)]()
[![React 19](https://img.shields.io/badge/React-19-blue.svg)]()
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)]()
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)]()
[![License: Private](https://img.shields.io/badge/license-private-red.svg)]()
[![npm version](https://badge.fury.io/js/%40synapse%2Fcouncil.svg)]()

## Overview

The Synapse Council is an open-source, multi-agent AI platform that simulates an executive boardroom. Our system allows AI agents to collaborate, debate, and reach consensus on user queries. This platform consists of 10 AI agents, each with a unique domain expertise, and a structured debate workflow that ensures efficient and informed decision-making.

## Features

### Core Capabilities

*   **Multi-Agent Collaboration**: 10 AI agents collaborate as an executive board, each contributing unique domain expertise.
*   **Structured Debate Workflow**: Agents conduct independent analysis, cross-review, critique, and iterate before achieving consensus.
*   **Real-Time Streaming**: Live agent interactions are streamed via WebSocket and Server-Sent Events (SSE).

### Key Benefits

*   Interactive visualizations of agent relationships and workflow mappings using React Flow.
*   Enhanced decision-making through asynchronous, agent-driven debate.

## Architecture

Our platform utilizes a robust tech stack consisting of:

| Layer | Tech Stack |
|-------|------------|
| **Frontend** | React 19, TypeScript, TailwindCSS v4, Framer Motion, React Flow |
| **Backend** | Spring Boot 3.4, Java 21, WebSocket, SSE |
| **AI** | NVIDIA NIM (10 independent agents) |
| **Database** | PostgreSQL 16, Redis 7, Qdrant 1.9 |
| **Storage** | MinIO |
| **Infra** | Docker Compose |

## Getting Started

### Prerequisites

Before you begin, ensure you have Docker, Java 21, and Node.js installed on your system.

### Setup Instructions

1.  **Start Infrastructure**: Spin up the required databases and storage services using Docker Compose:
    ```bash
docker compose up -d
```
2.  **Configure Environment Variables**: Copy the example environment file and add your NVIDIA NIM API keys:
    ```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```
3.  **Run the Backend**: Start the Spring Boot server from the `backend` directory:
    ```bash
cd backend
mvn spring-boot:run
```
4.  **Run the Frontend**: Install dependencies and start the development server:
    ```bash
cd frontend
npm install
npm run dev
```
5.  **View the Application**: Navigate to [http://localhost:5173](http://localhost:5173) in your browser to access the platform.

## AI Board Members

Our AI board consists of 10 highly skilled agents, each with a unique role and expertise.

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

Our discussion workflow is designed to facilitate efficient and informed decision-making.

```text
User Query → Independent Analysis (10 Agents) → Cross-Review →
Critique & Debate → Iterative Improvement → Consensus Engine → CEO Summary → User
```

## Changelog

### v1.2.0 (2026-08-21)

*   Standardized environment configuration and documentation.
*   Enhanced live SSE streaming for faster agent state updates.
*   Refined cross-review and critique workflow logic.

## License

Private — All rights reserved.
