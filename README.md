# ESG Analytics Platform

A full-stack application for ESG (Environmental, Social, and Governance) analytics and reporting.

## Project Structure 

/esg-saas
├── backend/ # Python Flask backend
│ ├── app/
│ └── requirements.txt
└── frontend/ # React TypeScript frontend
├── src/
└── package.json

## Setup

### Backend

bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py

### Frontend

bash
cd frontend
npm install
npm start