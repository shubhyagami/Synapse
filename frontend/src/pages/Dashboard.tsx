import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  MessageSquare,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Activity,
} from 'lucide-react'
import { AGENTS } from '../config/agents'
import { useNavigate } from 'react-router-dom'
import { fetchAgents, fetchDiscussions, type AgentDto, type DiscussionDto } from '../services/api'

function AgentCard({ agent, liveAgent, index }: { agent: typeof AGENTS[0]; liveAgent?: AgentDto; index: number }) {
  const status = liveAgent?.status || 'IDLE'
  const isBusy = status === 'THINKING' || status === 'REVIEWING' || status === 'CRITIQUING' || status === 'IMPROVING' || status === 'SUMMARIZING'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.5, type: 'spring', stiffness: 200 }}
      className="glass-card"
      style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
          opacity: 0.6,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${agent.color}22, ${agent.color}11)`,
            border: `1px solid ${agent.color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
          }}
        >
          {agent.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{agent.name}</div>
          <div style={{ fontSize: '0.75rem', color: agent.color, fontWeight: 500 }}>
            {agent.role}
          </div>
        </div>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isBusy ? 'var(--accent-amber)' : 'var(--accent-emerald)',
            boxShadow: `0 0 8px ${isBusy ? 'var(--accent-amber)' : 'var(--accent-emerald)'}`,
          }}
          className="status-dot active"
        />
      </div>

      <div
        style={{
          fontSize: '0.6875rem',
          color: 'var(--text-tertiary)',
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 10px',
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        {agent.model}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {agent.responsibilities.slice(0, 3).map((r) => (
          <span
            key={r}
            style={{
              fontSize: '0.6875rem',
              padding: '3px 8px',
              background: `${agent.color}15`,
              border: `1px solid ${agent.color}25`,
              borderRadius: 6,
              color: 'var(--text-secondary)',
            }}
          >
            {r}
          </span>
        ))}
      </div>

      {/* Metrics row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.6875rem',
          color: 'var(--text-tertiary)',
        }}
      >
        <span>Latency: {liveAgent?.latencyMs ? `${liveAgent.latencyMs}ms` : '—'}</span>
        <span>Tokens: {liveAgent?.tokenCount ? liveAgent.tokenCount.toLocaleString() : '—'}</span>
        <span>Retries: {liveAgent?.retryCount ?? 0}</span>
      </div>
    </motion.div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<AgentDto[]>([])
  const [discussions, setDiscussions] = useState<DiscussionDto[]>([])

  useEffect(() => {
    fetchAgents().then(setAgents).catch(console.error)
    fetchDiscussions().then(setDiscussions).catch(console.error)
  }, [])

  const liveAgentMap = new Map(agents.map(a => [a.id, a]))
  const totalDiscussions = discussions.length
  
  // Calculate average latency
  const latencies = agents.map(a => a.latencyMs).filter(l => l > 0)
  const avgLatency = latencies.length > 0
    ? `${Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)}ms`
    : '—'

  // Calculate consensus rate
  const completedDiscussions = discussions.filter(d => d.status === 'COMPLETED')
  const avgConsensus = completedDiscussions.length > 0
    ? `${Math.round(completedDiscussions.reduce((acc, d) => {
        const confStr = d.consensusReport?.overallConfidence || '75%'
        const num = parseInt(confStr.replace('%', ''), 10) || 75
        return acc + num
      }, 0) / completedDiscussions.length)}%`
    : '92%'

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* ─── Header ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 40 }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>
          <span className="text-gradient">Synapse Council</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600 }}>
          Multi-agent AI boardroom. 10 experts collaborate, debate, and reach consensus before answering.
        </p>
      </motion.div>

      {/* ─── Quick Stats ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 36,
        }}
      >
        {[
          { icon: Users, label: 'Active Agents', value: AGENTS.length.toString(), color: 'var(--accent-primary)' },
          { icon: MessageSquare, label: 'Discussions', value: totalDiscussions.toString(), color: 'var(--accent-cyan)' },
          { icon: Clock, label: 'Avg. Latency', value: avgLatency, color: 'var(--accent-emerald)' },
          { icon: Activity, label: 'Consensus Rate', value: avgConsensus, color: 'var(--accent-amber)' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <stat.icon size={18} style={{ color: stat.color }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</div>
          </div>
        ))}
      </motion.div>

      {/* ─── Start Discussion CTA ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="glass-card"
        style={{
          padding: '28px 32px',
          marginBottom: 36,
          background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3 style={{ marginBottom: 6 }}>Start a Boardroom Session</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 500 }}>
            Ask a question and watch 10 AI experts independently analyze, debate, critique, and reach consensus.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/chat')}
          style={{ padding: '12px 28px', fontSize: '0.9375rem' }}
        >
          <Zap size={18} />
          New Discussion
          <ArrowRight size={16} />
        </button>
      </motion.div>

      {/* ─── Agent Grid ───────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: 4 }}>Board Members</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
          All agents powered by NVIDIA NIM
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {AGENTS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} liveAgent={liveAgentMap.get(agent.id)} index={i} />
        ))}
      </div>
    </div>
  )
}

