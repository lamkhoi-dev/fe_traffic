import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import TestList from './pages/TestList'
import Test from './pages/Test'
import TaskPage from './pages/TaskPage'
import Result from './pages/Result'
import GradeSelection from './pages/GradeSelection'
import SubjectSelection from './pages/SubjectSelection'
import GradeTestList from './pages/GradeTestList'
import GradeTest from './pages/GradeTest'
import AssessmentList from './pages/AssessmentList'
import AssessmentTest from './pages/AssessmentTest'
import TestCategories from './pages/TestCategories'
import MBTITest from './pages/MBTITest'
import MBTIResult from './pages/MBTIResult'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/Dashboard'
import AdminSites from './pages/admin/Sites'
import AdminTests from './pages/admin/Tests'
import AdminQuestions from './pages/admin/Questions'
import AdminTasks from './pages/admin/Tasks'
import AdminStats from './pages/admin/Stats'
import AdminSettings from './pages/admin/Settings'
import AdminPosts from './pages/admin/Posts'
import TestWidgetPage from './pages/TestWidgetPage'
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
            {/* Grade-based routes */}
            <Route path="grades" element={<GradeSelection />} />
            <Route path="grade/:gradeNum" element={<SubjectSelection />} />
            <Route path="grade/:gradeNum/subject/:subjectId" element={<GradeTestList />} />
            <Route path="grade/:gradeNum/subject/:subjectId/test/:testId" element={<GradeTest />} />
            {/* Assessment routes */}
            <Route path="assessment" element={<AssessmentList />} />
            <Route path="assessment/:assessmentId" element={<AssessmentTest />} />
            {/* Category routes */}
            <Route path="categories" element={<TestCategories />} />
            <Route path="categories/:type" element={<TestCategories />} />
            {/* MBTI route */}
            <Route path="mbti" element={<MBTITest />} />
            <Route path="mbti/result/:sessionId" element={<MBTIResult />} />
            {/* Legal pages */}
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            {/* Blog */}
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:slug" element={<BlogPost />} />
          </Route>
          <Route path="/test-widget" element={<TestWidgetPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/sites" element={<AdminSites />} />
          <Route path="/admin/tests" element={<AdminTests />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
