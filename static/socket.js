import { render_file_list, delete_file } from "./ui,js";

// web socket things
export function init_socket(){
        const socket = new WebSocket(`ws://${window.location.host}/websocket`); // init handhsake - to form a socket with the server and stays open
        socket.onmessage = (msg) => {
            if(msg.data === "new_file_appeared" || msg.data == "file_removed"){
                render_file_list();
            } else if( msg.data === "yeet"){
                // broadcast_yeet(); // - just pings everyone or notify or something to every clients
            }
        }
}