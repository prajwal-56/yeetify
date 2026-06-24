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

export async function copy_to_clipborad(cpy_btn , text){
    try {
        await navigator.clipboard.writeText(text);

        // changes the button text when "copied" and to "copy" after 5 seconds
        cpy_btn.innerHTML = "copied !";

        setTimeout( () => {
            cpy_btn.innerHTML = "copy";
        } , 10000 )
    } catch(err){
        alert("Failed to copy for some reason ")
    }
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
        const text = document.createElement('span');

        cpy_btn.innerHTML = `copy`;
        cpy_btn.className="copy-content-btn";
        cpy_btn.onclick = () => copy_to_clipborad( cpy_btn , msg.message);

        text.innerHTML = `<span class="message-ip"> ${msg.ip}</span>  : <span class="message-content"> ${msg.message} </span>`;

        li.append(text);
        li.append(cpy_btn);
        messages_ul.append(li);
    })

    message_container.append(messages_ul)

}