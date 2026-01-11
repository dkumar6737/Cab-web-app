# Deployment Guide

Your application has two parts:
1.  **Frontend** (React) - Currently deployed on Vercel.
2.  **Backend** (Node.js + Socket.io) - **Not deployed yet.**

**Important:** You generally cannot deploy a Socket.io/WebSocket backend to Vercel because Vercel uses "Serverless Functions" which sleep after a few seconds, breaking the real-time connection.

You should deploy your backend to **Render.com** (it has a free tier and supports WebSockets).

## Step 1: Deploy Backend to Render.com

1.  Go to [Render.com](https://render.com) and create an account.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository: `kumardipak6737/Cab-web-app`.
4.  Configure the service:
    *   **Name:** `cab-app-backend` (or similar)
    *   **Root Directory:** `Backend` (Important!)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
5.  Scroll down to **Environment Variables** and add:
    *   `DB_CONNECT`: (Your MongoDB Connection String)
    *   `JWT_SECRET`: `user-video-secret` (or your secret)
    *   `NODE_ENV`: `production`
    *   `PORT`: `4000` (Optional, Render usually sets its own PORT, but good to have)
6.  Click **"Create Web Service"**.
7.  Wait for deployment. You will get a URL like `https://cab-app-backend.onrender.com`.

## Step 2: Connect Frontend to Backend

1.  Go to your **Vercel Dashboard** -> Project Settings -> **Environment Variables**.
2.  Edit `VITE_BASE_URL`:
    *   Current: `http://localhost:4000` (or empty)
    *   **New Value:** `https://cab-app-backend.onrender.com` (The URL you got from Render).
3.  **Redeploy** the Frontend in Vercel (Go to Deployments -> Redeploy).

## Step 3: Verify

Open your Vercel app. It should now be able to talk to the Backend on Render.
