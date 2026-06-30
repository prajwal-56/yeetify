# Yeetify 🚀


### Yeet your files and messages across your Local Area Network (LAN) instantly!
Yeetify is a simple, lightweight, and real-time local network file- and text-sharing web application built with FastAPI and WebSockets.



![Python](https://img.shields.io/badge/python-3.10+-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

---

## Features

- **Instant File Sharing**: Upload files from any device on your LAN.
- **Text & Clipboard Sharing**: Copy-paste text or links between devices quickly.
- **WebSocket Real-time Updates**: Changes are broadcasted to all connected devices instantly.
- **Local IP Auto-discovery & QR Code**: Scan the dynamically generated QR code on your mobile device to connect immediately.

---

## Running Locally 💻

Follow these steps to run Yeetify directly on your machine:

### 1. Prerequisites
Make sure you have **Python 3.10+** installed on your system.

### 2. Install Dependencies
You can install the required Python packages using `pip`:
```bash
pip install -r requirements.txt
```

### 3. Start the Server
Run the FastAPI development server:
```bash
fastapi dev main.py --host 0.0.0.0
```
Alternatively, run it via Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Once started, access the web interface at `http://localhost:8000` or from another device at `http://<your-local-ip>:8000/yeet`.

---

## Running with ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) !

### 1. Build the Docker Image 
```bash
docker build -t yeetify .
```

### 2. Run the Container Manually
To host the container manually, run it with host networking:
```bash
docker run -d --name yeetify --network host yeetify
```

---

## Running with Docker Compose

You can also run Yeetify using Docker Compose. A pre-configured [docker-compose.yml](docker-compose.yml) is included in the project.

Start the service in the background:
```bash
docker compose up -d
```

Stop the service:
```bash
docker compose down
```

---

> [!WARNING]
> **Docker Networking & QR Code:** When running inside a container, host networking (`--network host` or `network_mode: host`) is required for the local IP discovery utility to fetch the host's actual LAN IP. Running in bridge mode will cause the QR code to point to an unreachable internal Docker IP.