from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
from services import extract_text_from_image, analyze_medical_report, translate_explanation

app = FastAPI(title="Medical Report Explainer")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for hacking
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParameterAnalysis(BaseModel):
    name: str
    value: str
    normal_range: str
    status: str  # Low, Normal, High
    explanation: str

class ReportAnalysisResponse(BaseModel):
    parameters: List[ParameterAnalysis]
    summary: str
    questions: List[str]
    disclaimer: str = "This tool is for educational purposes only and does not provide medical diagnosis or treatment advice. Always consult a qualified healthcare professional."

class TranslationRequest(BaseModel):
    text: str
    target_lang: str = "hi"

@app.get("/")
def read_root():
    return {"message": "Medical Report Explainer API is running"}

@app.post("/analyze", response_model=ReportAnalysisResponse)
async def analyze_report(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Either file or text must be provided")

    extracted_text = ""
    
    if file:
        # Save temp file
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        try:
            extracted_text = extract_text_from_image(temp_filename)
        finally:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
    else:
        extracted_text = text

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from report.")

    analysis_result = analyze_medical_report(extracted_text)
    return analysis_result

@app.post("/translate")
async def translate_content(request: TranslationRequest):
    translated_text = translate_explanation(request.text, request.target_lang)
    return {"translated_text": translated_text}
