from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from function import extract_isbn_codes
import  matplotlib.pyplot as plt
from pyzbar.pyzbar import decode 

app = FastAPI()

origins = [
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def get_file(file: UploadFile = File(...)):
    content = await file.read()
    nparr = np.fromstring(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    bd = cv2.barcode.BarcodeDetector()
    retval, decoded_info, decoded_type, _ = bd.detectAndDecode(img)
    # Save image for debugging purposes
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)) # Convert color space for matplotlib
    plt.savefig('debug_image.png')  # Save the image to a file

    if retval:
        isbn = extract_isbn_codes(decoded_info)
        return isbn
    else:
        return -1
    
@app.post("/api/test")
async def test(file: UploadFile = File(...)):
    content = await file.read()
    nparr = np.fromstring(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    #ここで結果読み取り
    result=decode(img)
    return result