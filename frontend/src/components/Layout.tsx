import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NeuralNetworkCanvas } from './NeuralNetworkCanvas'

export function Layout() {
  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <NeuralNetworkCanvas />
      <Sidebar />
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
