import spacy
from spacy.matcher import PhraseMatcher
from skills_data import ALL_SKILLS

_nlp = None
_matcher = None


def load_model():
    global _nlp, _matcher

    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except OSError:
            
            print(
                "Warning: en_core_web_sm not found. Run "
                "`python -m spacy download en_core_web_sm` for best results. "
                "Falling back to blank pipeline."
            )
            _nlp = spacy.blank("en")

        _matcher = PhraseMatcher(_nlp.vocab, attr="LOWER")
        patterns = [_nlp.make_doc(skill) for skill in ALL_SKILLS]
        _matcher.add("SKILLS", patterns)

    return _nlp, _matcher


def extract_skills(text: str):
    if not text or not text.strip():
        return []

    nlp, matcher = load_model()
    doc = nlp(text)
    matches = matcher(doc)

    found = set()
    for match_id, start, end in matches:
        span_text = doc[start:end].text
        
        canonical = next(
            (skill for skill in ALL_SKILLS if skill.lower() == span_text.lower()),
            span_text,
        )
        found.add(canonical)

    return sorted(found, key=str.lower)


if __name__ == "__main__":
    sample = """
    Experienced full-stack developer skilled in React, Node.js, MongoDB,
    and Docker. Strong background in Machine Learning using Python and
    scikit-learn. Excellent communication and leadership skills.
    """
    print(extract_skills(sample))
