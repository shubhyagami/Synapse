# Synapse – AI‑Powered Boardroom Simulation

> A lightweight, open‑source platform that lets ten autonomous agents play the roles of an executive board. Each agent analyzes a user prompt, cross‑checks the others, debates, and refines the answer until the “CEO” delivers a consensus reply.

---

## Badges

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net)  
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)](https://spring.io)  
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)  
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)  
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-0db7ed.svg)](https://docs.docker.com/compose/)  
[![License: Private](https://img.shields.io/badge/license-private-red.svg)](LICENSE)

---

## Table of Contents

- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
- [AI Board Members](#ai-board-members)
- [Discussion Workflow](#discussion-workflow)
- [Changelog](#changelog)
- [License](#license)

---

## Architecture

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion, React Flow |
| **Backend** | Spring Boot 3.4, Java 21, WebSocket, SSE |
| **AI** | NVIDIA NIM – 10 distinct models |
| **Databases** | PostgreSQL 16, Redis 7, Qdrant 1.9 |
| **Storage** | MinIO |
| **Orchestration** | Docker Compose |

The backend exposes a WebSocket and SSE endpoint for real‑time updates. The frontend visualises the debate graph with React Flow and shows agent messages as they are produced.

---

## Getting Started

### Prerequisites

- **Docker** (20.10 +)
- **Docker Compose** (v2)
- **Java 21** (JDK 21)
- **Node.js** (20 + npm or yarn)

> **Tip:** The included Docker compose file runs the whole stack, but you can also run the backend and frontend separately (see the section below).

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Start all services
docker compose up -d

# 3. Configure environment variables
#   Copy the example and add your NVIDIA NIM keys
cp backend/.env.example backend/.env
nano backend/.env   # or your editor of choice

# 4. (Optional) Run the backend directly
cd backend
./mvnw spring-boot:run   # uses the wrapper script

# 5. (Optional) Run the frontend directly
cd ../frontend
npm install
npm run dev
```

Open <http://localhost:5173> to see the boardroom in action.

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

The workflow is implemented as a series of asynchronous Spring tasks. The frontend subscribes to updates via WebSocket, displaying each agent’s contribution as it arrives.

---

## Changelog

### v1.2.0 – 2026‑08‑21

- Standardized environment configuration
- Added SSE streaming for faster state updates
- Refined cross‑review and critique logic to improve consensus consistency

---

## License

Synapse is distributed under a **private license**. All rights reserved.  
See the [LICENSE](LICENSE) file for details.
