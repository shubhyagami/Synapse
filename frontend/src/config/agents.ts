/** Agent configuration and type definitions */

export interface AgentConfig {
  id: string
  name: string
  role: string
  model: string
  color: string
  avatar: string
  responsibilities: string[]
}

export type AgentStatusType =
  | 'idle'
  | 'thinking'
  | 'reviewing'
  | 'critiquing'
  | 'improving'
  | 'summarizing'
  | 'streaming'
  | 'complete'
  | 'unavailable'
  | 'error'

export interface AgentState extends AgentConfig {
  status: AgentStatusType
  latencyMs: number
  tokenCount: number
  retryCount: number
  currentContent: string
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'ceo',
    name: 'Alexandra Chen',
    role: 'CEO',
    model: 'z-ai/glm-5.2',
    color: 'var(--agent-ceo)',
    avatar: '👔',
    responsibilities: ['Business Vision', 'Decision Making', 'Consensus', 'Executive Summary'],
  },
  {
    id: 'product',
    name: 'Marcus Rivera',
    role: 'Product Manager',
    model: 'z-ai/glm-5.2',
    color: 'var(--agent-product)',
    avatar: '📋',
    responsibilities: ['Feature Prioritization', 'Roadmap', 'MVP', 'Business Impact'],
  },
  {
    id: 'backend',
    name: 'Priya Sharma',
    role: 'Backend Engineer',
    model: 'poolside/laguna-xs-2.1',
    color: 'var(--agent-backend)',
    avatar: '⚙️',
    responsibilities: ['Architecture', 'API Design', 'Performance', 'Scalability'],
  },
  {
    id: 'frontend',
    name: 'Jake Yamamoto',
    role: 'Frontend Engineer',
    model: 'google/gemma-4-31b-it',
    color: 'var(--agent-frontend)',
    avatar: '🎨',
    responsibilities: ['React', 'UX', 'Accessibility', 'Animations'],
  },
  {
    id: 'cloud',
    name: 'Fatima Al-Hassan',
    role: 'Cloud Architect',
    model: 'poolside/laguna-xs-2.1',
    color: 'var(--agent-cloud)',
    avatar: '☁️',
    responsibilities: ['AWS/Azure/GCP', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    id: 'security',
    name: 'Dmitri Volkov',
    role: 'Security Engineer',
    model: 'nvidia/nemotron-3-ultra-550b-a55b',
    color: 'var(--agent-security)',
    avatar: '🛡️',
    responsibilities: ['OWASP', 'Threat Modeling', 'Zero Trust', 'Encryption'],
  },
  {
    id: 'qa',
    name: 'Sarah Kim',
    role: 'QA Engineer',
    model: 'stepfun-ai/step-3.7-flash',
    color: 'var(--agent-qa)',
    avatar: '🧪',
    responsibilities: ['Testing', 'Automation', 'Edge Cases', 'Bug Detection'],
  },
  {
    id: 'marketing',
    name: 'Leo Dubois',
    role: 'Marketing Strategist',
    model: 'moonshotai/kimi-k2.6',
    color: 'var(--agent-marketing)',
    avatar: '📈',
    responsibilities: ['SEO', 'Growth', 'Pricing', 'Launch Strategy'],
  },
  {
    id: 'customer',
    name: 'Aisha Patel',
    role: 'Customer Analyst',
    model: 'moonshotai/kimi-k2.6',
    color: 'var(--agent-customer)',
    avatar: '💬',
    responsibilities: ['Feedback', 'Sentiment', 'Retention', 'Pain Points'],
  },
  {
    id: 'design',
    name: 'Emma Lindström',
    role: 'UI/UX Designer',
    model: 'google/gemma-4-31b-it',
    color: 'var(--agent-design)',
    avatar: '✨',
    responsibilities: ['Design Systems', 'Wireframes', 'User Journey', 'Accessibility'],
  },
]
