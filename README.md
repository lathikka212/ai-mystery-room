# AI Mystery Room 🕵️‍♂️

An interactive, text-driven escape room application where Google Gemini acts as an autonomous Game Master, interpreting freeform player actions and generating dynamic narrative progression in real time.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Axios, CSS3
- **Backend:** Node.js, Express.js
- **AI Integration:** Google Gemini API (`@google/generative-ai`)

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- Gemini API Key

### 2. Backend Setup
```bash
# Navigate to root directory
npm install

# Create a .env file and add your key:
# GEMINI_API_KEY=your_gemini_api_key_here

# Start the server
node server.js