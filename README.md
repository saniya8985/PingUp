# PingUp 🚀

A full-stack social media web application built with React, Node.js, MongoDB, and Clerk authentication. PingUp lets users connect, share posts, exchange messages in real time, and post 24-hour stories.

---

## 📸 Features

- 🔐 **Authentication** — Sign up / Sign in via Clerk (Google, Email)
- 📰 **Feed** — View posts from connections and followed users
- 📝 **Create Post** — Text, image, or mixed posts with hashtag support
- ❤️ **Like & Comment** — Like posts and comment in real time
- 🔗 **Share Posts** — Share to WhatsApp, Twitter/X, Facebook, LinkedIn, Telegram, Instagram
- 💬 **Real-time Messaging** — Chat with connections via SSE (Server-Sent Events)
- 🔔 **Pop-up Notifications** — Toast notifications for new messages
- 📖 **Stories** — 24-hour auto-expiring stories with image/video/text support
- 🗑️ **Delete Stories** — Manually delete your own stories anytime
- 🔍 **Discover** — Find and connect with new users
- 👥 **Connections** — Manage your connections and followers
- 👤 **Profile** — View and edit your profile

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI Framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| Redux Toolkit | State management |
| React Router v7 | Client-side routing |
| Clerk React | Authentication |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Moment.js | Date formatting |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | Server |
| MongoDB + Mongoose | Database |
| Clerk Express | Auth middleware |
| ImageKit | Image/video storage |
| Multer | File uploads |
| SSE | Real-time messaging |
| Nodemailer | Email |
| Inngest | Background jobs |

---

## 📁 Project Structure

```
PingUp/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PostCard.jsx        # Post with like, comment, share
│   │   │   ├── StoriesBar.jsx      # Stories strip with delete
│   │   │   ├── StoryViewer.jsx     # Full-screen story viewer
│   │   │   ├── StoryModal.jsx      # Create story modal
│   │   │   ├── Notification.jsx    # Toast notification UI
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── RecentMessages.jsx  # Message preview list
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Feed.jsx            # Main feed
│   │   │   ├── ChatBox.jsx         # 1-on-1 chat
│   │   │   ├── Messages.jsx        # Messages list
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── Discover.jsx        # Find new users
│   │   │   ├── Connections.jsx     # Manage connections
│   │   │   ├── CreatePost.jsx      # Create a post
│   │   │   └── Login.jsx           # Auth page
│   │   ├── features/               # Redux slices
│   │   │   ├── user/
│   │   │   ├── messages/
│   │   │   └── connections/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance
│   │   └── App.jsx                 # Root with SSE + routes
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Express backend
    ├── configs/
    │   ├── db.js                   # MongoDB connection
    │   ├── imagekit.js             # ImageKit config
    │   └── multer.js               # File upload config
    ├── controllers/
    │   ├── postController.js       # Post CRUD + likes + comments
    │   ├── storyController.js      # Story CRUD + auto-expiry
    │   ├── messageController.js    # Chat + SSE
    │   └── userController.js       # User profile + connections
    ├── models/
    │   ├── Post.js                 # Post schema (with comments)
    │   ├── Story.js                # Story schema (TTL 24hr)
    │   ├── Message.js              # Message schema
    │   └── User.js                 # User schema
    ├── routes/
    │   ├── postRoutes.js
    │   ├── storyRoutes.js
    │   ├── messageRoutes.js
    │   └── userRoutes.js
    ├── middlewares/
    │   └── auth.js                 # Clerk protect middleware
    ├── inngest/                    # Background job functions
    ├── server.js                   # Entry point
    └── package.json
```

---

## ⚙️ Environment Variables

### Client — `client/.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000
```

### Server — `server/.env`
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Inngest (optional - for background jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Clerk account → [clerk.com](https://clerk.com)
- ImageKit account → [imagekit.io](https://imagekit.io)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/pingup.git
cd pingup
```

**2. Install server dependencies**
```bash
cd server
npm install
```

**3. Install client dependencies**
```bash
cd ../client
npm install
```

**4. Set up environment variables**

Create `.env` files in both `client/` and `server/` directories using the variables listed above.

**5. Run the development servers**

In one terminal (server):
```bash
cd server
npm run server
```

In another terminal (client):
```bash
cd client
npm run dev
```

**6. Open in browser**
```
http://localhost:5173
```

---

## 📡 API Endpoints

### Auth
All protected routes require `Authorization: Bearer <clerk_token>` header.

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/post/add` | Create a new post |
| GET | `/api/post/feed` | Get feed posts |
| POST | `/api/post/like` | Like / unlike a post |
| POST | `/api/post/comment/add` | Add a comment |
| POST | `/api/post/comment/delete` | Delete a comment |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/story/create` | Create a story |
| GET | `/api/story/get` | Get active stories |
| DELETE | `/api/story/delete` | Delete your story |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/message/:userId` | SSE stream for real-time messages |
| POST | `/api/message/send` | Send a message |
| POST | `/api/message/get` | Get chat history |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/update` | Update profile |
| POST | `/api/user/connect` | Send connection request |
| GET | `/api/user/discover` | Discover new users |

---

## 🗄️ Database Models

### Story (Auto-expires in 24 hours)
```js
{
  user: String (ref: User),
  content: String,
  media_url: String,
  media_type: 'text' | 'image' | 'video',
  background_color: String,
  expiresAt: Date  // MongoDB TTL index — auto-deleted after 24hrs
}
```

### Post (with Comments)
```js
{
  user: String (ref: User),
  content: String,
  image_urls: [String],
  post_type: 'text' | 'image' | 'text_with_image',
  likes_count: [String],
  comments: [{ user, text, createdAt }]
}
```

### Message
```js
{
  from_user_id: String (ref: User),
  to_user_id: String (ref: User),
  text: String,
  message_type: 'text' | 'image',
  media_url: String,
  seen: Boolean
}
```

---

## 🚢 Deployment

Both client and server include `vercel.json` for Vercel deployment.

**Deploy server:**
```bash
cd server
vercel --prod
```

**Deploy client:**
```bash
cd client
npm run build
vercel --prod
```

> After deploying, update `VITE_API_URL` in client env to your server's production URL.

---

## 📄 License

MIT License — feel free to use and modify.

---

<p align="center">Built with ❤️ using React + Node.js</p>
