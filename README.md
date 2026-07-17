# UNIverse

This is a campus social app I built with React on the frontend and Node/Express + Socket.io + MongoDB on the backend. It's got a feed, marketplace, assignments, notifications — but the part relevant to this README is the real-time chat feature, so that's what I've focused on documenting below.

## What's in here

universe/
├── client/ React app (Vite)
└── server/ Express API + Socket.io server

Inside `client/src`, the chat lives in `pages/Chat.jsx`, with `socket.js` handling the live connection and `services/api.js` handling regular REST calls.

On the server side, it's organized into `routes`, `controllers`, `models`, and `middleware` — nothing fancy, just kept things separated so it's easy to find stuff.

## Getting it running

You'll need Node 18+ and a MongoDB connection (either running locally or a free Atlas cluster works fine).

**Backend first:**

```bash
cd server
npm install
cp .env.example .env
```

Open the `.env` you just created and fill in your actual `MONGO_URI` and a `JWT_SECRET` (can be any random string). Then:

```bash
npm run dev
```

You should see `MongoDB Connected ✅` and `Server running on port 5000 🚀` in the terminal. If you don't see those, something's off with your `.env`.

**Then the frontend**, in a separate terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

It'll give you a localhost link, usually `http://localhost:5173`.

**To actually test the chat:** you need two different logged-in users, so open one browser normally and one in an incognito window (or two different browsers), register/login as two different accounts, and message between them. It should show up instantly on both sides without refreshing, and refreshing the page should still show the full conversation with timestamps.

## Env variables

**Backend (`server/.env`)**

- `MONGO_URI` — your MongoDB connection string, required
- `JWT_SECRET` — anything random, used to sign login tokens, required
- `PORT` — defaults to 5000 if you don't set it
- `GROQ_API_KEY` — optional, only used for the AI chat assistant feature. If you skip it, that one route just returns a 503 instead of crashing the whole server.

**Frontend (`client/.env`)**

- `VITE_API_URL` — where the backend's REST API lives, defaults to `http://localhost:5000/api`
- `VITE_SOCKET_URL` — where Socket.io connects to, defaults to `http://localhost:5000`

If you ever deploy the backend somewhere real (Render, Railway, etc.), just update these two to point at the live URL and rebuild the frontend — Vite bakes env values in at build time, so a rebuild is required, not optional.

## How the chat actually works

When you hit send, it first goes through a normal REST call (`POST /api/messages`) which saves it to MongoDB and sends back the saved message (with its ID and timestamp). Right after that, the same message gets emitted over the socket connection so the other person sees it pop up instantly — the socket doesn't save anything to the database itself, it just relays what was already saved. I did it this way instead of saving directly through the socket because it keeps the REST API independently testable (you can hit it with Postman without needing a live socket connection) and avoids accidentally saving the same message twice.

Each user joins their own private "room" (named after their user ID) when they connect, so messages only get delivered to the two people actually in that conversation, not broadcast to everyone online.

## Why I made some of these choices

I kept the existing JWT-based login instead of doing a simpler dummy/username-only login, since real auth was already built and works fine — no reason to downgrade it.

Messages persist to MongoDB rather than living only in memory, so chat history survives a server restart.

## What's not done yet

- No typing indicator
- The backend tracks who's online, but that doesn't show up in the UI yet (no green dot or "online" label)
- No read/delivered receipts
- Chat history loads all at once — fine for a demo, but would need pagination for a long-running conversation

## Assumptions I made

- Both people chatting are already registered users — there's no guest/anonymous chat
- You start a conversation by picking someone from the users list, there's no separate "new chat" flow
- Only text messages are supported right now, no images or files
