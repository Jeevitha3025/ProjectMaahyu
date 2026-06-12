# 🌸 Maahyu — AI-Powered Maternal Wellness Companion

> *"You're doing better than you think, mama."*

Maahyu is a full-stack maternal wellness web app that blends AI support, traditional Indian wisdom, mood tracking, and community — built for mothers at every stage of pregnancy and early motherhood.

---

## ✨ Features

### 🗓️ Feelings Diary (Mood Calendar)
- Daily mood logging with 7 emotion types (Happy, Calm, Loved, Sad, Anxious, Frustrated, Tired)
- Multi-mood selection per day with colour-coded calendar tiles
- Optional journal note per entry
- Past entries are locked after saving to preserve emotional history
- Appointment & medicine reminders pinned to calendar dates
- All data persisted in **Firebase Firestore** — survives sign-out and sign-in

### 🤖 SheRo — AI Chatbot
- Floating chat widget available on every page
- Powered by **Google Gemini 2.5 Flash** via an Express backend
- Emotionally aware responses tuned for pregnant and postpartum mothers
- **Crisis detection system** — scans for high and medium severity keywords
- Flagged messages are saved to a `flags` Firestore collection with user details and emergency contact info for admin review
- Passes user name, email, and emergency contact to backend on every message

### 🌿 Grandma's Wisdom
- AI-generated traditional wellness tips specific to the user's **Indian region and motherhood stage**
- Covers pregnancy, postpartum, breastfeeding, and newborn care
- Each tip includes the traditional practice, scientific explanation (compounds, mechanisms), local language name, and safety notes
- Powered by Gemini 2.5 Flash with structured JSON output

### 📊 MaaWrapped
- Weekly and monthly emotional journey recap
- Stats: days logged, consistency %, streak, top mood, journal word count
- Donut chart of emotional mix (Joyful, Calm, Stressed, Low Energy)
- Happiest and toughest day highlights
- AI-generated personalised reflection with theme + affirmation (Gemini API, client-side)
- Gentle suggestions for the week ahead based on mood patterns
- Longest journal note surfaced as "most heartfelt entry"
- Minimum 10 entries required to unlock Monthly Wrapped

### 💬 MaaGang (Community)
- Community groups for mothers to connect

### 🩺 Heart Check-In (Screening)
- Science-backed mental health screening (PHQ/anxiety style)
- Results tagged and stored in user profile as `screeningTags`

### 🔐 Auth & Onboarding
- Email/password and **Google Sign-In** via Firebase Auth
- Onboarding flow collects: name, DOB, phone, motherhood stage, emergency contact
- Age auto-calculated from DOB and stored in Firestore
- Protected routes redirect unauthenticated or incomplete-onboarding users appropriately

---

## 🏗️ Tech Stack

### Frontend
| Tech | Usage |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| shadcn/ui + Radix UI | Component library |
| Firebase SDK v12 | Auth & Firestore client |
| Google Gemini API (client) | MaaWrapped reflections |
| TanStack Query | Server state management |
| Lucide React | Icons |

### Backend
| Tech | Usage |
|---|---|
| Node.js + Express | REST API server |
| Google GenAI SDK (`@google/genai`) | Gemini 2.5 Flash for chat & wisdom |
| Firebase Admin SDK | Firestore writes (flags collection) |
| dotenv | Environment config |
| cors | Cross-origin requests |

### Database & Auth
| Service | Usage |
|---|---|
| Firebase Authentication | User sign-up, login, Google OAuth |
| Cloud Firestore | Users, mood entries, reminders, flags |

---

## 📁 Project Structure

```
maahyu/
├── backend/
│   ├── server.js              # Express API — /chat and /grandma-wisdom endpoints
│   ├── serviceAccountKey.json # Firebase Admin credentials (DO NOT COMMIT)
│   ├── .env                   # GEMINI_API_KEY
│   └── package.json
│
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── nurturing-avatar.png
│   ├── components/
│   │   ├── chat/
│   │   │   └── MaaMindChatbot.tsx    # Floating AI chatbot widget
│   │   ├── community/
│   │   │   ├── GroupCard.tsx
│   │   │   └── GroupChat.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── maawrapped/
│   │       ├── MoodDonut.tsx
│   │       └── WrappedStory.tsx
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state, login, signup, onboarding
│   ├── hooks/
│   │   ├── useMaaWrapped.ts          # Fetches mood entries, computes stats
│   │   └── useWrappedReflection.ts   # Gemini API call for weekly reflection
│   ├── lib/
│   │   └── wrappedUtils.ts           # Pure data utils: ranges, stats, suggestions
│   ├── pages/
│   │   ├── Index.tsx                 # Landing page
│   │   ├── Auth.tsx                  # Login / signup
│   │   ├── Onboarding.tsx            # Profile setup
│   │   ├── Dashboard.tsx
│   │   ├── MoodCalendar.tsx          # Feelings diary
│   │   ├── GrandmaWisdom.tsx
│   │   ├── MaaGang.tsx               # Community
│   │   ├── Screening.tsx             # Mental health check-in
│   │   └── MaaWrapped.tsx            # Weekly/monthly recap
│   ├── firebase.ts                   # Firebase app init
│   └── App.tsx                       # Routes + auth guards
│
├── .env                              # VITE_GEMINI_API_KEY
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with **Authentication** and **Firestore** enabled
- A Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/your-username/maahyu.git
cd maahyu
```

### 2. Frontend setup
```bash
npm install
```

Create `.env` in the root:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
# Frontend runs on http://localhost:8080
```

### 3. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
```

Place your Firebase service account JSON as `backend/serviceAccountKey.json`.

```bash
npm start
# Backend runs on http://localhost:5000
```

---

## 🔒 Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile and subcollections
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /moodEntries/{entryId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /reminders/{reminderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Flags written by backend (Admin SDK bypasses rules)
    match /flags/{flagId} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

---

## 🌐 API Endpoints

### `POST /chat`
Sends a message to Gemini and returns a compassionate response. Also checks for crisis keywords and logs flags to Firestore.

**Request body:**
```json
{
  "message": "I'm feeling really overwhelmed today",
  "uid": "user_uid",
  "userName": "Priya",
  "userEmail": "priya@example.com",
  "emergencyContact": "Husband",
  "emergencyPhone": "9876543210"
}
```

**Response:**
```json
{ "reply": "That sounds really hard, and it makes sense to feel that way..." }
```

### `POST /grandma-wisdom`
Generates regional traditional wellness tips as a JSON array.

**Request body:**
```json
{
  "region": "Karnataka",
  "stage": "Postpartum",
  "category": "Nutrition",
  "count": 6
}
```

---

## 🚨 Crisis Detection

The backend flags messages containing distress keywords into two severity levels:

- **High**: suicide, self-harm, want to die, etc.
- **Medium**: hopeless, worthless, can't cope, feel empty, etc.

Flagged entries are saved to the `flags` Firestore collection with full user context including emergency contact details, for admin monitoring. The chat response is **never blocked** — the user always receives a compassionate reply.

---

## 🌍 Multilingual Support

The landing page typewriter greeting cycles through 14 Indian languages:
Bengali, Gujarati, Hindi, Kannada, Kashmiri, Malayalam, Marathi, Odia, Punjabi, Sanskrit, Tamil, Telugu, Urdu, Assamese.

---

## 📄 License

MIT — built with 🤍 for every mother.
