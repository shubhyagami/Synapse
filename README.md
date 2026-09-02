# Synapse Council – Multi‑Agent AI Boardroom Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net)  
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)](https://spring.io)  
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)  
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)  
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-0db7ed.svg)](https://docs.docker.com/compose/)  
[![License: Private](https://img.shields.io/badge/license-private-red.svg)](LICENSE)

---

## Overview

Synapse Council is a lightweight, open‑source platform that simulates an executive boardroom. Ten independent AI agents each assume a distinct board role, analyze user prompts, cross‑review each other’s outputs, debate, and refine until a single, consensus answer is produced. The final reply is provided by the “CEO” agent to the user.

---

## Core Features

- **Ten specialized agents** – CEO, Product Manager, Security Engineer, etc.  
- **Structured debate workflow** – independent analysis, cross‑review, critique, iterative refinement, consensus, CEO summary.  
- **Real‑time UI updates** – WebSocket and Server‑Sent Events (SSE).  
- **Visual workflow diagram** – React Flow shows agent interactions.  
- **Docker‑based** – easy to spin up the full stack with a single command.  
- **Modular architecture** – Spring Boot backend, React frontend, PostgreSQL, Redis, Qdrant, MinIO.

---

## Architecture

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, TailwindCSS 4, Framer Motion, React Flow |
| **Backend** | Spring Boot 3.4, Java 21, WebSocket, SSE |
| **AI** | NVIDIA NIM – 10 independent models |
| **Database** | PostgreSQL 16, Redis 7, Qdrant 1.9 |
| **Storage** | MinIO |
| **Orchestration** | Docker Compose |

---

## Getting Started

### Prerequisites

- Docker (20.10+)
- Docker Compose (v2)
- Java 21 (JDK 21)
- Node.js 20+ (npm or yarn)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Start all services in the background
docker compose up -d

# 3. Configure environment variables
# Copy the example and fill in your NVIDIA NIM API key
cp backend/.env.example backend/.env
# Edit backend/.env and add your NVIDIA NIM keys

# 4. Run the backend
cd backend
mvn spring-boot:run   # or use ./mvnw spring-boot:run if you prefer

# 5. Install and run the frontend
cd ../frontend
npm install
npm run dev
```

Open <http://localhost:5173> in your browser to see the boardroom in action.

---

## AI Board Members

| Agent | Role | Model |
|-------|------|-------|
| Alexandra Chen | CEO | z‑ai/glm‑5.2 |
| Marcus Rivera | Product Manager | z‑ai/glm‑5.2 |
| Priya Sharma | Backend Engineer | poolside/laguna‑xs‑2.1 |
| Jake Yamamoto | Frontend Engineer | google/gemma‑4‑31b‑it |
| Fatima Al‑Hassan | Cloud Architect | poolside/laguna‑xs‑2.1 |
| Dmitri Volkov | Security Engineer | nvidia/nemotron‑3‑ultra‑550b‑a55b |
| Sarah Kim | QA Engineer | stepfun‑ai/step‑3.7‑flash |
| Leo Dubois | Marketing Strategist | moonshotai/kimi‑k2.6 |
| Aisha Patel | Customer Analyst | moonshotai/kimi‑k2.6 |
| Emma Lindström | UI/UX Designer | google/gemma‑4‑31b‑it |

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

---

## Changelog

### v1.2.0 – 2026‑08‑21
* Standardized environment configuration
* Added SSE streaming for faster state updates
* Refined cross‑review and critique logic to improve consensus consistency

---

## License

Synapse is distributed under a private license. All rights reserved.  
See the [LICENSE](LICENSE) file for details.

---
