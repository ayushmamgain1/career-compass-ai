<div align="center">
  <img src="frontend/public/compass.svg" alt="Career Compass AI" width="84" />
  <h1>Career Compass AI</h1>
  <p><strong>Your AI-powered companion for a more confident career journey.</strong></p>
  <p>Understand your strengths · Improve your resume · Discover opportunities · Prepare for interviews</p>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  </p>
</div>

---

## ✨ About the project

**Career Compass AI** is a full-stack career-development platform designed to bring several parts of the job-search journey into one place. It combines resume analysis, skill extraction, job discovery and matching, personalized learning roadmaps, and AI-assisted mock interviews.

The application is built as three cooperating parts:

- **Frontend** — a React single-page application powered by Vite, Redux Toolkit, and Tailwind CSS.
- **Backend** — a Node.js and Express REST API with MongoDB persistence, authentication, and Socket.IO support.
- **NLP service** — a small Python/Flask service that extracts skills from text using spaCy and project skill data.

> The AI-generated feedback and match indicators are decision-support tools. They should be reviewed alongside your own judgement and the requirements of each role.

## 🧭 What you can do

| Area | Capabilities |
|---|---|
| **Account & profile** | Register, verify an email with OTP, log in, use Google authentication, and manage your profile. |
| **Resume workspace** | Upload and manage resumes, view resume details, and set an active resume. |
| **Resume intelligence** | Extract resume text and skills, calculate an ATS-style score with a category breakdown, and request AI feedback including strengths, weaknesses, suggestions, and rewritten bullet points. |
| **Job discovery** | Browse saved jobs, search an external job provider when configured, and view job recommendations. |
| **Job matching** | Compare a resume with a job and review skill gaps; run bulk skill-gap analysis. |
| **Learning roadmaps** | Generate a general roadmap or a roadmap targeted to a job. |
| **Mock interviews** | Start role-based practice, answer generated questions, receive feedback and scores, and complete an interview summary. |
| **Dashboard & reports** | View consolidated career information and download a career report as a PDF. |
| **Live connection** | Socket.IO is used for online-user presence updates. |

## 🧰 Tech stack

### Frontend

- React 19 + Vite
- React Router
- Redux Toolkit + React Redux
- Tailwind CSS 4
- Motion for animations
- Axios for API requests
- Recharts for data visualisation
- Socket.IO Client
- Google OAuth client integration
- Lucide React icons and Sonner notifications

### Backend

- Node.js (ES modules) + Express 5
- MongoDB + Mongoose
- JWT authentication and bcryptjs password hashing
- Google Auth Library
- Google Gemini API for generative career assistance
- Multer, pdf-parse, and Mammoth for resume file handling and text extraction
- Nodemailer for email/OTP delivery
- PDFKit for downloadable reports
- Socket.IO for real-time presence

### NLP microservice

- Python + Flask
- spaCy-based skill extraction
- CORS support

## 🏗️ Architecture

```text
┌─────────────────────────────┐
│       React + Vite UI       │
│  Pages · Redux · API client  │
└──────────────┬──────────────┘
               │ HTTP / Socket.IO
               ▼
┌─────────────────────────────┐
│      Node.js + Express      │
│ Auth · Resume · Jobs · AI   │
│ Match · Roadmap · Interview │
│ Dashboard · Reports         │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌──────────────┐  ┌────────────────────┐
│   MongoDB    │  │ Google Gemini API  │
│ User data,   │  │ AI feedback and    │
│ resumes,     │  │ generated content  │
│ jobs, etc.   │  └────────────────────┘
└──────────────┘
        │
        │ HTTP
        ▼
┌─────────────────────────────┐
│   Python Flask NLP service  │
│       spaCy skill parser    │
└─────────────────────────────┘
```

## 📁 Project structure

```text
career-compass-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication and uploads
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # REST API routes
│   │   ├── services/        # Gemini, NLP, ATS and job services
│   │   ├── utils/           # Shared helpers and utilities
│   │   ├── uploads/         # Local upload directory
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # API clients
│   │   ├── app/             # Redux store
│   │   ├── components/      # Shared UI and layouts
│   │   ├── features/        # Redux feature slices
│   │   ├── lib/             # Socket client
│   │   ├── pages/           # Application pages
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── nlp-service/
│   ├── app.py
│   ├── skill_extractor.py
│   ├── skills_data.py
│   └── requirements.txt
└── README.md
```

## ⚙️ Getting started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.10+ (recommended)
- MongoDB connection (local MongoDB or MongoDB Atlas)
- A Google Gemini API key
- Google OAuth credentials if you want to enable Google sign-in
- Job search API credentials if you want external job listings
- SMTP credentials if you want email OTP delivery

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd career-compass-ai
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env` using `.env.example` as the template and fill in the values:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/career_compass_ai

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=15d

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash

NLP_SERVICE_URL=http://localhost:5001

JOB_API_KEY=your_job_api_key
JOB_API_URL=https://jsearch.p.rapidapi.com/search-v2

CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

SMTP_EMAIL=your_email_address
SMTP_PASSWORD=your_smtp_or_app_password

OTP_SECRET=replace_with_a_separate_random_secret
```

Only the values required by the features you intend to use need to be configured, but MongoDB, JWT, Gemini, and the NLP service are needed for the main workflow. Keep real credentials out of Git; never commit `.env` files.

**Important setup note:** `backend/src/index.js` currently calls `dotenv.config({ path: './env' })`, while the supplied template is named `.env.example`. To use the conventional `backend/.env` file shown above, change that line to:

```js
dotenv.config({ path: './.env' });
```

Alternatively, name your local environment file `backend/env`. The README recommends the conventional `.env` filename.

Start the API from the `backend` directory:

```bash
npm start
```

The API listens on the port configured by `PORT` (5000 in the example).

### 3. Start the NLP service

In a separate terminal, from the project root:

```bash
cd nlp-service
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

Install dependencies and run Flask:

```bash
pip install -r requirements.txt
python app.py
```

The service starts at `http://localhost:5001` and exposes:

- `GET /health` — service health check
- `POST /extract-skills` — extract skills from a JSON body containing a `text` field

### 4. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the development server:

```bash
npm run dev
```

Vite will print the local URL (normally `http://localhost:5173`). Open it in your browser.

### 5. Build the frontend

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔌 API overview

All application API routes are mounted under `/api`. Most user-specific endpoints require a valid authentication token.

| Module | Base path | Available operations |
|---|---|---|
| Health | `/api/health` | API health check |
| Authentication | `/api/auth` | Register, verify/resend OTP, Google login, login, get/update profile |
| Resumes | `/api/resumes` | Upload, list, get active resume, get by ID, delete |
| AI analysis | `/api/ai` | Analyze a resume |
| Jobs | `/api/jobs` | Search, recommendations, list, create, get by ID |
| Matching | `/api/match` | Match a resume to a job; bulk skill-gap analysis |
| Roadmaps | `/api/roadmap` | Generate general or job-specific roadmap |
| Interviews | `/api/interviews` | Start, list, retrieve, submit an answer, complete an interview |
| Dashboard | `/api/dashboard` | Retrieve dashboard data |
| Reports | `/api/reports` | Download career report |

For exact request bodies, response formats, and parameter requirements, refer to the route and controller files in `backend/src`.

## 🔐 Environment variables

| Variable | Used for |
|---|---|
| `PORT` | Backend HTTP server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Signing and configuring authentication tokens |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Gemini API access and configured generation model |
| `NLP_SERVICE_URL` | Base URL of the Flask NLP service |
| `JOB_API_KEY`, `JOB_API_URL` | Optional external job-search integration |
| `CLIENT_URL` | Express CORS allowed frontend origin |
| `CORS_ORIGIN` | Socket.IO CORS allowed origin |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Backend Google OAuth configuration |
| `SMTP_EMAIL`, `SMTP_PASSWORD` | Email delivery configuration |
| `OTP_SECRET` | OTP-related secret configuration |
| `VITE_API_BASE_URL` | Frontend API base URL |
| `VITE_SOCKET_URL` | Frontend Socket.IO server URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID used by the frontend |

## 🧪 Scripts

| Directory | Command | Purpose |
|---|---|---|
| `backend` | `npm start` | Start backend with Nodemon |
| `frontend` | `npm run dev` | Start Vite development server |
| `frontend` | `npm run build` | Create production frontend build |
| `frontend` | `npm run preview` | Preview production build |
| `frontend` | `npm run lint` | Run ESLint |
| `nlp-service` | `python app.py` | Start Flask NLP service |

There is currently no automated backend test suite configured in the supplied `backend/package.json`.

## 🛡️ Security & configuration reminders

- Use strong, unique secrets for JWT and OTP signing.
- Keep API keys, OAuth secrets, and SMTP credentials in local environment files or a secrets manager.
- Configure both `CLIENT_URL` and `CORS_ORIGIN` for the frontend origin you actually deploy.
- Restrict upload size and accepted file types appropriately for your deployment environment.
- Use HTTPS in production and review authentication, file handling, and API rate limiting before exposing the service publicly.
- Do not treat an AI-generated ATS score or recommendation as a hiring decision.

## 🚧 Current project notes

- The repository contains the frontend, Express backend, and Flask NLP service; run each service separately during local development.
- External job search depends on valid provider credentials. Without them, the job service falls back to the local database dataset.
- Gemini-powered analysis, roadmaps, and interview generation require a working Gemini API key.
- Google sign-in and email OTP depend on valid OAuth and SMTP configuration respectively.
- The backend environment loader currently points to `./env`; update it to `./.env` if you follow the conventional setup instructions above.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Make your changes and test the relevant services.
4. Commit: `git commit -m "feat: describe your change"`.
5. Push your branch and open a pull request.

## 📄 License

No license file is currently included in this repository. Add a `LICENSE` file before presenting the project as open source with specific reuse permissions.

---

<div align="center">
  <strong>Find your direction. Build your next opportunity.</strong>
  <br />
  <sub>Built with curiosity and a little help from AI. ✨</sub>
</div>
