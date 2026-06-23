from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi import File , UploadFile
from fastapi import WebSocket
from fastapi import Request
from pydantic import BaseModel
from datetime import datetime
import json
import os
from utils import get_local_ip 

app = FastAPI()

app.mount("/attachments" , StaticFiles(directory="attachments"), name="attachments") # attachments for the web
app.mount("/uploads" , StaticFiles(directory="uploads") , name="uploads")    # for downloading
app.mount("/static" , StaticFiles(directory="./static") , name="static")    # for every static file

uploaded_files_path = "uploads/"
message_dir = "messages/"
messages_filename = "messages.json"

# holds the list of connected devices
connections = []

class TextMessage(BaseModel):
    text: str


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
    return RedirectResponse("/yeet")

@app.get("/yeet" , response_class=HTMLResponse)
async def root():
    return open("static/index.html").read()


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

# deleting 
@app.delete("/delete/{filename}")
async def delete(filename: str):
    os.remove( os.path.join(uploaded_files_path , filename) )

    # to update the file list
    for connection in connections:
        await connection.send_text("file_removed")

    return {"status" : "deleted {filename}"}


# text sharing mehod
@app.post("/share-text")
async def text(request: Request , message: TextMessage):
    ip = request.client.host
    now = datetime.now().isoformat()
    

    os.makedirs(message_dir , exist_ok=True)
    messages_files_path = os.path.join(message_dir , messages_filename)

    # creates the json file if non-existent
    if( os.path.exists(messages_files_path) ):
        with open(messages_files_path , "r") as msg_json:
            data = json.load(msg_json)      # Loads the existing content from the json file
    else:
        data = []   # if the messages.json file doesn't exist - starts new 
        with open(messages_files_path , "w") as msg_json:
            # data.append( {"ip":ip , "message" : message.text , "time" : now} )
            json.dump(data , msg_json)


    # Write the new message to the json file
    data.append( {"ip":ip , "message" : message.text , "time" : now} )
    with open(messages_files_path , "w") as msg_json:
        json.dump(data , msg_json)

    
    # broadcast new message arrival :
    for connection in connections:
        await connection.send_text("new_message")

    return {"status" : 200 , "ip" : ip , "message" : message}


# to return the messages 
@app.get("/messages")
async def get_message_list():

    messages_files_path = os.path.join(message_dir , messages_filename)

    # if directory or the file doesn't exist , returns an empty list 
    if not os.path.exists(messages_files_path): 
        return []

    # giving out the messages.json file 
    with open(messages_files_path , "r") as json_file:
        return json.load(json_file)

@app.post("/something")
async def post_something():
    return {"message" : "this does something"}


# to get the ip 
@app.get("/local_ip")
async def local_ip(): 
    return {"ip": f"{get_local_ip()}"}