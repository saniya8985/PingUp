import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'

import { useUser, useAuth } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import { Toaster } from 'react-hot-toast'
import Loading from './components/Loading'
import { useEffect } from 'react'

const App = () => {
  const { isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()

  useEffect(() => {
    if(isLoaded && isSignedIn) {
      getToken().then((token)=>console.log(token))
    }
  }, [isLoaded, isSignedIn, getToken])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/login/*' element={<Login />} />

        <Route
          path='/'
          element={
            isSignedIn ? <Layout /> : <Navigate to='/login' replace />
          }
        >
          <Route index element={<Feed />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Connections />} />
          <Route path='discover' element={<Discover />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
        </Route>

        <Route
          path='*'
          element={
            isSignedIn ? (
              <Navigate to='/' replace />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
      </Routes>
    </>
  )
}

export default App

