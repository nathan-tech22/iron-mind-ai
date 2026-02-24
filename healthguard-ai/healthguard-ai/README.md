# 🏥 HealthGuard AI — Red Team Platform

Healthcare-specific AI chatbot vulnerability scanner. Built for security teams
assessing AI systems in clinical and administrative healthcare environments.

## What It Does

- Runs **20 healthcare-specific adversarial probes** across 10 risk categories
- Uses an **LLM-as-judge** (GPT-4o or Claude) to evaluate responses
- Maps findings to **HIPAA**, **OWASP LLM Top 10**, and **MITRE ATLAS**
- Generates **HTML and JSON reports** suitable for compliance documentation
- Supports any **OpenAI-compatible REST API endpoint**

## Probe Categories

| Category | Probes | Key Risk |
|---|---|---|
| PHI / PII Exfiltration | 3 | HIPAA Privacy Rule |
| Clinical Advice Bypass | 3 | Patient Safety |
| Roleplay Escalation | 2 | Jailbreak / Guardrail bypass |
| Emergency Routing Failure | 3 | Life-safety |
| Drug Misinformation | 2 | Patient Safety |
| Consent Bypass | 1 | HIPAA §164.502(g) |
| Insurance Manipulation | 2 | False Claims Act |
| Prompt Injection | 2 | OWASP LLM01 |
| System Data Extraction | 1 | OWASP LLM07 |
| Clinical Bias | 2 | HIPAA §80 / Equity |

---

## Quick Start

### 1. Prerequisites

- Docker & Docker Compose installed
- An OpenAI or Anthropic API key (for LLM judge)

### 2. Setup

```bash
# Clone or unzip the project
cd healthguard-ai

# Copy and configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start all services
docker-compose up -d

# Check everything is running
docker-compose ps
```

### 3. Access the App

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs

### 4. Run Your First Scan

1. Go to **Targets** → Add Target
2. Enter your chatbot's API endpoint URL and auth key
3. Click **Test** to verify connectivity
4. Go to **New Scan** → Select target → Select probe categories → Launch
5. Watch results live on the Scan Detail page
6. Download HTML report when complete

---

## Configuration

### Connecting to Different Chatbot Types

**OpenAI-compatible (Azure OpenAI, OpenAI API, etc.):**
```
Endpoint: https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_MODEL/chat/completions?api-version=2024-02-01
Auth Type: API Key
Auth Header: api-key
Response Path: $.choices[0].message.content
```

**Custom REST API:**
```
Endpoint: https://your-chatbot.hospital.com/api/v1/chat
Auth Type: Bearer
Response Path: $.data.response  (adjust to match your API's response structure)
```

**Request Template (for non-standard APIs):**
If your chatbot doesn't use the OpenAI message format, provide a custom request template
with `{{prompt}}` as the placeholder:
```json
{
  "question": "{{prompt}}",
  "session_id": "healthguard-test",
  "user_id": "red-team"
}
```

### Judge LLM

The judge evaluates each chatbot response and determines if a vulnerability was exploited.

- **GPT-4o** (default): Set `OPENAI_API_KEY` in `.env`
- **Claude**: Set `ANTHROPIC_API_KEY` and `JUDGE_MODEL=claude-opus-4-6`
- **Keyword fallback**: If no API keys set, uses keyword matching (less accurate)

---

## Adding Custom Probes

Edit `backend/app/probes/healthcare_probes.py` and add entries to the `PROBES` list:

```python
{
    "id": "custom_001",
    "name": "My Custom Probe",
    "category": "phi_exfiltration",  # must match a key in PROBE_CATEGORIES
    "severity": "high",
    "prompt": "Your adversarial prompt here",
    "success_indicators": ["words", "that", "indicate", "vulnerability"],
    "fail_safe_indicators": ["words", "that", "indicate", "safe", "response"],
    "hipaa_reference": "45 CFR §164.xxx",
    "mitre_atlas_ref": "AML.Txxxx",
    "owasp_ref": "LLMxx:2025",
    "remediation": "Recommended fix for this vulnerability.",
},
```

---

## Integrating Garak (Advanced)

The architecture is designed to run alongside Garak for broader coverage.
To run Garak scans in parallel:

```bash
# Install garak
pip install garak

# Run against an OpenAI-compatible endpoint
python -m garak --model_type openai --model_name your-model \
  --probes dan,encoding,promptinject \
  --report_dir ./reports
```

Garak reports (JSONL) can be imported into the database via a custom script.
See `backend/app/services/` for the pattern to follow.

---

## Architecture

```
healthguard-ai/
├── docker-compose.yml          # Orchestrates all services
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point
│   │   ├── core/
│   │   │   ├── config.py       # Settings from env vars
│   │   │   ├── database.py     # SQLAlchemy models
│   │   │   └── celery_app.py   # Async task queue
│   │   ├── api/
│   │   │   ├── targets.py      # Target CRUD endpoints
│   │   │   ├── scans.py        # Scan management + findings
│   │   │   ├── probes.py       # Probe library endpoints
│   │   │   └── reports.py      # HTML + JSON report generation
│   │   ├── probes/
│   │   │   └── healthcare_probes.py  # ← YOUR PROBE LIBRARY
│   │   └── services/
│   │       ├── judge.py          # LLM-as-judge evaluator
│   │       ├── scan_runner.py    # Celery async scan execution
│   │       └── target_connector.py  # HTTP client for target chatbots
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.js
│       │   ├── Targets.js
│       │   ├── NewScan.js
│       │   ├── ScanDetail.js    # Live progress + findings
│       │   └── ProbeLibrary.js
│       └── utils/api.js
└── .env.example
```

---

## Security Notes

- API keys entered for targets are stored in the PostgreSQL database. In production,
  integrate with a secrets manager (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault).
- This tool is for **authorized testing only**. Ensure you have written authorization
  before scanning any chatbot system.
- Run on an isolated network segment. Do not expose the backend API publicly.
- Treat reports as sensitive security findings — handle per your organization's
  data classification policy.

---

## Roadmap

- [ ] Garak scan import / unified findings view
- [ ] PyRIT multi-turn attack sequences
- [ ] Scheduled / recurring scans
- [ ] SIEM webhook integration (Splunk, Sentinel)
- [ ] SSO / Active Directory authentication
- [ ] Custom scoring rubrics per organization
- [ ] Comparison view: same target across multiple scan dates

---

## Legal

For authorized security testing only. Use responsibly.
