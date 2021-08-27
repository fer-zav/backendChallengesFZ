// usando objetos de ws_main, no hay necesidad de redeclarar!
// const socket = io.connect(window.location.href.split("/api")[0], {forceNew: true});

const addMessage = (e) => {
    e.preventDefault;
    const texto = document.querySelector("#msgTexto");
    const message = {
        auth: document.querySelector("#msgUsername").value,
        text: texto.value,
        date: new Date().getTime(),
    }
    message.auth && message.text ? socket.emit("new_message", message) : false;
    texto.value = "";
    return false;
}

const lz = (n) => n > 9 ? n : `0${n}`;

const lowCostRender = (payload) => {
    const html = payload
        .map((elem) => {
            let f = new Date(elem.date);
            return `<div>
                <span class="timestamp">[${f.getFullYear()}/${lz(f.getMonth())}/${lz(f.getDay())} - ${lz(f.getHours())}:${lz(f.getMinutes())}:${lz(f.getSeconds())}]</span>
                <strong>${elem.auth}</strong>:
                <span>${elem.text}</span>
            </div>`;
        })
        .join(" ");
    document.querySelector("#messages").innerHTML += html;
    // document.querySelector("html").scrollTo({top: 10000, left: 0, behavior: 'smooth'});
    document.querySelector("#messages").scrollTo({top: 10000, left: 0, behavior: 'smooth'});
}

socket.on("messages_init", (msgs) => {
    msgs.length > 0 ? lowCostRender(msgs) : false;
});

socket.on("push_new_message", (newMsg) => {
    const lastMsg = JSON.parse(newMsg)[JSON.parse(newMsg).length - 1];
    lowCostRender([lastMsg]);
});
