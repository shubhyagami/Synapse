import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Zap,
  FolderKanban,
  FileText,
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chat', icon: MessageSquare, label: 'Boardroom' },
  { path: '/reports', icon: FileText, label: 'Reports & Docs' },
  { path: '/agents', icon: Users, label: 'Agents' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ─── Logo ─────────────────────────────────── */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)',
            }}
          >
            <Zap size={20} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
              className="text-gradient"
            >
              Synapse Council
            </h1>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              AI Boardroom
            </span>
          </div>
        </motion.div>
      </div>

      {/* ─── Project Selector ─────────────────────── */}
      <div style={{ padding: '16px 16px 8px' }}>
        <button
          className="btn-ghost"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            padding: '10px 12px',
            fontSize: '0.8125rem',
            borderRadius: 8,
          }}
        >
          <FolderKanban size={16} />
          <span>Default Project</span>
        </button>
      </div>

      {/* ─── Navigation ──────────────────────────── */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
          >
            <NavLink
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(129, 140, 248, 0.1))'
                  : 'transparent',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                position: 'relative',
              })}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 20,
                        borderRadius: 2,
                        background: 'var(--accent-primary)',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* ─── Footer ──────────────────────────────── */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--accent-emerald)',
            boxShadow: '0 0 8px var(--accent-emerald)',
          }}
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          10 Agents Ready
        </span>
      </div>
    </aside>
  )
}
