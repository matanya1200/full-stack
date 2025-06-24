import {Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainAppPage from './pages/MainAppPage'
import UserInfoPage from './pages/UserInfoPage'
import TodosPage from './pages/TodosPage'
import PostsPage from './pages/PostsPage'
import AlbumsPage from './pages/AlbumsPage'
import UserSettingsPage from './pages/UserSettingsPage'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="text-center mt-5">טוען...</div> // או Spinner אם אתה רוצה
  }

  return (
    <Routes>
      <Route path="/" element={user ? <MainAppPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage onLogin={setUser} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/info" element={user ? <UserInfoPage /> : <Navigate to="/login" />} />
      <Route path="/todos" element={user ? <TodosPage /> : <Navigate to="/login" />} />
      <Route path="/posts" element={user ? <PostsPage /> : <Navigate to="/login" />} />
      <Route path="/albums" element={user ? <AlbumsPage /> : <Navigate to="/login" />} />
      <Route path="/users" element={user ? <UserSettingsPage /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
