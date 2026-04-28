# PingUp 🚀

**PingUp** is a full-stack social media platform where users can connect, share posts, chat in real time, and post 24-hour stories — powered by React, Node.js, MongoDB, Clerk, and Brevo email.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 Authentication | Sign up / Sign in with Clerk (Google, Email) |
| 📰 Feed | Posts from connections and followed users |
| 📝 Create Post | Text, image, or mixed posts with hashtag support |
| ❤️ Like & Unlike | Like/unlike posts with real-time toast notifications |
| 💬 Comments | Add and delete comments on posts |
| 🔗 Share | Share posts to WhatsApp, Twitter/X, Facebook, LinkedIn, Telegram, Instagram |
| 📡 Real-time Chat | 1-on-1 messaging using SSE (Server-Sent Events) |
| 🔔 Notifications | Pop-up toast notifications for new messages |
| 📖 Stories | 24-hour auto-expiring image/video/text stories |
| 🗑️ Delete Stories | Manually delete your own story anytime |
| 👥 Connections | Send, accept connection requests with email notifications |
| 👤 Profile | View and edit profile, cover photo, bio |
| 🔍 Discover | Find and follow new users |
| 📧 Email (Brevo) | Connection request emails + unseen message reminders |

---

## 🛠️ Tech Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI Framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Styling |
| Redux Toolkit | 2 | Global state management |
| React Router | 7 | Client-side routing |
| Clerk React | 5 | Authentication |
| Axios | 1 | HTTP client |
| React Hot Toast | 2 | Toast notifications |
| Lucide React | 0.5 | Icons |
| Moment.js | 2 | Date formatting |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| Express | 5 | Web server |
| MongoDB + Mongoose | 9 | Database |
| Clerk Express | 2 | Auth middleware |
| ImageKit | 6 | Image/video CDN storage |
| Multer | 2 | File upload handling |
| Nodemailer | 8 | Email sending |
| Brevo SMTP | — | Email delivery service |
| Inngest | 4 | Background jobs and cron tasks |
| dotenv | 17 | Environment variables |
| cors | 2 | Cross-origin resource sharing |

---

## 📁 Project Structure

```
PingUp/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance with base URL
│   │   ├── components/
│   │   │   ├── Loading.jsx          # Loading spinner
│   │   │   ├── MenuItems.jsx        # Sidebar nav items
│   │   │   ├── Notification.jsx     # Custom toast notification UI
│   │   │   ├── PostCard.jsx         # Post with like, comment, share
│   │   │   ├── ProfileModal.jsx     # Edit profile modal
│   │   │   ├── RecentMessages.jsx   # Message preview list
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── StoriesBar.jsx       # Horizontal stories strip
│   │   │   ├── StoryModal.jsx       # Create new story modal
│   │   │   ├── StoryViewer.jsx      # Full-screen story viewer
│   │   │   ├── UserCard.jsx         # User info card
│   │   │   └── UserProfileInfo.jsx  # Profile details section
│   │   ├── features/                # Redux slices
│   │   │   ├── user/userSlice.js
│   │   │   ├── messages/messagesSlice.js
│   │   │   └── connections/connectionsSlice.js
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Auth page (Clerk)
│   │   │   ├── Layout.jsx           # Root layout with sidebar
│   │   │   ├── Feed.jsx             # Main post feed
│   │   │   ├── CreatePost.jsx       # Create a new post
│   │   │   ├── ChatBox.jsx          # 1-on-1 chat window
│   │   │   ├── Messages.jsx         # All conversations list
│   │   │   ├── Profile.jsx          # User profile page
│   │   │   ├── Connections.jsx      # Manage connections
│   │   │   └── Discover.jsx         # Discover new users
│   │   └── App.jsx                  # Root — SSE listener + routes
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
└── server/                          # Node.js + Express Backend
    ├── configs/
    │   ├── db.js                    # MongoDB connection
    │   ├── imagekit.js              # ImageKit SDK setup
    │   ├── multer.js                # File upload config
    │   └── nodeMailer.js            # Brevo SMTP transporter
    ├── controllers/
    │   ├── postController.js        # Post CRUD, likes, comments
    │   ├── storyController.js       # Story CRUD + expiry filter
    │   ├── messageController.js     # Chat + SSE stream
    │   └── userController.js        # User profile, follow, connect
    ├── inngest/
    │   └── index.js                 # Background jobs (Inngest)
    ├── middlewares/
    │   └── auth.js                  # Clerk protect middleware
    ├── models/
    │   ├── User.js
    │   ├── Post.js                  # Includes comments sub-schema
    │   ├── Story.js                 # TTL index — auto-deletes at 24hr
    │   ├── Message.js
    │   └── Connection.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── postRoutes.js
    │   ├── storyRoutes.js
    │   └── messageRoutes.js
    ├── server.js
    ├── vercel.json
    └── package.json
```

---

## ⚙️ Environment Variables

### `client/.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
VITE_API_URL=http://localhost:4000
```

### `server/.env`
```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pingup

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Brevo SMTP (Email)
SMTP_USER=your_brevo_login_email@example.com
SMTP_PASS=your_brevo_smtp_master_password
SENDER_EMAIL=noreply@yourdomain.com

# App
FRONTEND_URL=http://localhost:5173

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas → [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Clerk → [clerk.com](https://clerk.com)
- ImageKit → [imagekit.io](https://imagekit.io)
- Brevo → [brevo.com](https://brevo.com)
- Inngest → [inngest.com](https://inngest.com)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pingup.git
cd pingup
```

### 2. Setup the Server
```bash
cd server
npm install
# create server/.env with all variables above
npm run server
# runs on http://localhost:4000
```

### 3. Setup the Client
```bash
cd ../client
npm install
# create client/.env with all variables above
npm run dev
# runs on http://localhost:5173
```

---

## 📡 API Reference

All protected routes require:
```
Authorization: Bearer <clerk_token>
```

### 👤 Users — `/api/user`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/data` | Get current logged-in user |
| POST | `/update` | Update profile / cover photo |
| POST | `/discover` | Discover new users |
| POST | `/follow` | Follow a user |
| POST | `/unfollow` | Unfollow a user |
| POST | `/connect` | Send connection request |
| POST | `/accept` | Accept connection request |
| GET | `/connections` | Get all connections |
| POST | `/profiles` | Get multiple user profiles |
| GET | `/recent-messages` | Get recent chat previews |

### 📝 Posts — `/api/post`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Create a post (supports images) |
| GET | `/feed` | Get feed posts |
| POST | `/like` | Like / unlike a post |
| POST | `/comment/add` | Add a comment |
| POST | `/comment/delete` | Delete a comment |

### 📖 Stories — `/api/story`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a story |
| GET | `/get` | Get all active stories |
| DELETE | `/delete` | Delete your own story |

### 💬 Messages — `/api/message`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:userId` | SSE stream for real-time messages |
| POST | `/send` | Send a message |
| POST | `/get` | Get chat history |

---

## 🗄️ Database Schemas

### User
```js
{
  _id: String,           // Clerk user ID
  email: String,
  full_name: String,
  username: String,
  bio: String,
  profile_picture: String,
  cover_photo: String,
  location: String,
  followers: [String],
  following: [String],
  connections: [String]
}
```

### Post (with embedded Comments)
```js
{
  user: String,          // ref: User
  content: String,
  image_urls: [String],
  post_type: 'text' | 'image' | 'text_with_image',
  likes_count: [String],
  comments: [{
    user: String,        // ref: User
    text: String,
    createdAt: Date
  }]
}
```

### Story (Auto-deletes after 24 hours)
```js
{
  user: String,          // ref: User
  content: String,
  media_url: String,
  media_type: 'text' | 'image' | 'video',
  background_color: String,
  expiresAt: Date        // MongoDB TTL index
}
```

### Message
```js
{
  from_user_id: String,  // ref: User
  to_user_id: String,    // ref: User
  text: String,
  message_type: 'text' | 'image',
  media_url: String,
  seen: Boolean
}
```

### Connection
```js
{
  from_user_id: String,  // ref: User
  to_user_id: String,    // ref: User
  status: 'pending' | 'accepted'
}
```

---

## 📧 Email Setup (Brevo)

PingUp sends transactional emails via **Brevo** SMTP.

**Emails sent automatically:**
- New connection request notification
- 24-hour reminder if connection request not accepted
- Daily digest of unseen messages (9am EST cron job)

**Setup:**
1. Go to [brevo.com](https://brevo.com) → create a free account
2. Go to **SMTP & API** → **SMTP** tab
3. Copy **Login** → `SMTP_USER` and **Master password** → `SMTP_PASS`
4. Add and verify a sender email address → `SENDER_EMAIL`
5. Paste all values into `server/.env`

---

## ⚡ Background Jobs (Inngest)

| Function ID | Trigger | Action |
|-------------|---------|--------|
| `sync-user-from-clerk` | `clerk/user.created` | Create user in MongoDB |
| `update-user-from-clerk` | `clerk/user.updated` | Update user in MongoDB |
| `delete-user-with-clerk` | `clerk/user.deleted` | Delete user from MongoDB |
| `send-new-connection-request-remainder` | `app/connection-request` | Email + 24hr reminder |
| `story-delete` | `app/story-delete` | Delete story after 24hr |
| `send-unseen-messages-notification` | Cron `0 9 * * *` (9am EST) | Daily unseen message email |

---

## 🚢 Deployment (Vercel)

**Deploy Server:**
```bash
cd server
vercel --prod
```

**Deploy Client:**
```bash
cd client
npm run build
vercel --prod
```

> After deploying, update `VITE_API_URL` in the Vercel dashboard environment variables to your live server URL.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ using React · Node.js · MongoDB · Clerk · Brevo · ImageKit
</p>
