import re


def preprocess_text(text: str) -> str:
    if not isinstance(text, str) or not text:
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[^a-z0-9\s,\-]", "", text)
    return text.strip()
