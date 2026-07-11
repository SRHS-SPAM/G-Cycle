import base64
import io
import uuid

import qrcode


def generate_code_value(prefix: str = "gcycle") -> str:
    """Generate a unique, hard-to-guess QR payload value."""
    return f"{prefix}:{uuid.uuid4().hex}"


def generate_qr_image_base64(value: str) -> str:
    """Render a QR code PNG for the given value and return it as a base64 data URL."""
    img = qrcode.make(value)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"
