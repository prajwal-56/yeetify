const generate_qr_btn = document.getElementById('get-qr');
const qr_container = document.getElementById("qrcode");


generate_qr_btn.onclick = async () => {

    if (qr_container.innerHTML !== "") {
        
        qr_container.innerHTML = "";
        return;
    }

    const local_ip_response = await fetch('local_ip');
    const local_ip_data = await local_ip_response.json();
    const url = `http://${local_ip_data.ip}:8000/yeet`

    console.log("ip :" +  local_ip_data.ip )

    qr_container.innerHTML = "";
    new QRCode( qr_container , url);
}

