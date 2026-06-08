function generateQR() {
    const ipqr = new QRCode(document.getElementById("qrcode"), window.location.href)
    
}

generateQR();