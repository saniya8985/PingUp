import fs from "fs";
import Message from "../models/Message.js";
import imagekit from "../configs/imagekit.js";

const connections = {};

// ✅ SSE Controller
export const sseController = (req, res) => {
  const { userId } = req.params;
  console.log("✅ SSE connected:", userId);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.flushHeaders(); // 🔥 MUST

  connections[userId] = res;

  // send initial event
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  req.on("close", () => {
    delete connections[userId];
    console.log("❌ SSE disconnected:", userId);
  });
};

// Delete Message
export const deleteMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.json({ success: false, message: "Message not found" });
    }

    // Only the sender can delete their own message
    if (message.from_user_id.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Message.findByIdAndDelete(messageId);

    // Notify the recipient via SSE
    const recipientId = message.to_user_id.toString();
    if (connections[recipientId]) {
      connections[recipientId].write(
        `data: ${JSON.stringify({ type: "delete", messageId })}\\n\\n`
      );
    }

    res.json({ success: true, messageId });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Edit Message (only sender, only text messages)
export const editMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.json({ success: false, message: "Text cannot be empty" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.json({ success: false, message: "Message not found" });
    }

    // Only the sender can edit their own message
    if (message.from_user_id.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Only text messages can be edited
    if (message.message_type !== "text") {
      return res.json({ success: false, message: "Only text messages can be edited" });
    }

    message.text = text.trim();
    message.is_edited = true;
    await message.save();

    // Notify the recipient via SSE
    const recipientId = message.to_user_id.toString();
    if (connections[recipientId]) {
      connections[recipientId].write(
        `data: ${JSON.stringify({ type: "edit", messageId, text: message.text })}\\n\\n`
      );
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { to_user_id, text, reply_to } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image") {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });
      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
      reply_to: reply_to || null,
    });

    res.json({ success: true, message });

    const messageWithUserData = await Message.findById(message._id)
      .populate("from_user_id reply_to");

    // ✅ SSE SEND
    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`
      );
    }

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Chat Messages
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).populate("reply_to").sort({ createdAt: 1 });

    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: userId },
      { seen: true },
    );

    res.json({ success: true, messages });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ FIXED FUNCTION
export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const messages = await Message.find({to_user_id: userId}).
    populate("from_user_id to_user_id").sort({ created_at: -1 });

    res.json({ success: true, messages });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};