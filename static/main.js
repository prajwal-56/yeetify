import { render_file_list, delete_file } from "./ui.js";
import { init_socket } from "./socket.js";

render_file_list();
init_socket();

console.log("Yeetify is live ! 💫")