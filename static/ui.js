export async function delete_file(filename , file_in_list){

    const confirmation = confirm ("Do you really wanna delete this file ? " + filename)

    // proceed with removing/deleting the file
    if (confirmation){
        
        const response = await fetch(`/delete/${filename}` , {
            method: `DELETE`,
        })

        if(response.ok) file_in_list.remove();
    } 
}

// to remove the message from the list when removed .
export async function remove_message(msg_timestamp , msg_in_list){
    const confirmation = confirm("Do you wanna remove this text/message/content :" + msg_timestamp + "  ?\nAre you sure?")

    // proceed with removing/deleting the message
    if (confirmation){
        
        const response = await fetch(`/delete-message/${msg_timestamp}` , {
            method: `DELETE`,
        })

        if(response.ok) msg_in_list.remove();
    } 

}

export async function copy_to_clipborad(cpy_btn , text){
    try {
        
        if(navigator.clipboard){ // if navigator.clipboard exist, use it. (probably works only on localhosts/https )
            await navigator.clipboard.writeText(text);
            // changes the button text when "copied" and to "copy" after 5 seconds
            cpy_btn.innerHTML = "copied !";
        } else {
            // workaround if navigator.clipboard fails
            // creates a throw away element. uses `execCommand('copy')` to copy to clipboard

            const temp = document.createElement('textarea');
            temp.value = text
            temp.style.position = 'fixed'
            temp.style.opacity = '0'
            document.body.appendChild(temp)                                                                                             
            temp.select()
            document.execCommand('copy')
            document.body.removeChild(temp)
        }

        setTimeout( () => {
            cpy_btn.innerHTML = "copy";
        } , 10000 )
    } catch(err){
        alert("Failed to copy for some reason ")
    }
}

export function get_color_for_ip(ip){
    let hash = 0;
    const saturation = "70%";
    const lightness = "56%";

    for( let i = 0; i < ip.length; i++){
        // bit wise hash calculation
        hash = ip.charCodeAt(i) + ( (hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    console.log(` hash generated for ${ip} : ${hue} `)

    return `hsl(${hue} , ${saturation} , ${lightness} )`
}


export async function render_file_list(){

    const response = await fetch("/files")
    const response_json = await response.json()

    console.log(response_json)

    const fileList_container = document.getElementById('file-list');
    fileList_container.innerHTML = "";

    const files_ul = document.createElement('ul');


    response_json.forEach(filename => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        const rm_btn = document.createElement('button');

        // color the left border based on filename hash
        li.style.borderLeftColor = get_color_for_ip(filename);

        // adding Link to each file entries 
        link.href = `/download/${filename}`;
        link.textContent = filename;
        link.setAttribute('download' , filename);

        // remove button
        rm_btn.innerHTML = `Remove`;
        rm_btn.className="remove-file-btn";
        rm_btn.onclick = () => delete_file( filename , li )

        li.append(link);
        li.append(rm_btn);
        files_ul.append(li)
    });

    fileList_container.append(files_ul);
}


export async function render_message_list(){
    const response = await fetch("/messages");
    const response_json = await response.json();

    const message_container = document.getElementById('message-list');
    message_container.innerHTML = "";

    const messages_ul = document.createElement('ul');
    response_json.forEach(msg => {
        const li = document.createElement('li');
        const cpy_btn = document.createElement('button');
        const rm_msg_btn = document.createElement('button');
        const text = document.createElement('span');

        // color the left border to match the ip color
        li.style.borderLeftColor = get_color_for_ip(msg.ip);

        // copy button stuffs
        cpy_btn.innerHTML = `copy`;
        cpy_btn.className="copy-content-btn";
        cpy_btn.onclick = () => copy_to_clipborad( cpy_btn , msg.message);

        // remove message button stuffs
        rm_msg_btn.innerHTML = `x`;
        rm_msg_btn.className = `remove-file-btn`;
        rm_msg_btn.onclick = () => remove_message(msg.time , li);


        text.innerHTML = `<span class="message-ip" style="color:${get_color_for_ip(msg.ip)};"> ${msg.ip}</span>  : <span class="message-content"> ${msg.message} </span>`;

        li.append(text);
        li.append(cpy_btn);
        li.append(rm_msg_btn);
        messages_ul.append(li);
    })

    message_container.append(messages_ul)

}