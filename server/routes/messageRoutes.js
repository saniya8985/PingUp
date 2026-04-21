import express from 'express';
import { getChatMessages, sendMessage, sseController, deleteMessage, editMessage } from '../controllers/messageController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', sseController);

messageRouter.post('/send', upload.single('image'), protect, sendMessage);
messageRouter.post('/get', protect, getChatMessages);
messageRouter.delete('/:messageId', protect, deleteMessage);
messageRouter.put('/:messageId', protect, editMessage);

export default messageRouter;