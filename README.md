# Synapse – AI‑Powered Boardroom Simulation

**Synapse** is a lightweight, open‑source platform that lets ten autonomous agents play the roles of an executive board. Each agent analyzes a user prompt, cross‑checks the others, debates, and refines the answer until the “CEO” delivers a consensus reply.

---

## 🚦 Build & CI

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-private-red.svg)](LICENSE)

---

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Environment Variables](#environment-variables)
  - [Running Components Separately](#running-components-separately)
- [AI Board Members](#ai-board-members)
- [Discussion Workflow](#discussion-workflow)
- [Features](#features)
- [Changelog](#changelog)
- [License](#license)

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Spin up the full stack with Docker Compose
docker compose up -d

# 3. Create and edit secrets
cp backend/.env.example backend/.env
nano backend/.env
```

Open <http://localhost:5173> to see the boardroom.

---

## Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion, React Flow | Visualises debate graphs, streams agent messages via WebSocket |
| **Backend** | Spring Boot 3.4 (Java 21) | Provides REST, WebSocket, and SSE endpoints for real‑time collaboration |
| **LLM Orchestration** | NVIDIA NIM (10 models) | Each agent runs a separate LLM instance |
| **Data Store** | PostgreSQL 16, Redis 7, Qdrant 1.9 | Persists conversation state, caches, and vector search |
| **Object Storage** | MinIO | Holds media attachments and logs |
| **Deployment** | Docker Compose | Launches the entire stack with one command |

---

## Installation

### Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| Docker | 20.10+ |
| Docker Compose | v2 |
| Java JDK | 21 |
| Node.js | 20+ (npm or yarn) |

> **Tip**: The Docker Compose file contains all services. If you prefer running the frontend or backend locally, see the section below.

### Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Start the stack
docker compose up -d

# 3. Configure secrets
cp backend/.env.example backend/.env
nano backend/.env
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NVIDIA_NIM_API_KEY_1` … `NVIDIA_NIM_API_KEY_10` | API keys for up to ten NIM models |
| `DB_URL` | PostgreSQL JDBC URL |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

Rename `backend/.env.example` to `.env` and fill in the placeholders.

### Running Components Separately

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd ../frontend
npm install
npm run dev
```

Both services must be reachable on their default ports (`8080` for the backend, `5173` for the frontend). The UI will not load without a running backend.

---

## AI Board Members

| Agent | Role | Model |
|-------|------|-------|
| Alexandra Chen | CEO | `z-ai/glm-5.2` |
| Marcus Rivera | Product Manager | `z-ai/glm-5.2` |
| Priya Sharma | Backend Engineer | `poolside/laguna-xs-2.1` |
| Jake Yamamoto | Frontend Engineer | `google/gemma-4-31b-it` |
| Fatima Al‑Hassan | Cloud Architect | `poolside/laguna-xs-2.1` |
| Dmitri Volkov | Security Engineer | `nvidia/nemotron-3-ultra-550b-a55b` |
| Sarah Kim | QA Engineer | `stepfun-ai/step-3.7-flash` |
| Leo Dubois | Marketing Strategist | `moonshotai/kimi-k2.6` |
| Aisha Patel | Customer Analyst | `moonshotai/kimi-k2.6` |
| Emma Lindström | UI/UX Designer | `google/gemma-4-31b-it` |

---

## Discussion Workflow

```text
User query
   ↓
Independent analysis (10 agents)
   ↓
Cross‑review
   ↓
Critique & debate
   ↓
Iterative improvement
   ↓
Consensus engine
   ↓
CEO summary → User
```

The workflow is driven by Spring’s async tasks. The frontend subscribes via WebSocket and renders each contribution in real time.

---

## Features

- **Real‑time collaboration** – SSE and WebSocket streams keep the UI live.
- **Asynchronous agent execution** – Spring Boot’s task executor scales automatically.
- **Vector search** – Qdrant powers quick similarity queries for long conversations.
- **Extensible roles** – Add or replace agents by editing `backend/.env`.
- **Secure storage** – MinIO for files, Redis for caching, PostgreSQL for persistence.
- **One‑click launch** – Docker Compose brings the entire stack up with a single command.

---

## Changelog

### v1.2.0 – 2026‑08‑21

- Standardised environment configuration.
- Added SSE streaming for faster UI updates.
- Refined cross‑review logic to improve consensus accuracy.

---

## License

Synapse is distributed under a **private license**. All rights reserved.  
See the [LICENSE](LICENSE) file for details.
