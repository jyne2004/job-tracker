🔗 **Live Demo:** https://job-tracker-pi-eight.vercel.app

## Features
- Add, edit, and delete job applications
- Track status: Applied, Interview, Offer, Rejected
- Dashboard with stats and pie chart visualisation
- Search and filter by company, role, or status
- Sort by date applied
- Dark mode
- User authentication (register/login)
- Each user only sees their own applications

## Tech Stack
**Frontend:** React, Recharts, React Hot Toast, Vite  
**Backend:** Python, FastAPI, SQLAlchemy  
**Database:** PostgreSQL (Neon)  
**Deployment:** Vercel (frontend) + Render (backend)

## Screenshots
*(Add screenshots here)*

## Running Locally

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend `.env`:**