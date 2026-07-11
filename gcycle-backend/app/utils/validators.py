import re

PHONE_RE = re.compile(r"^\+?[0-9]{9,15}$")


def is_valid_phone_number(value: str) -> bool:
    return bool(PHONE_RE.match(value.replace("-", "").replace(" ", "")))
