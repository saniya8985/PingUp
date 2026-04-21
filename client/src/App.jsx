import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

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
import toast, { Toaster } from 'react-hot-toast'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'
import { addMessage } from './features/messages/messagesSlice'
import Notification from './components/Notification'

const App = () => {
  const { isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  const user = useSelector((state) => state.user.value)

  const dispatch = useDispatch();

  // Fetch user + connections
  useEffect(() => {
    const fetchData = async () => {
      if(isLoaded && isSignedIn) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token))
      }
    }
    fetchData();
  }, [isLoaded, isSignedIn])

  // Track current path
  useEffect(()=>{
    pathnameRef.current = pathname
  }, [pathname])

  // SSE - user._id use karo (stable string), user object nahi (infinite loop)
  useEffect(()=>{
    if(!user?._id) return;

    const eventSource = new EventSource(
      `http://localhost:4000/api/message/${user._id}`
    );

    eventSource.onopen = () => {
      console.log("SSE CONNECTED for:", user._id);
    };

    eventSource.onerror = (err)=>{
      console.error("SSE ERROR:", err);
    };

    eventSource.onmessage = (event)=>{
      const message = JSON.parse(event.data);

      // ignore initial connect message - server sends { type: "connected" }
      if(message.type === "connected") return;

      console.log("NEW MESSAGE:", message);

      const currentChatUserId = pathnameRef.current.split('/messages/')[1];
      const senderId = message.from_user_id?._id || message.from_user_id;

      if(currentChatUserId && currentChatUserId === senderId){
        dispatch(addMessage(message));
      } else {
        toast.custom((t)=>(
          <Notification t={t} message={message}/>
        ), { duration: 5000 });
      }
    }

    return ()=> {
      eventSource.close()
      console.log("SSE closed")
    }
  }, [user?._id])

  return (
    <>
      <Toaster 
        position="bottom-right"
        containerStyle={{ zIndex: 99999, bottom: 24, right: 24 }}
        toastOptions={{ duration: 5000 }}
      />

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