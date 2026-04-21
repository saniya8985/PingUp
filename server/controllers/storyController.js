import fs from 'fs';
import Story from '../models/Story.js';
import imagekit from '../configs/imagekit.js';
import User from '../models/User.js';

// Add Story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { content, media_type, background_color } = req.body;
        const media = req.file;
        let media_url = '';

        if (media_type === 'image' || media_type === 'video') {
            const fileBuffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
            });
            media_url = response.url;
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color,
            // expiresAt auto set ho jaata hai model mein (24 hrs)
        });

        res.json({ success: true, story });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Stories
export const getStories = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const user = await User.findById(userId);

        const userIds = [userId, ...user.following, ...user.connections];

        // sirf non-expired stories fetch karo
        const stories = await Story.find({
            user: { $in: userIds },
            expiresAt: { $gt: new Date() }
        }).populate('user').sort({ createdAt: -1 });

        res.json({ success: true, stories });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Story
export const deleteStory = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { storyId } = req.body;

        const story = await Story.findById(storyId);
        if (!story) return res.json({ success: false, message: "Story nahi mili" });

        // sirf story owner delete kar sakta hai
        if (story.user.toString() !== userId) {
            return res.json({ success: false, message: "Aap sirf apni story delete kar sakte hain" });
        }

        await Story.findByIdAndDelete(storyId);
        res.json({ success: true, message: "Story delete ho gayi" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};