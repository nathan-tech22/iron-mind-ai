"""
Target Connector
================
Handles sending adversarial prompts to target chatbot endpoints
and extracting the response text.
"""

import httpx
import json
from typing import Optional
from jsonpath_ng import parse as jsonpath_parse

from app.core.database import Target


async def send_probe(target: Target, prompt: str) -> str:
    """
    Send a probe to the target chatbot and return the response text.
    Supports OpenAI-compatible APIs, custom REST endpoints.
    """
    headers = {"Content-Type": "application/json"}

    # Auth
    if target.auth_type == "bearer" and target.auth_value:
        headers["Authorization"] = f"Bearer {target.auth_value}"
    elif target.auth_type == "api_key" and target.auth_header and target.auth_value:
        headers[target.auth_header] = target.auth_value

    # Build request body
    if target.request_template:
        # Custom template - replace {{prompt}} placeholder
        body = json.loads(json.dumps(target.request_template).replace("{{prompt}}", prompt))
    else:
        # Default: OpenAI-compatible format
        body = {
            "model": target.model_name or "gpt-4",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 1000
        }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            target.endpoint_url,
            headers=headers,
            json=body
        )
        response.raise_for_status()
        response_json = response.json()

    # Extract response text using jsonpath
    response_path = target.response_path or "$.choices[0].message.content"
    try:
        expr = jsonpath_parse(response_path)
        matches = expr.find(response_json)
        if matches:
            return str(matches[0].value)
    except Exception:
        pass

    # Fallback: try common response structures
    for path in [
        response_json.get("choices", [{}])[0].get("message", {}).get("content"),
        response_json.get("response"),
        response_json.get("text"),
        response_json.get("output"),
        response_json.get("message"),
        str(response_json)
    ]:
        if path:
            return str(path)

    return str(response_json)


async def test_target_connection(target: Target) -> dict:
    """Test if a target endpoint is reachable and responding."""
    try:
        response_text = await send_probe(target, "Hello, can you hear me?")
        return {
            "success": True,
            "response_preview": response_text[:200],
            "message": "Target is reachable and responding"
        }
    except httpx.HTTPStatusError as e:
        return {
            "success": False,
            "message": f"HTTP {e.response.status_code}: {e.response.text[:200]}"
        }
    except httpx.ConnectError:
        return {
            "success": False,
            "message": "Could not connect to target endpoint. Check URL and network."
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error: {str(e)}"
        }
