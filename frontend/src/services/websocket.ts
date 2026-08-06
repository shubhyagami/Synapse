import { Client } from '@stomp/stompjs'

export interface BoardroomEvent {
  type:
    | 'DISCUSSION_STARTED'
    | 'ROUND_STARTED'
    | 'AGENT_STATUS'
    | 'AGENT_TOKEN'
    | 'AGENT_COMPLETE'
    | 'AGENT_ERROR'
    | 'ROUND_COMPLETE'
    | 'CONSENSUS_UPDATE'
    | 'DISCUSSION_COMPLETE'
    | 'API_KEY_SWITCHED'
  discussionId?: string
  agentId?: string
  agentName?: string
  agentStatus?: string
  round?: number
  token?: string
  content?: string
  data?: any
  timestamp?: string
  // API key rotation fields
  apiKeyIndex?: number
  apiKeyColor?: string
  apiKeyLabel?: string
  reason?: string
}

export type EventCallback = (event: BoardroomEvent) => void

let stompClient: Client | null = null

export function connectBoardroomWebSocket(onEvent: EventCallback): () => void {
  // Use native WebSocket (ws:// or wss://) — no SockJS needed
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/ws/boardroom`

  stompClient = new Client({
    brokerURL: wsUrl,
    reconnectDelay: 3000,
    debug: () => {},
    onConnect: () => {
      console.log('[Synapse] Connected to Boardroom WebSocket')
      stompClient?.subscribe('/topic/boardroom', (message) => {
        try {
          const event: BoardroomEvent = JSON.parse(message.body)
          onEvent(event)
        } catch (e) {
          console.error('[Synapse] Failed to parse STOMP message', e)
        }
      })
    },
    onStompError: (frame) => {
      console.error('[Synapse] STOMP Error:', frame.headers['message'], frame.body)
    },
    onWebSocketError: (evt) => {
      console.warn('[Synapse] WebSocket connection error — will retry', evt)
    },
  })

  stompClient.activate()

  return () => {
    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
    }
  }
}
