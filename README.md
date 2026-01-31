# 🏥 AI Medical Report Explainer (Hackathon MVP)

A demo-ready web prototype that helps patients understand their medical reports using ethical AI.

## 🌟 Key Features
- **Upload or Paste**: Support for image/PDF uploads (via OCR) or direct text paste.
- **AI Analysis**: Explains parameters in simple stats (High/Low/Normal).
- **Local Language**: One-click translation to Hindi.
- **Safety First**: Non-alarming language and valid disclaimers.

## 🚀 Quick Start in 1 Minute

### Prerequisites
- Node.js installed
- Python 3.8+ installed
- Tesseract OCR (Optional, for image upload support)

### Automated Setup & Run
Double-click `run_demo.bat` to install dependencies and start both servers!

OR manual run:

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs on: `http://localhost:8000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 🧪 Testing with Sample Data
1. Open the App in browser.
2. Click "Paste Text".
3. Copy content from `sample_report.txt` in the project root.
4. Click **Analyze Text**.
5. See the explanation and click "Translate to Hindi" to test local language support.

## ⚠️ Notes
- If you don't have an OpenAI API Key in `.env`, the system will use **Mock Data** suitable for demo purposes.
- OCR requires Tesseract installed on your machine. Text paste works always.

---
*Built for Hackathon Submission*
