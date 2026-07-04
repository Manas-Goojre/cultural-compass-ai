import re

INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"disregard\s+(all\s+)?prior",
    r"system\s+prompt",
    r"jailbreak",
    r"you\s+are\s+now",
    r"act\s+as\s+DAN",
]


def sanitize_user_text(text: str, max_length: int = 4000) -> str:
    cleaned = (text or "").strip()
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
    return cleaned


def detect_prompt_injection(text: str) -> bool:
    lowered = (text or "").lower()
    return any(re.search(pattern, lowered) for pattern in INJECTION_PATTERNS)
