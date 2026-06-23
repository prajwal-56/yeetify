import { render_file_list, delete_file } from "./ui.js";
import { init_socket } from "./socket.js";

render_file_list();
init_socket();

const text_box = document.getElementById('text_box')
const form = document.querySelector('#text-field form')

console.log("form element:", form);  // DEBUG: should NOT be null

form.addEventListener( 'submit' , async function(event) {
    event.preventDefault();
    console.log("submit fired!");  // DEBUG: confirms listener is running

    const message = text_box.value;
    console.log("sending message:", message);
    
    const response = await fetch("/share-text" , {
        method:'POST',
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify( {text: message})
    })

    const result = await response.json();
    console.log("server response:", result);  // DEBUG: see what backend returns

    text_box.value = "";  // clear the input after sending
})

console.log("Yeetify is live ! 💫")