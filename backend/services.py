import os
import json
import pytesseract
from PIL import Image
from deep_translator import GoogleTranslator
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Configure OpenAI (Mock if no key)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Pre-defined mock response for testing/fallback
MOCK_RESPONSE = {
    "parameters": [
        {
            "name": "Hemoglobin",
            "value": "11.5 g/dL",
            "normal_range": "13.0 - 17.0 g/dL",
            "status": "Low",
            "explanation": "Your hemoglobin is slightly below the normal range, which might indicate mild anemia."
        },
        {
            "name": "Total Leucocyte Count (TLC)",
            "value": "7500 /cmm",
            "normal_range": "4000 - 11000 /cmm",
            "status": "Normal",
            "explanation": "Your white blood cell count is within the healthy range, indicating your immune system is likely fine."
        }
    ],
    "summary": "Overall, your report shows slightly low hemoglobin, but other parameters seem normal. It is important to eat iron-rich foods.",
    "questions": [
        "What dietary changes can help improve my hemoglobin?",
        "Do I need any iron supplements?",
        "When should I repeat this test?",
        "Are there any other tests required to investigate the low hemoglobin?",
        "Is this level of hemoglobin worrying for my age?"
    ]
}

SYSTEM_PROMPT = """You are a medical report explanation assistant.
Rules:
- Do NOT diagnose diseases
- Do NOT prescribe treatments or medicines
- Do NOT provide emergency advice
- Use calm, simple, non-alarming language
- Assume the user has education up to 10th grade

Task:
Explain the medical report in a structured and patient-friendly way.

For each medical parameter, return:
- Name
- Patient Value
- Normal Range
- Status: Low / Normal / High
- Simple explanation (1–2 sentences)

Also generate:
- A short overall summary
- Exactly 5 safe, non-diagnostic questions the patient can ask their doctor

Output format MUST be valid JSON.
"""

def extract_text_from_image(image_path: str) -> str:
    try:
        # Pytesseract path might need configuration on windows if not in PATH
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"OCR Error: {e}")
        return "Error extracting text. Please provide clear text."

def analyze_medical_report(report_text: str) -> dict:
    if not client:
        print("No OpenAI Key found. Returning mock data.")
        return MOCK_RESPONSE

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # or gpt-4o if available
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Medical Report Text:\n{report_text}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"LLM Error: {e}")
        return MOCK_RESPONSE

def translate_explanation(text: str, target_lang: str = 'hi') -> str:
    try:
        translator = GoogleTranslator(source='auto', target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Translation Error: {e}")
        return text  # Return original if translation fails
