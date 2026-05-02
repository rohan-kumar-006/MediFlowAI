Set-Location $PSScriptRoot
.\backend\venv\Scripts\python -m uvicorn backend.main:app --reload