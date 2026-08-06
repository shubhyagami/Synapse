import { motion } from 'motion/react'
import { Key, Globe, Database, Cpu, Shield } from 'lucide-react'

export function Settings() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 800 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>
          <span className="text-gradient">Settings</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Configure NVIDIA NIM API keys, agent models, retry policies, and discussion workflows.
        </p>
      </motion.div>

      {/* Settings Sections */}
      {[
        {
          icon: Key,
          title: 'NVIDIA NIM API Keys',
          description: 'Configure per-agent API keys for NVIDIA NIM inference.',
          color: 'var(--accent-primary)',
          fields: [
            'CEO_API_KEY',
            'PRODUCT_API_KEY',
            'BACKEND_API_KEY',
            'FRONTEND_API_KEY',
            'CLOUD_API_KEY',
            'SECURITY_API_KEY',
            'QA_API_KEY',
            'MARKETING_API_KEY',
            'CUSTOMER_API_KEY',
            'DESIGN_API_KEY',
          ],
        },
        {
          icon: Globe,
          title: 'NVIDIA NIM Endpoint',
          description: 'Base URL for NVIDIA NIM API.',
          color: 'var(--accent-cyan)',
          fields: ['https://integrate.api.nvidia.com/v1'],
        },
        {
          icon: Cpu,
          title: 'Discussion Configuration',
          description: 'Number of rounds, debate rules, and consensus thresholds.',
          color: 'var(--accent-emerald)',
          fields: ['Rounds: 4', 'Min Consensus: 70%', 'Max Retries: 5'],
        },
        {
          icon: Database,
          title: 'Data & Memory',
          description: 'PostgreSQL, Redis, and Qdrant connection settings.',
          color: 'var(--accent-amber)',
          fields: ['PostgreSQL', 'Redis', 'Qdrant'],
        },
        {
          icon: Shield,
          title: 'Security',
          description: 'JWT configuration and OAuth providers.',
          color: 'var(--accent-rose)',
          fields: ['JWT Secret', 'Token Expiry', 'GitHub OAuth'],
        },
      ].map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          className="glass-card"
          style={{ padding: '24px 28px', marginBottom: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${section.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <section.icon size={20} style={{ color: section.color }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{section.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {section.description}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {section.fields.map((field) => (
              <div
                key={field}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-secondary)',
                    flex: 1,
                  }}
                >
                  {field}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Configure in .env
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
