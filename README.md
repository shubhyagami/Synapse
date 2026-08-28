# Synapse Council: A Multi‑Agent AI Boardroom Platform  

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net)  
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)  
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)](https://spring.io)  
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)  
[![License: Private](https://img.shields.io/badge/license-private-red.svg)](LICENSE)  

---

## Overview  

Synapse Council is an open‑source platform that simulates an executive boardroom using ten specialized AI agents. Each agent contributes domain‑specific insights, followed by cross‑review, critique, and iterative refinement until a consensus is reached, delivering structured, reasoned responses to user‑provided queries.

---

## Features  

### Core Capabilities  
- **Multi‑Agent Collaboration** – Ten AI agents act as an executive board, each with a distinct area of expertise.  
- **Structured Debate Workflow** – Independent analysis → cross‑review → critique → iterative refinement → consensus.  
- **Real‑Time Streaming** – Live interaction visualised via WebSocket and Server‑Sent Events (SSE).  

### User Benefits  
- Interactive visualisations of agent relationships and workflow with **React Flow**.  
- Improved decision quality through asynchronous, agent‑driven debate.  

---

## Architecture  

| Layer      | Technologies |
|------------|--------------|
| **Frontend** | React 19, TypeScript, TailwindCSS v4, Framer Motion, React Flow |
| **Backend**  | Spring Boot 3.4, Java 21, WebSocket, SSE |
| **AI**       | NVIDIA NIM (10 independent models) |
| **Database** | PostgreSQL 16, Redis 7, Qdrant 1.9 |
| **Storage**  | MinIO |
| **Infra**    | Docker Compose |

---

## Getting Started  

### Prerequisites  
- Docker  
- Java 21 (or JDK 21)  
- Node.js (v20+)  

### Setup  

1. **Start services**  
   ```bash
   docker compose up -d
   ```

2. **Configure environment**  
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your NVIDIA NIM API keys
   ```

3. **Run the backend**  
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Run the frontend**  
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open the app**  
   Navigate to <http://localhost:5173>.

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
User Query → Independent Analysis (10 Agents) → Cross‑Review → 
Critique & Debate → Iterative Improvement → Consensus Engine → 
CEO Summary → User
```

---

## Changelog  

### v1.2.0 (2026‑08‑21)  
- Added standardized environment configuration and improved documentation.  
- Enhanced live SSE streaming for faster state updates.  
- Refined cross‑review and critique logic for more consistent consensus.  

---

## License  

Private — All rights reserved.  

---  

*This README has been edited for clarity, correctness, and developer usability.*
