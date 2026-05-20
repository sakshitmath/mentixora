# Mentixora 🚀
### Your Space to Connect Beyond Limits

A modern full-stack social community platform inspired by Reddit, LinkedIn, and Instagram — built as an internship project.

![Mentixora](https://mentixora.vercel.app)

## 🌐 Live Demo
- **Frontend:** https://mentixora.vercel.app
- **Backend API:** https://mentixora-backend.onrender.com

## ✨ Features

### Core Features
- 🔐 JWT Authentication (Signup/Login)
- 👥 Communities (Create, Browse, View)
- 📝 Posts (Create, List, Sort by Latest/Trending)
- 💬 Comments (Add, View)
- ⬆️ Voting System (Upvote/Downvote with toggle)
- 🔍 Search posts by keyword
- 📱 Fully responsive (Mobile + Desktop)

### Unique Features
- 😊 **Mood Tagging** — Tag posts with moods (Happy, Rant, Question, Inspiring, Debate)
- 🏆 **Credix System** — Reputation points, contributor levels, leaderboard, badges
- 💡 **Reaction System** — 6 reactions (Helpful, Relatable, Interesting, Inspirational, Funny, Appreciated)
- ⚡ **Karma System** — Auto-updates on posts, comments, votes, reactions
- 🔥 **Trending Feed** — Posts sorted by upvotes in last 24 hours
- 🎨 **Post Flairs** — Colorful labels for posts

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.3.4 (Java 21) |
| Security | Spring Security + JWT |
| Database ORM | Spring Data JPA + Hibernate |
| Database | PostgreSQL (Supabase) |
| Frontend | Next.js 16 + Tailwind CSS |
| HTTP Client | Axios |
| Backend Deploy | Render.com |
| Frontend Deploy | Vercel |

## 🏗️ Architecture
## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/communities | Get all communities |
| POST | /api/communities | Create community |
| GET | /api/posts | Get all posts |
| GET | /api/posts/trending | Get trending posts |
| POST | /api/posts | Create post |
| POST | /api/comments | Add comment |
| POST | /api/votes | Vote on post |
| POST | /api/reactions | React to post |
| GET | /api/credix/leaderboard | Get leaderboard |

## 🚀 Local Setup

### Prerequisites
- Java 21
- Maven
- PostgreSQL
- Node.js 18+

### Backend Setup
```bash
cd backend/backend
# Update application.properties with your DB credentials
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 👤 Test Credentials
- Email: `rahul@mentixora.com`
- Password: `password123`

## 🎓 Developer
**Sakshi Torgalmath**
Internship Project — 2026
