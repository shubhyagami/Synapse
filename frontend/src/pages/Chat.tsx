import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Send, Loader2, CheckCircle2, Sparkles, Plus, Search, History, ChevronLeft, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AGENTS } from '../config/agents'
import { startBoardroomDiscussion, fetchDiscussions, fetchDiscussion, deleteDiscussionApi, type DiscussionDto } from '../services/api'
import { connectBoardroomWebSocket, type BoardroomEvent } from '../services/websocket'
import { useParams, useNavigate } from 'react-router-dom'

interface Message {
  id: string
  agentId: string
  agentName: string
  agentRole: string
  agentAvatar: string
  agentColor: string
  content: string
  round: number
  timestamp: Date
  type: 'user' | 'agent' | 'system'
}

const API_KEY_DOTS: { color: string; gradient: string; label: string }[] = [
  { color: '#EF4444', gradient: 'radial-gradient(circle, #EF4444 0%, #DC2626 50%, #B91C1C 100%)', label: 'Key-A' },
  { color: '#3B82F6', gradient: 'radial-gradient(circle, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)', label: 'Key-B' },
  { color: '#10B981', gradient: 'radial-gradient(circle, #10B981 0%, #059669 50%, #047857 100%)', label: 'Key-C' },
  { color: '#F59E0B', gradient: 'radial-gradient(circle, #F59E0B 0%, #D97706 50%, #B45309 100%)', label: 'Key-D' },
]

function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

export function Chat() {
  const { id: routeId } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState<string>('')
  const [consensusData, setConsensusData] = useState<any>(null)
  const [activeApiKey, setActiveApiKey] = useState({ index: 0, color: '#EF4444', label: 'Key-A' })

  // History & Drawer States
  const [discussionsHistory, setDiscussionsHistory] = useState<DiscussionDto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, statusText])

  const loadHistory = async () => {
    try {
      const list = await fetchDiscussions()
      setDiscussionsHistory(list || [])
    } catch (e) {
      console.log('Error loading history:', e)
    }
  }

  // Load history list on mount
  useEffect(() => {
    loadHistory()
  }, [])

  // Sync route param :id with active discussion state
  useEffect(() => {
    if (routeId) {
      fetchDiscussion(routeId)
        .then((disc) => {
          if (disc) loadDiscussionToState(disc)
        })
        .catch(console.error)
    } else {
      // New Chat route (/chat)
      setMessages([])
      setConsensusData(null)
    }
  }, [routeId])

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const cleanup = connectBoardroomWebSocket((event: BoardroomEvent) => {
      console.log('WS Event:', event)

      if (event.type === 'DISCUSSION_STARTED') {
        setIsProcessing(true)
        setStatusText('Boardroom session started. Agents preparing proposals...')
      } else if (event.type === 'ROUND_STARTED') {
        const roundNames: Record<number, string> = {
          1: 'Round 1 — Independent Thinking',
          2: 'Round 2 — Cross-Review',
          3: 'Round 3 — Critique & Debate',
          4: 'Round 4 — Improvement & Consensus',
          5: 'Executive Summary',
        }
        const name = roundNames[event.round || 1] || `Round ${event.round}`
        setStatusText(`${name} in progress...`)
      } else if (event.type === 'AGENT_STATUS') {
        setStatusText(`${event.agentName} is ${event.agentStatus?.toLowerCase()}...`)
      } else if (event.type === 'AGENT_COMPLETE') {
        const agentConfig = AGENTS.find((a) => a.id === event.agentId || a.name === event.agentName)
        
        const newMsg: Message = {
          id: generateUUID(),
          agentId: event.agentId || 'agent',
          agentName: event.agentName || 'Agent',
          agentRole: agentConfig?.role || 'Board Member',
          agentAvatar: agentConfig?.avatar || '🤖',
          agentColor: agentConfig?.color || 'var(--accent-primary)',
          content: event.content || '',
          round: event.round || 1,
          timestamp: new Date(),
          type: 'agent',
        }

        setMessages((prev) => [...prev, newMsg])
      } else if (event.type === 'API_KEY_SWITCHED') {
        const idx = event.apiKeyIndex ?? 0
        const dot = API_KEY_DOTS[idx % API_KEY_DOTS.length]
        setActiveApiKey({ index: idx, color: dot.color, label: event.apiKeyLabel || dot.label })
        console.log(`[Synapse] API key switched to ${event.apiKeyLabel} (${event.reason})`)
      } else if (event.type === 'DISCUSSION_COMPLETE') {
        setIsProcessing(false)
        setStatusText('Boardroom discussion completed!')
        setConsensusData(event.data)
        loadHistory()
      }
    })

    return cleanup
  }, [])

  const loadDiscussionToState = (discussion: DiscussionDto) => {
    const newMsgs: Message[] = []

    // Add user prompt
    newMsgs.push({
      id: discussion.id,
      agentId: 'user',
      agentName: 'You',
      agentRole: 'User',
      agentAvatar: '👤',
      agentColor: 'var(--accent-primary)',
      content: discussion.userPrompt,
      round: 0,
      timestamp: new Date(discussion.createdAt),
      type: 'user',
    })

    // Load rounds
    if (discussion.rounds) {
      discussion.rounds.forEach((r) => {
        if (r.responses) {
          Object.entries(r.responses).forEach(([role, resp]) => {
            const agentConfig = AGENTS.find((a) => a.role === role)
            newMsgs.push({
              id: generateUUID(),
              agentId: agentConfig?.id || role.toLowerCase(),
              agentName: agentConfig?.name || role,
              agentRole: role,
              agentAvatar: agentConfig?.avatar || '👔',
              agentColor: agentConfig?.color || 'var(--accent-cyan)',
              content: resp,
              round: r.round,
              timestamp: new Date(r.timestamp),
              type: 'agent',
            })
          })
        }
      })
    }

    // Executive summary
    if (discussion.executiveSummary) {
      const ceo = AGENTS.find((a) => a.id === 'ceo')
      newMsgs.push({
        id: generateUUID(),
        agentId: 'ceo',
        agentName: ceo?.name || 'Alexandra Chen',
        agentRole: 'CEO',
        agentAvatar: ceo?.avatar || '👔',
        agentColor: ceo?.color || 'var(--agent-ceo)',
        content: discussion.executiveSummary,
        round: 5,
        timestamp: discussion.completedAt ? new Date(discussion.completedAt) : new Date(),
        type: 'agent',
      })
    }

    setMessages(newMsgs)
    if (discussion.consensusReport) {
      setConsensusData(discussion.consensusReport)
    }
  }

  const handleStartNewChat = () => {
    setMessages([])
    setConsensusData(null)
    setInput('')
    navigate('/chat')
  }

  const handleDeleteDiscussion = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await deleteDiscussionApi(id)
      setDiscussionsHistory((prev) => prev.filter((d) => d.id !== id))
      if (routeId === id) {
        handleStartNewChat()
      }
    } catch (err) {
      console.error('Error deleting discussion:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userPromptText = input.trim()
    setInput('')
    setIsProcessing(true)
    setStatusText('Initiating boardroom meeting across 10 NVIDIA NIM agents...')

    // Append user message to existing stream or new stream
    const userMsg: Message = {
      id: generateUUID(),
      agentId: 'user',
      agentName: 'You',
      agentRole: 'User',
      agentAvatar: '👤',
      agentColor: 'var(--accent-primary)',
      content: userPromptText,
      round: 0,
      timestamp: new Date(),
      type: 'user',
    }

    if (!routeId) {
      setMessages([userMsg])
    } else {
      setMessages((prev) => [...prev, userMsg])
    }

    try {
      await startBoardroomDiscussion(userPromptText)

      // Polling fallback
      const interval = setInterval(async () => {
        try {
          const list = await fetchDiscussions()
          if (list && list.length > 0) {
            const latest = list[0]
            if (latest.status === 'COMPLETED' || latest.status === 'FAILED') {
              clearInterval(interval)
              setIsProcessing(false)
              loadDiscussionToState(latest)
              loadHistory()
              if (!routeId && latest.id) {
                navigate(`/chat/${latest.id}`, { replace: true })
              }
            } else if (latest.rounds && latest.rounds.length > 0) {
              loadDiscussionToState(latest)
            }
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }, 4000)

    } catch (err: any) {
      setIsProcessing(false)
      setStatusText(`Error: ${err.message || 'Could not connect to backend'}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const filteredHistory = discussionsHistory.filter(
    (d) => !searchQuery || d.userPrompt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* ─── Chat History Sidebar ──────────────── */}
      <motion.div
        animate={{ width: isHistoryOpen ? 280 : 0, opacity: isHistoryOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* New Chat Button */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            className="btn-primary"
            onClick={handleStartNewChat}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Plus size={16} />
            New Discussion
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              style={{
                width: '100%',
                padding: '6px 12px 6px 30px',
                borderRadius: 6,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Discussion History List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {filteredHistory.length === 0 ? (
            <div style={{ padding: '20px 12px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              No history found
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isActive = routeId === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/chat/${item.id}`)}
                  className="history-item-row"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 8,
                    marginBottom: 4,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(34, 211, 238, 0.1))'
                      : 'transparent',
                    border: isActive ? '1px solid var(--accent-primary)55' : '1px solid transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: isActive ? 600 : 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                      }}
                    >
                      {item.userPrompt}
                    </div>
                    <button
                      onClick={(e) => handleDeleteDiscussion(e, item.id)}
                      title="Delete Discussion"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                        transition: 'color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-rose)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 4,
                      fontSize: '0.6875rem',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      {item.consensusReport?.overallConfidence || '92%'}
                    </span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </motion.div>

      {/* ─── Main Chat Content Container ────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* ─── Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px 32px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: '6px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Toggle History Sidebar"
            >
              {isHistoryOpen ? <ChevronLeft size={16} /> : <History size={16} />}
            </button>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                Boardroom Session
                {isProcessing && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 500 }} className="shimmer-text">
                    ● Live Meeting Active
                  </span>
                )}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {messages.length === 0 ? 'Ask a question to start a new discussion' : `${messages.length} responses across 10 AI agents`}
              </p>
            </div>
          </div>

        {/* Board member avatar row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              title={`${agent.name} (${agent.role}) — ${agent.model}`}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${agent.color}20`,
                border: `1px solid ${agent.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                position: 'relative',
              }}
            >
              {agent.avatar}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Messages Area ──────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
        }}
      >
        {messages.length === 0 ? (
          <EmptyState onSelectSuggestion={(promptText) => {
            setInput(promptText)
            setTimeout(() => {
              inputRef.current?.focus()
            }, 50)
          }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, index) => {
              const showRoundHeader =
                msg.round > 0 &&
                (index === 0 || messages[index - 1].round !== msg.round)

              const roundTitle =
                msg.round === 1 ? 'Round 1 — Independent Thinking' :
                msg.round === 2 ? 'Round 2 — Cross-Review' :
                msg.round === 3 ? 'Round 3 — Critique & Debate' :
                msg.round === 4 ? 'Round 4 — Improvement & Consensus' :
                msg.round === 5 ? '🏆 Executive Summary & Final Consensus' : `Round ${msg.round}`

              return (
                <div key={msg.id || index}>
                  {showRoundHeader && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        margin: '24px 0 16px',
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: msg.round === 5 
                          ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.25), rgba(34, 211, 238, 0.2))'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: msg.round === 5
                          ? '1px solid var(--accent-primary)'
                          : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: msg.round === 5 ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>
                        {roundTitle}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        {msg.round === 5 ? 'CEO Synthesis' : '10 Agent Deliberation'}
                      </span>
                    </motion.div>
                  )}
                  <MessageBubble message={msg} />
                </div>
              )
            })}

            {/* Consensus report summary card */}
            {consensusData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                  padding: '24px',
                  marginTop: 20,
                  border: '1px solid var(--accent-emerald)',
                  background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(17, 22, 49, 0.8))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <CheckCircle2 size={24} color="var(--accent-emerald)" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Boardroom Consensus Reached</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Overall Confidence: <strong>{consensusData.overallConfidence || '85%'}</strong> | Success Rate: {Math.round((consensusData.successRate || 1) * 100)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Agent Activity Bar ─────────────────── */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            padding: '12px 32px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            background: 'rgba(108, 92, 231, 0.08)',
          }}
        >
          <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-cyan)' }} />
          <span className="shimmer-text" style={{ fontWeight: 500, flex: 1 }}>
            {statusText || 'Boardroom agents in active deliberation...'}
          </span>

          {/* API Key Indicator Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginRight: 4 }}>API:</span>
            {API_KEY_DOTS.map((dot, i) => (
              <div
                key={i}
                title={`${dot.label} ${i === activeApiKey.index ? '(ACTIVE)' : ''}`}
                style={{
                  width: i === activeApiKey.index ? 12 : 8,
                  height: i === activeApiKey.index ? 12 : 8,
                  borderRadius: '50%',
                  background: i === activeApiKey.index ? dot.gradient : `${dot.color}30`,
                  border: i === activeApiKey.index ? `2px solid ${dot.color}` : `1px solid ${dot.color}40`,
                  boxShadow: i === activeApiKey.index ? `0 0 8px ${dot.color}80, 0 0 16px ${dot.color}40` : 'none',
                  transition: 'all 0.4s ease',
                  animation: i === activeApiKey.index ? 'apiKeyPulse 2s ease-in-out infinite' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Input Area ─────────────────────────── */}
      <div
        style={{
          padding: '20px 32px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the boardroom anything... (e.g. 'Build an AI IDE')"
            className="input-glass"
            rows={1}
            style={{
              flex: 1,
              resize: 'none',
              minHeight: 48,
              maxHeight: 160,
              lineHeight: '24px',
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={!input.trim() || isProcessing}
            style={{
              padding: '12px 24px',
              opacity: !input.trim() || isProcessing ? 0.5 : 1,
              cursor: !input.trim() || isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isProcessing ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <Send size={18} />
                <span>Discuss</span>
              </>
            )}
          </button>
        </form>
        <p
          style={{
            marginTop: 8,
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          Powered exclusively by NVIDIA NIM · 10 AI Agents · Rate limited to 38 RPM
        </p>
      </div>
    </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes apiKeyPulse {
          0%, 100% { box-shadow: 0 0 6px currentColor, 0 0 12px currentColor; transform: scale(1); }
          50% { box-shadow: 0 0 12px currentColor, 0 0 24px currentColor; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        marginBottom: 16,
        display: 'flex',
        gap: 14,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: isUser
            ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))'
            : `${message.agentColor}22`,
          border: isUser ? 'none' : `1px solid ${message.agentColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          flexShrink: 0,
          boxShadow: isUser ? '0 0 16px rgba(108, 92, 231, 0.4)' : undefined,
        }}
      >
        {message.agentAvatar}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '82%', width: isUser ? undefined : '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
            flexDirection: isUser ? 'row-reverse' : 'row',
          }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: message.agentColor }}>
            {message.agentName}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              padding: '2px 8px',
              borderRadius: 6,
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {message.agentRole}
          </span>
        </div>

        <div
          className={isUser ? '' : 'glass-subtle'}
          style={{
            padding: '14px 18px',
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: isUser
              ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))'
              : undefined,
            borderLeft: isUser ? undefined : `3px solid ${message.agentColor}`,
            fontSize: '0.925rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
          }}
        >
          {isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState({ onSelectSuggestion }: { onSelectSuggestion: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        textAlign: 'center',
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.25), rgba(34, 211, 238, 0.15))',
          border: '1px solid rgba(108, 92, 231, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
          marginBottom: 24,
          boxShadow: '0 0 40px rgba(108, 92, 231, 0.25)',
        }}
      >
        ⚡
      </motion.div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
        <span className="text-gradient">Synapse Boardroom Ready</span>
      </h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          maxWidth: 520,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        Enter your request. 10 specialized AI agents will independently propose, cross-review, critique, improve, and reach consensus via NVIDIA NIM models.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 460 }}>
        {[
          'Build an AI IDE',
          'Design a high-throughput payment gateway in Rust',
          'Architect a real-time multiplayer video collaboration platform',
        ].map((promptText) => (
          <button
            key={promptText}
            onClick={() => onSelectSuggestion(promptText)}
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <span>"{promptText}"</span>
            <Sparkles size={14} color="var(--accent-secondary)" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
