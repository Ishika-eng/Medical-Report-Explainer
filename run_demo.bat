@echo off
echo Starting Medical Report Explainer...

echo Starting Backend...
start cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload"

echo Starting Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo Demo started! Backend at localhost:8000, Frontend at localhost:5173
echo Ensure Tesseract is installed for OCR features.
pause
