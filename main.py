from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import File , UploadFile
from fastapi import WebSocket
import os

app = FastAPI()

app.mount("/attachments" , StaticFiles(directory="attachments"), name="attachments") # attachments for the web
app.mount("/uploads" , StaticFiles(directory="uploads") , name="uploads")    # for downloading

uploaded_files_path = "uploads/"

# holds the list of connected devices
connections = []


@app.websocket("/websocket")
async def socket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep the connection alive
    except:
        connections.remove(websocket)


@app.get("/")
async def root():
    return {"message" : "Hello World"}

@app.get("/yeet" , response_class=HTMLResponse)
async def root():
    return open("index.html").read()


# when uploading ...
@app.post("/upload")
async def upload_item(file: UploadFile = File(...)):


    os.makedirs(uploaded_files_path , exist_ok=True)
    file_path = os.path.join(uploaded_files_path , file.filename)

    with open(file_path , "wb") as buffer:
        buffer.write( await file.read())

    for connection in connections:
        await connection.send_text("new_file_appeared")

    return {"Status" : "you uploaded (probably)" , "file" : file.filename }

# Uploaded Files
@app.get("/files")
async def get_list():

    return os.listdir(uploaded_files_path)


# to download
@app.get("/download/{filename}")
async def give(filename :str):
    return FileResponse(path="uploads/" + filename , filename=filename)


@app.post("/something")
async def post_something():
    return {"message" : "this does something"}
