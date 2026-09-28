"""
Career Compass AI - NLP Microservice (Python + spaCy)

Exposes skill extraction as an HTTP API that the Node.js backend calls
into (see services/nlpService.js on the Node side).

Run locally:
    pip install -r requirements.txt
    python -m spacy download en_core_web_sm
    python app.py

Production:
    gunicorn -w 2 -b 0.0.0.0:5001 app:app
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from skill_extractor import extract_skills

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "nlp-skill-extractor"}), 200


@app.route("/extract-skills", methods=["POST"])
def extract_skills_route():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    if not text:
        return jsonify({"success": False, "message": "No 'text' field provided"}), 400

    try:
        skills = extract_skills(text)
        return jsonify({"success": True, "skills": skills}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


if __name__ == "__main__":
    port = 5001
    print(f"NLP microservice running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
