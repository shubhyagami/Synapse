# Synapse Council – Multi‑Agent AI Boardroom Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net)  
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)](https://spring.io)  
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)  
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)  
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-0db7ed.svg)](https://docs.docker.com/compose/)  
[![License: Private](https://img.shields.io/badge/license-private-red.svg)](LICENSE)

---

## Overview

Synapse Council is a private, open‑source framework that emulates an executive boardroom. Ten specialized AI agents provide domain‑specific insights, then engage in structured cross‑review, critique, and iterative refinement until a consensus is reached. The result is a single, well‑reasoned response to any user query.

---

## Core Features

- **Ten AI Agents** – each representing a distinct board role (e.g., CEO, Product Manager, Security Engineer).  
- **Structured Debate Workflow** –  
  1. Independent analysis of the user prompt.  
  2. Cross‑review among agents.  
  3. Critique & debate.  
  4. Iterative improvement.  
  5. Consensus engine.  
  6. CEO summary.  
- **Real‑Time Interaction** – WebSocket and Server‑Sent Events (SSE) keep the UI updated without polling.  
- **Visual Workflow** – React Flow diagrams show agent relationships and message flow.  
- **Modular Architecture** – Docker Compose orchestrates the full stack: Spring Boot backend, React frontend, PostgreSQL, Redis, Qdrant, MinIO.

---

## Architecture

| Layer | Tech Stack |
|-------|------------|
| **Frontend** | React 19, TypeScript, TailwindCSS 4, Framer Motion, React Flow |
| **Backend** | Spring Boot 3.4, Java 21, WebSocket, SSE |
| **AI** | NVIDIA NIM – 10 independent models |
| **Database** | PostgreSQL 16, Redis 7, Qdrant 1.9 |
| **Storage** | MinIO |
| **Infrastructure** | Docker Compose |

---

## Getting Started

### Prerequisites

```
Docker
Java 21 (or JDK 21)
Node.js 20+
```

### Quick Start

```bash
# 1. Pull the repo
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Start all services
docker compose up -d

# 3. Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and add your NVIDIA NIM API keys

# 4. Build and run the backend
cd backend
mvn spring-boot:run

# 5. Install and run the frontend
cd ../frontend
npm install
npm run dev
```

Open your browser at <http://localhost:5173>.

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

```
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

- Standardized environment configuration.  
- Added SSE streaming for faster state updates.  
- Refined cross‑review and critique logic to improve consensus consistency.

---

## License

Private – All rights reserved.
