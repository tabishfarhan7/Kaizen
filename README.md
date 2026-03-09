# Kaizen (改善) - AI Mock Interview Platform

![Kaizen Banner](https://github.com/tabishfarhan7/tabishfarhan7/blob/main/assets/Gemini_Generated_Image_6ou0566ou0566ou0.png)

> **"Continuous Improvement is better than delayed perfection."**

**Kaizen** is a full-stack AI application that simulates real-world job interviews. It allows users to upload their resumes, select a target role, and engage in voice-enabled conversations with an AI interviewer that mimics different personas (e.g., The Strict Tech Lead, The Friendly HR).

## 🚀 Key Features

* **📄 Resume Parsing:** Extracts skills and experience from PDF resumes to tailor questions specifically to the user's background.
* **🤖 AI Interviewer:** Dynamic conversation flow—no hardcoded scripts. The AI asks follow-up questions based on your previous answers.
* **🎙️ Voice Interaction:** Supports Speech-to-Text (STT) for user answers and Text-to-Speech (TTS) for the AI, creating a realistic conversational loop.
* **📊 Instant Feedback:** Real-time analysis of grammar, confidence, sentiment, and technical accuracy.
* **📝 Coding Sandbox:** Integrated code editor for technical whiteboard rounds.
* **📈 Progress Tracking:** Dashboard to track improvement scores over time (The "Kaizen" metric).

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Typography:** Manrope (Clean, modern readability)
* **State Management:** Redux Toolkit or Context API

**Backend:**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose) for user profiles and interview logs.

**AI & API:**
* **LLM Engine:** OpenAI GPT-4 or Google Gemini API (for logic and feedback).
* **Speech Services:** OpenAI Whisper (STT) + ElevenLabs or Web Speech API (TTS).

## 📂 Architecture

```text
/kaizen-app
  ├── /client          # React Frontend
  │     ├── /src
  │     │    ├── /components  # Chat, Recorder, Dashboard
  │     │    └── /pages       # Interview Room, Analytics
  ├── /server          # Node.js Backend
  │     ├── /controllers # AI Logic, Auth
  │     ├── /models      # MongoDB Schemas (User, Interview)
  │     └── /routes      # API Endpoints
  └── README.md
