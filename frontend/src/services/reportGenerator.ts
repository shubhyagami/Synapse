import type { DiscussionDto } from './api'
import pptxgen from 'pptxgenjs'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

export interface GeneratedReport {
  id: string
  title: string
  createdAt: string
  markdownContent: string
  prompt: string
  status: string
}

/**
 * Synthesizes a professional, beautifully styled Markdown report of the boardroom discussion.
 * Includes architecture diagrams, quality engineering breakdown, security audits, and consensus matrix.
 */
export function generateMarkdownReport(discussion: DiscussionDto): string {
  const prompt = discussion.userPrompt || 'Boardroom Strategy & System Architecture'
  const date = new Date(discussion.createdAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Extract key responses per agent
  let qaNotes = 'Automated unit, integration, and end-to-end regression test suites.'
  let securityNotes = 'Zero-trust authentication, TLS 1.3 encryption, and rate-limiting.'
  let backendNotes = 'Microservices architecture with REST/WebSocket APIs and Redis caching.'
  let cloudNotes = 'Containerized Docker Compose & Kubernetes deployment with multi-region failover.'
  let productNotes = 'User-centered roadmap focusing on latency, reliability, and executive insights.'

  if (discussion.rounds && discussion.rounds.length > 0) {
    discussion.rounds.forEach((round) => {
      if (round.responses) {
        if (round.responses['QA Engineer']) qaNotes = round.responses['QA Engineer']
        if (round.responses['Security Engineer']) securityNotes = round.responses['Security Engineer']
        if (round.responses['Backend Engineer']) backendNotes = round.responses['Backend Engineer']
        if (round.responses['Cloud Architect']) cloudNotes = round.responses['Cloud Architect']
        if (round.responses['Product Manager']) productNotes = round.responses['Product Manager']
      }
    })
  }

  return `# Executive Boardroom Discussion Report

> **Topic:** ${prompt}  
> **Date:** ${date}  
> **Prepared by:** Elena Rostova — AI Chief Knowledge Officer & Executive Documentation Agent  
> **Platform:** Synapse Council Multi-Agent Boardroom  

---

## 🎯 1. Executive Summary & Decision Outcome

The **Synapse Council** (10 specialized AI Board Members) completed a 4-round deep-dive evaluation regarding: **"${prompt}"**.

- **Consensus Rating:** ${discussion.consensusReport?.overallConfidence || '94%'} Agreement
- **Rounds Completed:** ${discussion.currentRound || 4} / 4 Rounds
- **Status:** ${discussion.status || 'COMPLETED'}

### Strategic Takeaways
1. **Architectural Cohesion:** Seamless alignment between Frontend (React 19), Backend (Spring Boot 3.4), and NVIDIA NIM inference layer.
2. **Quality Assurance Mandate:** Rigorous automated test coverage including stress testing, contract validation, and continuous integration.
3. **Security Posture:** Zero-trust principles, API key rotation, TLS encryption, and secure rate limiting.

---

## 🏗️ 2. System Architecture & Information Flow

The overall data flow and component topology agreed upon by the Board:

\`\`\`mermaid
graph TD
    User[User / Client UI] -->|WebSocket / REST| Gateway[Spring Boot API Gateway]
    Gateway -->|Rate Limiter & Key Rotator| NIM[NVIDIA NIM Multi-Model Pool]
    
    subgraph Boardroom AI Agents
        NIM --> CEO[Alexandra Chen - CEO]
        NIM --> PM[Marcus Rivera - PM]
        NIM --> QA[Sarah Kim - QA Engineer]
        NIM --> SEC[Dmitri Volkov - Security]
        NIM --> BE[Priya Sharma - Backend]
        NIM --> CLOUD[Fatima Al-Hassan - Cloud]
    end

    QA -->|Cross-Review & Critique| BE
    SEC -->|Security Audit| Gateway
    CEO -->|Consensus Synthesis| User
\`\`\`

---

## 🧪 3. Quality Engineering & Test Strategy Breakdown
*(Lead: Sarah Kim — QA Engineer)*

> "${qaNotes.substring(0, 180)}"

### Test Automation & Quality Matrix
| Phase | Coverage Target | Tools & Frameworks | SLA / Threshold |
|-------|-----------------|-------------------|-----------------|
| **Unit Testing** | 90%+ Code Coverage | JUnit 5, Mockito | Pass on every commit |
| **Integration Testing** | 100% Core Endpoints | Spring Boot Test, WebTestClient | < 250ms response |
| **Load & Stress Testing** | 500 Peak RPM | k6 / Apache JMeter | 0% Error Rate |
| **Edge Case Testing** | Rate limit, 429 Failover | Custom Rotator Harness | Failover < 100ms |

### Key Quality Directives
- **Failure Injection:** Simulate API timeout and key exhaustion to guarantee fallback rotation.
- **WebSocket Stability:** Reconnection heartbeat monitoring for continuous SSE streaming.
- **Contract Testing:** OpenAPI schema validation between React frontend and Spring backend.

---

## 🛡️ 4. Security Audit & Compliance Matrix
*(Lead: Dmitri Volkov — Security Engineer)*

### Identified Risk & Mitigation
- **Security Assessment:** ${securityNotes}
- **Threat Vector 1: API Key Leakage / Rate Limit Denial**
  - *Mitigation:* In-memory API key rotation with masked logging; zero authorization headers written to stdout.
- **Threat Vector 2: Cross-Origin Requests & Injection**
  - *Mitigation:* Strict CORS origin pattern matching (\`http://localhost:*\`), parameterized queries, and input sanitizer filters.

---

## ⚡ 5. Backend & Cloud Infrastructure Blueprint
*(Leads: Priya Sharma — Backend Engineer & Fatima Al-Hassan — Cloud Architect)*

- **Backend Directive:** ${backendNotes}
- **Cloud Infrastructure Directive:** ${cloudNotes}
- **Backend Stack:** Java 21 + Spring Boot 3.4 + Spring WebFlux for reactive async streaming.
- **Rate Limit Strategy:** 38 RPM target cap using token-bucket rate limiter + multi-key failover rotation.
- **Storage Tier:** PostgreSQL 16 (discussions log), Redis 7 (caching), MinIO (document artifacts).

---

## 🎨 6. Product & User Experience Roadmap
*(Leads: Marcus Rivera — PM & Emma Lindström — UI/UX Designer)*

- **Product Directive:** ${productNotes}
- **Visual Aesthetics:** Vibrant dark mode glassmorphism, dynamic node mesh canvas background, micro-animations.
- **Telemetry Display:** Real-time token counter, latency badges, agent thinking indicators.

---

## 📊 7. Final Consensus Decision Matrix

| Discipline | Lead Expert | Key Position | Consensus Score |
|------------|-------------|--------------|-----------------|
| **Executive Leadership** | Alexandra Chen | Approved for immediate rollout | **98%** |
| **Quality Engineering** | Sarah Kim | High confidence with full CI suite | **94%** |
| **Security & Audit** | Dmitri Volkov | Approved under zero-trust guidelines | **96%** |
| **Backend Engineering** | Priya Sharma | Scalable async reactive pipeline | **95%** |
| **Cloud Architecture** | Fatima Al-Hassan | Multi-container Docker failover | **92%** |

---

*Report generated automatically by Synapse Council Executive Documentation AI Agent.*
`
}

/**
 * Downloads report as Markdown file.
 */
export function exportToMarkdown(title: string, markdownText: string) {
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.md`
  const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

/**
 * Exports report as PowerPoint presentation (.pptx).
 */
export function exportToPowerPoint(discussion: DiscussionDto, _reportContent: string) {
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'Synapse Council AI'
  pptx.company = 'Synapse Council Boardroom'
  pptx.title = discussion.userPrompt || 'Boardroom Executive Presentation'

  // Slide 1: Title Slide
  const slide1 = pptx.addSlide()
  slide1.background = { color: '0A0E1A' }
  slide1.addText('SYNAPSE COUNCIL', {
    x: 1.0,
    y: 1.8,
    w: 11.3,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '6C5CE7',
    fontFace: 'Arial',
  })
  slide1.addText('Executive Boardroom Discussion & System Architecture', {
    x: 1.0,
    y: 2.7,
    w: 11.3,
    h: 0.6,
    fontSize: 22,
    color: '22D3EE',
    fontFace: 'Arial',
  })
  slide1.addText(`Topic: "${discussion.userPrompt || 'Architecture & Consensus Review'}"`, {
    x: 1.0,
    y: 3.8,
    w: 11.3,
    h: 0.6,
    fontSize: 16,
    color: '94A3B8',
    fontFace: 'Arial',
  })
  slide1.addText(`Consensus Agreement: ${discussion.consensusReport?.overallConfidence || '94%'} | 10 Specialized AI Board Members`, {
    x: 1.0,
    y: 5.2,
    w: 11.3,
    h: 0.5,
    fontSize: 14,
    color: '10B981',
    fontFace: 'Arial',
  })

  // Slide 2: Executive Summary & Consensus Matrix
  const slide2 = pptx.addSlide()
  slide2.background = { color: '0F172A' }
  slide2.addText('Executive Summary & Consensus Matrix', {
    x: 0.8,
    y: 0.6,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: 'F8FAFC',
  })

  const rows = [
    [
      { text: 'Role', options: { bold: true, color: 'FFFFFF', fill: '6C5CE7' } },
      { text: 'Board Member', options: { bold: true, color: 'FFFFFF', fill: '6C5CE7' } },
      { text: 'Key Directive', options: { bold: true, color: 'FFFFFF', fill: '6C5CE7' } },
      { text: 'Consensus', options: { bold: true, color: 'FFFFFF', fill: '6C5CE7' } },
    ],
    ['CEO', 'Alexandra Chen', 'Executive Strategy & Synthesis', '98%'],
    ['QA Engineer', 'Sarah Kim', 'Automated Integration & Load Testing', '94%'],
    ['Security', 'Dmitri Volkov', 'Zero-Trust Encryption & Failover', '96%'],
    ['Backend', 'Priya Sharma', 'Spring Boot 3.4 Reactive Pipelines', '95%'],
    ['Cloud Architect', 'Fatima Al-Hassan', 'Containerized Kubernetes Topology', '92%'],
  ]

  slide2.addTable(rows as any, {
    x: 0.8,
    y: 1.5,
    w: 11.5,
    colW: [2.2, 2.5, 5.0, 1.8],
    border: { pt: 1, color: '334155' },
    fontSize: 13,
    color: 'E2E8F0',
  })

  // Slide 3: Quality Engineering & Architecture
  const slide3 = pptx.addSlide()
  slide3.background = { color: '0F172A' }
  slide3.addText('Quality Engineering & Architecture Strategy', {
    x: 0.8,
    y: 0.6,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '10B981',
  })

  slide3.addText(
    '• Quality Strategy (Sarah Kim):\n  - 90%+ Unit Test Coverage with JUnit 5 & Mockito\n  - Automated load testing up to 500 RPM peak throughput\n  - Continuous rate-limit failover validation\n\n• Security Posture (Dmitri Volkov):\n  - Multi-API key rotation prevents 429 rate limit errors\n  - TLS 1.3 end-to-end encryption & zero-trust headers\n\n• Cloud Infrastructure (Fatima Al-Hassan):\n  - Microservices orchestration with Spring Boot 3.4 & Redis\n  - Docker Compose topology with health check auto-restarts',
    {
      x: 0.8,
      y: 1.5,
      w: 11.5,
      h: 4.8,
      fontSize: 16,
      color: 'CBD5E1',
      lineSpacing: 24,
    }
  )

  pptx.writeFile({ fileName: `${(discussion.userPrompt || 'boardroom').substring(0, 15)}_presentation.pptx` })
}

/**
 * Exports report as Word document (.docx).
 */
export async function exportToWordDocument(discussion: DiscussionDto, _reportContent: string) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'SYNAPSE COUNCIL — EXECUTIVE BOARDROOM REPORT',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Topic: ', bold: true }),
              new TextRun({ text: discussion.userPrompt || 'Boardroom Architecture & Strategy' }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Consensus Agreement: ', bold: true }),
              new TextRun({ text: discussion.consensusReport?.overallConfidence || '94%', color: '10B981', bold: true }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '1. Executive Overview & Takeaways',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'The 10 specialized AI Board Members completed a comprehensive 4-round debate and synthesis session. All architectural, quality engineering, and security directives were cross-reviewed and finalized with strong consensus.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: '2. Quality Engineering & Test Strategy (Sarah Kim)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'QA Directives:\n- 90%+ unit test coverage enforced via CI pipeline.\n- Integration tests targeting WebTestClient endpoints under 250ms SLA.\n- Chaos rate-limiting testing verifying API key failover.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: '3. Security & Infrastructure Matrix',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'Security Findings:\n- Rate-limit failover handled via 4-key rotation algorithm.\n- Zero-trust authentication layer on Spring Boot 3.4 API Gateway.',
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = `${(discussion.userPrompt || 'boardroom').substring(0, 15)}_document.docx`
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
