import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizonal, Trash2, Reply, X, Pencil, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import {
  addMessage,
  fetchMessages,
  resetMessages,
  removeMessage,
  updateMessage,
  setReplyTo,
  clearReplyTo,
  setEditingMsg,
  clearEditingMsg,
} from '../features/messages/messagesSlice'
import toast from 'react-hot-toast'

const ChatBox = () => {
  const { messages, replyTo, editingMsg } = useSelector((state) => state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const connections = useSelector((state) => state.connections.connections || [])

  // When edit mode is activated, pre-fill input with the message text
  useEffect(() => {
    if (editingMsg) {
      setText(editingMsg.text || '')
      inputRef.current?.focus()
    }
  }, [editingMsg])

  const fetchUserMessages = async () => {
    try {
      const token = await getToken()
      dispatch(fetchMessages({ token, userId }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Send new message OR save edit depending on mode
  const handleSend = async () => {
    if (editingMsg) {
      await saveEdit()
    } else {
      await sendMessage()
    }
  }

  const sendMessage = async () => {
    try {
      if (!text && !image) return
      const token = await getToken()
      const formData = new FormData()
      formData.append('to_user_id', userId)
      formData.append('text', text)
      if (image) formData.append('image', image)
      if (replyTo) formData.append('reply_to', replyTo._id)

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setText('')
        setImage(null)
        dispatch(clearReplyTo())
        dispatch(addMessage(data.message))
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Save edited message
  const saveEdit = async () => {
    try {
      if (!text.trim()) return toast.error('Message cannot be empty')
      const token = await getToken()
      const { data } = await api.put(`/api/message/${editingMsg._id}`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        dispatch(updateMessage({ messageId: editingMsg._id, text: text.trim() }))
        dispatch(clearEditingMsg())
        setText('')
        toast.success('Message updated')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelEdit = () => {
    dispatch(clearEditingMsg())
    setText('')
  }

  // Delete a message (only sender)
  const deleteMessage = async (messageId) => {
    try {
      const token = await getToken()
      const { data } = await api.delete(`/api/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        dispatch(removeMessage(messageId))
        toast.success('Message deleted')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUserMessages()
    return () => {
      dispatch(resetMessages())
    }
  }, [userId])

  useEffect(() => {
    if (Array.isArray(connections) && connections.length > 0) {
      const foundUser = connections.find((connection) => connection._id === userId)
      setUser(foundUser || null)
    }
  }, [connections, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    user && (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
          <img src={user.profile_picture} alt="" className="size-8 rounded-full" />
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 md:px-10 h-full overflow-y-scroll">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isSender = message.to_user_id === user._id
                const isBeingEdited = editingMsg?._id === message._id
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
                    onMouseEnter={() => setHoveredId(message._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="flex items-end gap-1.5">
                      {/* Action buttons on hover */}
                      {hoveredId === message._id && (
                        <div className={`flex items-center gap-1 ${isSender ? 'order-first' : 'order-last'}`}>
                          {/* Reply (anyone) */}
                          <button
                            onClick={() => dispatch(setReplyTo(message))}
                            className="p-1 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 transition cursor-pointer"
                            title="Reply"
                          >
                            <Reply size={14} />
                          </button>
                          {/* Edit (only sender, only text) */}
                          {isSender && message.message_type === 'text' && (
                            <button
                              onClick={() => dispatch(setEditingMsg(message))}
                              className="p-1 rounded-full bg-gray-100 hover:bg-yellow-100 text-gray-500 hover:text-yellow-600 transition cursor-pointer"
                              title="Edit message"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {/* Delete (only sender) */}
                          {isSender && (
                            <button
                              onClick={() => deleteMessage(message._id)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition cursor-pointer"
                              title="Delete message"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`p-2 text-sm max-w-sm rounded-lg shadow transition-all ${
                          isSender ? 'rounded-br-none' : 'rounded-bl-none'
                        } ${
                          isBeingEdited
                            ? 'bg-yellow-50 border border-yellow-300 text-slate-700'
                            : 'bg-white text-slate-700'
                        }`}
                      >
                        {/* Reply preview */}
                        {message.reply_to && (
                          <div className="mb-1 px-2 py-1 border-l-2 border-indigo-400 bg-indigo-50 rounded text-xs text-indigo-600 truncate max-w-xs">
                            <span className="font-semibold">Replying to: </span>
                            {message.reply_to.text
                              ? message.reply_to.text
                              : message.reply_to.message_type === 'image'
                              ? '📷 Image'
                              : 'Message'}
                          </div>
                        )}
                        {message.message_type === 'image' && (
                          <img
                            src={message.media_url}
                            className="w-full max-w-sm rounded-lg mb-1"
                            alt=""
                          />
                        )}
                        <p>{message.text}</p>
                        {/* Edited badge */}
                        {message.is_edited && (
                          <span className="text-[10px] text-gray-400 ml-1">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Edit Mode Banner */}
        {editingMsg && (
          <div className="mx-4 mb-1 max-w-xl mx-auto flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-xl text-sm text-yellow-700">
            <Pencil size={14} className="shrink-0 cursor-pointer"  />
            <span className="flex-1 truncate">
              <span className="font-semibold">Editing: </span>
              {editingMsg.text}
            </span>
            <button onClick={cancelEdit} className="shrink-0 hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Reply Preview Bar */}
        {replyTo && !editingMsg && (
          <div className="mx-4 mb-1 max-w-xl mx-auto flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-700">
            <Reply size={14} className="shrink-0 cursor-pointer" />
            <span className="flex-1 truncate">
              <span className="font-semibold">Replying to: </span>
              {replyTo.text
                ? replyTo.text
                : replyTo.message_type === 'image'
                ? '📷 Image'
                : 'Message'}
            </span>
            <button onClick={() => dispatch(clearReplyTo())} className="shrink-0 cursor-pointer hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="px-4">
          <div className={`flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border shadow rounded-full mb-5 transition-all cursor-pointer ${
            editingMsg ? 'border-yellow-400' : 'border-gray-200'
          }`}>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 outline-none text-slate-700"
              placeholder={editingMsg ? 'Edit your message...' : 'Type a message.....'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
                if (e.key === 'Escape' && editingMsg) cancelEdit()
              }}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />

            {/* Hide image button in edit mode */}
            {!editingMsg && (
              <label htmlFor="image">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="" className="h-8 rounded" />
                ) : (
                  <ImageIcon className="size-7 text-gray-400 cursor-pointer" />
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            )}

            <button
              onClick={handleSend}
              className={`active:scale-95 cursor-pointer text-white p-2 rounded-full transition-all ${
                editingMsg
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800'
              }`}
            >
              {editingMsg ? <Check size={18} /> : <SendHorizonal size={18} />}
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatBox