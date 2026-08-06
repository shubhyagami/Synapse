import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  FileText,
  Download,
  Presentation,
  FileCode,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { fetchDiscussions, type DiscussionDto } from '../services/api'
import {
  generateMarkdownReport,
  exportToMarkdown,
  exportToPowerPoint,
  exportToWordDocument,
} from '../services/reportGenerator'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Reports() {
  const [discussions, setDiscussions] = useState<DiscussionDto[]>([])
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionDto | null>(null)
  const [reportMarkdown, setReportMarkdown] = useState<string>('')
  const [synthesizing, setSynthesizing] = useState<boolean>(false)

  useEffect(() => {
    fetchDiscussions()
      .then((data) => {
        setDiscussions(data)
        if (data.length > 0) {
          handleSelectDiscussion(data[0])
        } else {
          // Provide default mock discussion if backend has no discussions yet
          const mockDiscussion: DiscussionDto = {
            id: 'demo-report-1',
            projectId: 'default',
            userPrompt: 'Build a high-performance multi-agent AI courtroom platform with Spring Boot & React 19',
            status: 'COMPLETED',
            currentRound: 4,
            totalRounds: 4,
            rounds: [
              {
                round: 1,
                name: 'Independent Thinking',
                responses: {
                  'QA Engineer': 'We must enforce contract-based API testing with 90%+ unit test coverage and automated load pipelines.',
                  'Security Engineer': 'Strict zero-trust CORS configuration and masked API key rotation is critical.',
                  'Backend Engineer': 'Spring Boot 3.4 WebFlux reactive endpoints handle async WebSockets efficiently.',
                },
                timestamp: new Date().toISOString(),
                agentCount: 10,
              },
            ],
            consensusReport: {
              overallConfidence: '96%',
              successfulResponses: 40,
              totalResponses: 40,
            },
            createdAt: new Date().toISOString(),
          }
          handleSelectDiscussion(mockDiscussion)
        }
      })
      .catch(console.error)
  }, [])

  const handleSelectDiscussion = (discussion: DiscussionDto) => {
    setSelectedDiscussion(discussion)
    setSynthesizing(true)
    setTimeout(() => {
      const markdown = generateMarkdownReport(discussion)
      setReportMarkdown(markdown)
      setSynthesizing(false)
    }, 400)
  }

  const handleDownloadMd = () => {
    if (!selectedDiscussion) return
    exportToMarkdown(selectedDiscussion.userPrompt || 'Executive_Report', reportMarkdown)
  }

  const handleExportPptx = () => {
    if (!selectedDiscussion) return
    exportToPowerPoint(selectedDiscussion, reportMarkdown)
  }

  const handleExportDocx = () => {
    if (!selectedDiscussion) return
    exportToWordDocument(selectedDiscussion, reportMarkdown)
  }

  return (
    <div style={{ padding: '32px 40px', position: 'relative', zIndex: 1 }}>
      {/* Header & AI Agent Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>
              <span className="text-gradient">Executive AI Documentation</span>
            </h1>
            <span
              style={{
                fontSize: '0.6875rem',
                padding: '3px 10px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                borderRadius: 20,
                color: 'white',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Sparkles size={12} />
              Elena Rostova (CKO AI Agent)
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
            Automated executive reports, quality engineering blueprints, system diagrams, and multi-format exports.
          </p>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="glass-card"
            onClick={handleDownloadMd}
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              border: '1px solid var(--accent-primary)44',
            }}
          >
            <Download size={15} style={{ color: 'var(--accent-primary)' }} />
            Markdown (.md)
          </button>

          <button
            className="glass-card"
            onClick={handleExportPptx}
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              border: '1px solid var(--accent-cyan)44',
            }}
          >
            <Presentation size={15} style={{ color: 'var(--accent-cyan)' }} />
            PowerPoint (.pptx)
          </button>

          <button
            className="glass-card"
            onClick={handleExportDocx}
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              border: '1px solid var(--accent-emerald)44',
            }}
          >
            <FileCode size={15} style={{ color: 'var(--accent-emerald)' }} />
            Word (.docx)
          </button>
        </div>
      </motion.div>

      {/* Main Grid: Left Sidebar (History) + Right Document Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Left: Report Session History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card"
          style={{ padding: 18, height: 'fit-content' }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
            Boardroom Sessions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {discussions.map((disc) => {
              const isSelected = selectedDiscussion?.id === disc.id
              return (
                <button
                  key={disc.id}
                  onClick={() => handleSelectDiscussion(disc)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: isSelected ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid var(--accent-primary)55' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {disc.userPrompt}
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
                      {disc.consensusReport?.overallConfidence || '94%'} Consensus
                    </span>
                    <span>•</span>
                    <span>{new Date(disc.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Right: Glassmorphic Markdown Report Reader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card"
          style={{ padding: '36px 44px', minHeight: 650, position: 'relative' }}
        >
          {synthesizing ? (
            <div
              style={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                color: 'var(--text-secondary)',
              }}
            >
              <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
              <span>Elena Rostova is synthesizing executive report & diagrams...</span>
            </div>
          ) : (
            <div className="report-markdown-content" style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {reportMarkdown}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
