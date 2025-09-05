import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PrivateRoute from './context/PrivateRoute'
import DashBoradPage from './pages/DashBoradPage'
import PostJobPage from './pages/PostJobPage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashBoradPage /></PrivateRoute>} />
          <Route path="/post-job" element={<PrivateRoute><PostJobPage /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetailsPage /></PrivateRoute>} />
          <Route path="/apply-jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App