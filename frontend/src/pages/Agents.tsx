import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { AGENTS } from '../config/agents'
import { Cpu, Zap, Clock, RotateCcw } from 'lucide-react'
import { fetchAgents, type AgentDto } from '../services/api'

export function Agents() {
  const [liveAgents, setLiveAgents] = useState<AgentDto[]>([])

  useEffect(() => {
    fetchAgents().then(setLiveAgents).catch(console.error)
  }, [])

  const agentMap = new Map(liveAgents.map(a => [a.id, a]))

  return (
    <div style={{ padding: '32px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>
          <span className="text-gradient">AI Board Members</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          10 specialized experts powered by NVIDIA NIM. Each agent has its own model, memory, and reasoning style.
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {AGENTS.map((agent, index) => {
          const live = agentMap.get(agent.id)
          const status = live?.status || 'IDLE'
          const isBusy = status === 'THINKING' || status === 'REVIEWING' || status === 'CRITIQUING' || status === 'IMPROVING' || status === 'SUMMARIZING'

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="glass-card"
              style={{
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${agent.color}25, ${agent.color}10)`,
                  border: `1px solid ${agent.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0,
                }}
              >
                {agent.avatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{agent.name}</span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      padding: '2px 10px',
                      background: `${agent.color}20`,
                      border: `1px solid ${agent.color}30`,
                      borderRadius: 20,
                      color: agent.color,
                      fontWeight: 600,
                    }}
                  >
                    {agent.role}
                  </span>
                  {status !== 'IDLE' && (
                    <span
                      style={{
                        fontSize: '0.625rem',
                        padding: '2px 8px',
                        background: 'rgba(255, 170, 0, 0.15)',
                        border: '1px solid rgba(255, 170, 0, 0.3)',
                        borderRadius: 12,
                        color: 'var(--accent-amber)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {status}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {agent.responsibilities.map((r) => (
                    <span
                      key={r}
                      style={{
                        fontSize: '0.6875rem',
                        padding: '3px 10px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Model + Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-tertiary)',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '6px 14px',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Cpu size={13} />
                  {agent.model}
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { icon: Zap, value: live?.tokenCount ? live.tokenCount.toLocaleString() : '—', label: 'Tokens' },
                    { icon: Clock, value: live?.latencyMs ? `${live.latencyMs}ms` : '—', label: 'Latency' },
                    { icon: RotateCcw, value: (live?.retryCount ?? 0).toString(), label: 'Retries' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        minWidth: 50
                      }}
                    >
                      <stat.icon size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{stat.value}</span>
                      <span style={{ fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: isBusy ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    boxShadow: `0 0 10px ${isBusy ? 'var(--accent-amber)' : 'var(--accent-emerald)'}`,
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

