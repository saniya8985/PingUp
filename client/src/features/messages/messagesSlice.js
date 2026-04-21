import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
    messages: [],
    replyTo: null,   // message being replied to
    editingMsg: null, // message being edited { _id, text }
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async({token, userId})=>{
    const { data } = await api.post('/api/message/get', {to_user_id: userId},{
        headers: {Authorization: `Bearer ${token}`}
    })
    return data.success ? data : null
})

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action)=>{
            state.messages = action.payload;
        },
        addMessage: (state, action)=>{
            state.messages = [...state.messages, action.payload]
        },
        removeMessage: (state, action)=>{
            state.messages = state.messages.filter(m => m._id !== action.payload)
        },
        updateMessage: (state, action)=>{
            // action.payload = { messageId, text }
            const { messageId, text } = action.payload
            const msg = state.messages.find(m => m._id === messageId)
            if (msg) {
                msg.text = text
                msg.is_edited = true
            }
        },
        resetMessages: (state)=>{
            state.messages = [];
            state.replyTo = null;
            state.editingMsg = null;
        },
        setReplyTo: (state, action)=>{
            state.replyTo = action.payload;
            state.editingMsg = null; // cancel edit if replying
        },
        clearReplyTo: (state)=>{
            state.replyTo = null;
        },
        setEditingMsg: (state, action)=>{
            state.editingMsg = action.payload; // full message object or null
            state.replyTo = null; // cancel reply if editing
        },
        clearEditingMsg: (state)=>{
            state.editingMsg = null;
        },
    },
    extraReducers: (builder)=>
    {
        builder.addCase(fetchMessages.fulfilled, (state, action)=>{
            if(action.payload){
                state.messages = action.payload.messages
            }
        })
    }
})

export const {
    setMessages, addMessage, removeMessage, updateMessage,
    resetMessages, setReplyTo, clearReplyTo, setEditingMsg, clearEditingMsg
} = messagesSlice.actions;

export default messagesSlice.reducer;