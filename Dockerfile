FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.13.5-slim
WORKDIR /app
RUN pip install poetry
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-root
COPY . .
COPY --from=frontend-build /frontend/out ./static
CMD ["poetry", "run", "uvicorn", "app.main:app", "--port", "8000", "--host", "0.0.0.0"]
