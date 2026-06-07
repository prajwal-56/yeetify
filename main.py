from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi import File , UploadFile
import os

app = FastAPI()

app.mount("/attachments" , StaticFiles(directory="attachments"), name="attachments") # attachments for the web
app.mount("/uploads" , StaticFiles(directory="uploads") , name="uploads")    # for downloading

uploaded_files_path = "./uploads/"


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

    return {"Status" : "you uploaded (probably)" , "file" : file.filename }

# Uploaded Files
@app.get("/uploads")
async def get_list():

    return os.listdir(uploaded_files_path)

@app.post("/something")
async def post_something():
    return {"message" : "this does something"}
