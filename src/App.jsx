import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import TestList from './pages/TestList'
import Test from './pages/Test'
import TaskPage from './pages/TaskPage'
import Result from './pages/Result'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/Dashboard'
import AdminSites from './pages/admin/Sites'
import AdminTests from './pages/admin/Tests'
import AdminStats from './pages/admin/Stats'
import Layout from './components/Layout'
import Particles from './components/Particles'

function App() {
  return (
    <Router>
      <div className="min-h-screen animated-bg relative">
        <Particles />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#f8fafc',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px 24px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f8fafc',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f8fafc',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tests/:type" element={<TestList />} />
            <Route path="test/:type/:id" element={<Test />} />
            <Route path="task/:sessionId" element={<TaskPage />} />
            <Route path="result/:sessionId" element={<Result />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/sites" element={<AdminSites />} />
          <Route path="/admin/tests" element={<AdminTests />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
