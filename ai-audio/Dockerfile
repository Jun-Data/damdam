# ai-audio/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ ./server/

EXPOSE 8002

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8001"]

