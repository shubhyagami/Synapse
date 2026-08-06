# Synapse Council

> Multi-Agent AI Boardroom Platform — 10 specialized AI experts collaborate, debate, critique, improve, and reach consensus before answering.

## Architecture

| Layer | Tech |
|-------|------|
| **Frontend** | React 19 + TypeScript + TailwindCSS v4 + Framer Motion + React Flow |
| **Backend** | Spring Boot 3.4 + Java 21 + WebSocket + SSE |
| **AI** | NVIDIA NIM (10 independent agents) |
| **Database** | PostgreSQL 16 + Redis 7 + Qdrant 1.9 |
| **Storage** | MinIO |
| **Infra** | Docker Compose |

## Quick Start

### 1. Start Infrastructure
```bash
docker compose up -d
```

### 2. Configure API Keys
```bash
cp backend/.env.example backend/.env
# Edit .env with your NVIDIA NIM API keys
```

### 3. Start Backend
```bash
cd backend
.mvn\maven\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open
Navigate to [http://localhost:5173](http://localhost:5173)

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

```
User asks → All 10 agents think independently → Cross-review →
Critique & debate → Improve → Consensus engine → CEO summary → User
```

## License

Private — All rights reserved.
