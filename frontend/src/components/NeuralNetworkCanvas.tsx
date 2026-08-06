import { useEffect, useRef } from 'react'
import { AGENTS } from '../config/agents'

interface Node {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  pulsePhase: number
}

interface Pulse {
  fromIdx: number
  toIdx: number
  progress: number
  speed: number
  color: string
}

interface NeuralNetworkCanvasProps {
  activeAgentId?: string | null
}

export function NeuralNetworkCanvas({ activeAgentId }: NeuralNetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initNodes()
    }

    window.addEventListener('resize', handleResize)

    // Mouse interaction
    let mouse = { x: -1000, y: -1000 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Initialize 10 Agent Nodes scattered gracefully
    let nodes: Node[] = []
    const initNodes = () => {
      nodes = AGENTS.map((agent, i) => {
        const angle = (i / AGENTS.length) * Math.PI * 2
        const radius = Math.min(width, height) * 0.35
        const cx = width / 2
        const cy = height / 2

        return {
          id: agent.id,
          name: agent.name,
          role: agent.role,
          avatar: agent.avatar,
          color: agent.color,
          x: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
          y: cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseRadius: 18,
          pulsePhase: Math.random() * Math.PI * 2,
        }
      })
    }
    initNodes()

    // Energy Pulses along edges
    const pulses: Pulse[] = []
    const spawnPulse = () => {
      if (nodes.length < 2) return
      const fromIdx = Math.floor(Math.random() * nodes.length)
      let toIdx = Math.floor(Math.random() * nodes.length)
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * nodes.length)
      }
      const activeNode = nodes.find((n) => n.id === activeAgentId)
      const color = activeNode ? activeNode.color : nodes[fromIdx].color

      pulses.push({
        fromIdx,
        toIdx,
        progress: 0,
        speed: activeAgentId ? 0.015 : 0.006,
        color,
      })
    }

    const pulseInterval = setInterval(spawnPulse, activeAgentId ? 300 : 800)

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Background subtle gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.2
      )
      bgGrad.addColorStop(0, 'rgba(10, 14, 28, 0.4)')
      bgGrad.addColorStop(1, 'rgba(5, 7, 15, 0.85)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Update & bounce nodes gently
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulsePhase += 0.03

        if (node.x < 80 || node.x > width - 80) node.vx *= -1
        if (node.y < 80 || node.y > height - 80) node.vy *= -1

        // Mouse repulsion
        const dx = mouse.x - node.x
        const dy = mouse.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          node.x -= (dx / dist) * force * 2
          node.y -= (dy / dist) * force * 2
        }
      })

      // Draw Synapses (Edges)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i]
          const n2 = nodes[j]
          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 320) {
            const isThinkingEdge = n1.id === activeAgentId || n2.id === activeAgentId
            const alpha = (1 - dist / 320) * (isThinkingEdge ? 0.6 : 0.15)

            ctx.beginPath()
            ctx.moveTo(n1.x, n1.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.strokeStyle = isThinkingEdge
              ? n1.id === activeAgentId
                ? n1.color
                : n2.color
              : 'rgba(108, 92, 231, ' + alpha + ')'
            ctx.lineWidth = isThinkingEdge ? 2 : 1
            ctx.stroke()
          }
        }
      }

      // Draw Pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p]
        pulse.progress += pulse.speed
        if (pulse.progress >= 1) {
          pulses.splice(p, 1)
          continue
        }

        const n1 = nodes[pulse.fromIdx]
        const n2 = nodes[pulse.toIdx]
        if (!n1 || !n2) continue

        const px = n1.x + (n2.x - n1.x) * pulse.progress
        const py = n1.y + (n2.y - n1.y) * pulse.progress

        ctx.beginPath()
        ctx.arc(px, py, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = pulse.color
        ctx.shadowBlur = 10
        ctx.shadowColor = pulse.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Draw Nodes
      nodes.forEach((node) => {
        const isActive = node.id === activeAgentId
        const pulseRadius =
          node.baseRadius + Math.sin(node.pulsePhase) * (isActive ? 6 : 2)

        // Outer glow
        if (isActive) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseRadius + 14, 0, Math.PI * 2)
          ctx.fillStyle = node.color.replace('rgb', 'rgba').replace(')', ', 0.25)')
          ctx.fill()

          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseRadius + 24, 0, Math.PI * 2)
          ctx.strokeStyle = node.color
          ctx.lineWidth = 1.5
          ctx.setLineDash([4, 4])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Core Circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#0f1423'
        ctx.strokeStyle = isActive ? node.color : 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = isActive ? 3 : 1.5
        ctx.fill()
        ctx.stroke()

        // Avatar / Icon
        ctx.font = '14px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.avatar, node.x, node.y)

        // Label
        ctx.font = isActive ? '600 11px Inter, sans-serif' : '500 10px Inter, sans-serif'
        ctx.fillStyle = isActive ? node.color : 'rgba(255, 255, 255, 0.6)'
        ctx.fillText(node.name.split(' ')[0], node.x, node.y + pulseRadius + 14)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(pulseInterval)
    }
  }, [activeAgentId])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  )
}
