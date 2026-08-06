export interface StartDiscussionResponse {
  status: string
  message: string
  prompt: string
  agents: number
  discussionId?: string
}

export interface AgentDto {
  id: string
  name: string
  role: string
  model: string
  avatar: string
  color: string
  responsibilities: string[]
  status: string
  latencyMs: number
  tokenCount: number
  retryCount: number
}

export interface DiscussionDto {
  id: string
  projectId: string
  userPrompt: string
  status: string
  currentRound: number
  totalRounds: number
  rounds: Array<{
    round: number
    name: string
    responses: Record<string, string>
    timestamp: string
    agentCount: number
  }>
  consensusReport?: {
    totalResponses?: number
    successfulResponses?: number
    successRate?: number
    overallConfidence?: string
    agentConfidences?: Record<string, number>
  }
  executiveSummary?: string
  createdAt: string
  completedAt?: string
}

const API_BASE = '/api'

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`)
  return res.json()
}

export async function fetchAgents(): Promise<AgentDto[]> {
  const res = await fetch(`${API_BASE}/discussions/agents`)
  return res.json()
}

export async function startBoardroomDiscussion(prompt: string, projectId = 'default'): Promise<StartDiscussionResponse> {
  const res = await fetch(`${API_BASE}/discussions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, projectId }),
  })
  if (!res.ok) {
    throw new Error(`Failed to start discussion: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchDiscussions(): Promise<DiscussionDto[]> {
  const res = await fetch(`${API_BASE}/discussions`)
  return res.json()
}

export async function fetchDiscussion(id: string): Promise<DiscussionDto> {
  const res = await fetch(`${API_BASE}/discussions/${id}`)
  return res.json()
}

export async function deleteDiscussionApi(id: string): Promise<void> {
  await fetch(`${API_BASE}/discussions/${id}`, {
    method: 'DELETE',
  })
}
