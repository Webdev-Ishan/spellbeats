# SpellCode 🎵

A modern, full-stack audio streaming platform built with Next.js, Prisma, PostgreSQL, and Cloudinary. SpellCode lets creators upload, manage, and share youtube vedios as streams, while users can search, play, and interact with tracks through upvotes and personalized dashboards.

---

# Live Link

[www.spellbeats.online](www.spellbeats.online)

## 🚀 Features

- **Authentication:** Secure login/signup with NextAuth and JWT.
- **Creator Dashboard:** Upload YouTube vedios, auto-fetch metadata, and manage your streams.
- **Music Player:** Responsive, interactive player with queue, volume, and like/unlike (upvote/downvote) functionality.
- **Search:** Fast, case-insensitive search for streams.
- **Upvote/Downvote:** Real-time like/unlike for tracks, synced with backend.
- **Cloudinary Integration:** Automatic upload and streaming of music files.
- **RESTful API:** Robust endpoints for streams, upvotes, search, and player.
- **Responsive UI:** Built with Tailwind CSS and Lucide icons for a beautiful experience.
- **Professional Error Handling:** Toast notifications and backend validation for all actions.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL (Neon)
- **Auth:** NextAuth.js (JWT)
- **Storage:** Cloudinary (music files, images)
- **Other:** Axios, Zod, React Toastify, Lucide React

---

## 📦 Project Structure

```
spellcode/
├── app/
│   ├── api/           # API routes (streams, upvote, downvote, search, player)
│   ├── player/        # Player page
│   └── ...            # Other pages
├── components/
│   └── ui/            # UI components (music-player, creator-dashboard, etc.)
├── lib/               # Database and helper utilities
├── public/            # Static assets (placeholder.svg, logo.png, etc.)
├── prisma/            # Prisma schema
├── .env               # Environment variables
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/spellcode.git
cd spellcode
npm install
```

### 2. Configure Environment

Create a `.env` file with sample values:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
NODE_ENV=development
NEXT_AUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
salt_value=your_salt_value
RESEND_API_KEY=your_resend_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
```

### 3. Set Up Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 API Endpoints

- `POST /api/streams` — Add a new stream (YouTube URL)
- `GET /api/streams` — Get all streams for the authenticated user
- `POST /api/upvote` — Upvote a stream
- `POST /api/downvote` — Remove upvote from a stream
- `POST /api/search` — Search streams by title
- `POST /api/player` — Get details for a single stream

All endpoints require authentication via JWT.

---

## 🎨 UI Highlights

- **Music Player:** Play, pause, like/unlike, and queue navigation.
- **Creator Dashboard:** Upload, view, and manage your music.
- **Search Page:** Find music by title, with instant feedback.
- **Responsive Design:** Works beautifully on desktop and mobile.

---

## 🏆 Why SpellCode?

- **Modern stack:** Next.js App Router, Prisma, and Cloudinary.
- **Clean code:** TypeScript, Zod validation, and modular architecture.
- **Professional UX:** Toast notifications, error handling, and smooth interactions.
- **Remote-ready:** Built for scale, security, and maintainability.

---

## 📚 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

MIT

---

## 💼 About

SpellCode is designed for remote-first teams and modern music creators.  
Built by [Ishan Saini], inspired by the best practices in full-stack development.

---

## 📮 Contact

- [LinkedIn](www.linkedin.com/in/ishan-saini-49b6842a6)
- [GitHub](https://github.com/Webdev-Ishan)
- [Twitter](https://x.com/saini_isha57790)
- [Email](mailto:ishansaini0105@gmail.com)

---


