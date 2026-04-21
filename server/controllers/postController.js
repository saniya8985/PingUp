import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { content, post_type } = req.body;
    const images = req.files || [];

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });
          return imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
        })
      );
    }

    await Post.create({ user: userId, content, image_urls, post_type });
    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);

    const userIds = [
      userId,
      ...(user.connections || []),
      ...(user.following || []),
    ];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .populate("comments.user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Like Post
export const likePost = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (post.likes_count.includes(userId)) {
      post.likes_count = post.likes_count.filter((id) => id !== userId);
      await post.save();
      res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes_count.push(userId);
      await post.save();
      res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { postId, text } = req.body;

    if (!text?.trim()) {
      return res.json({ success: false, message: "Comment khali nahi ho sakta" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.json({ success: false, message: "Post nahi mila" });

    post.comments.push({ user: userId, text: text.trim() });
    await post.save();

    // populated comment return karo
    const updatedPost = await Post.findById(postId).populate("comments.user");
    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.json({ success: true, comment: newComment, message: "Comment add ho gaya" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { postId, commentId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.json({ success: false, message: "Post nahi mila" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.json({ success: false, message: "Comment nahi mila" });

    // sirf comment wala ya post owner delete kar sakta hai
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.json({ success: false, message: "Permission nahi hai" });
    }

    post.comments.pull({ _id: commentId });
    await post.save();

    res.json({ success: true, message: "Comment delete ho gaya" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};