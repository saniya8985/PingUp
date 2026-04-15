import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";



const app = express();

await connectDB();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  if (typeof req.url === "string") {
    const sanitized = req.url.replace(/%0A|%0D|\r|\n/g, "");
    if (sanitized !== req.url) {
      req.url = sanitized;
    }
  }
  next();
});

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is running"));

// ✅ Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', messageRouter);

app.use((err, req, res, next) => {
  console.error('Server error:', err?.message || err);
  if (err?.message?.includes('Malformed part header') || err?.message?.includes('File upload error')) {
    return res.status(400).json({ success: false, message: 'Malformed multipart/form-data request. Use valid form-data or JSON.' });
  }
  if (err?.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: err?.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));