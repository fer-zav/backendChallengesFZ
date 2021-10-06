// const socket = io.connect(window.location.href.split("/api")[0], {forceNew: true});

const addMessage = (e) => {
    e.preventDefault;
    const texto = document.querySelector("#msgTexto");
    const message = {
        nickname: document.querySelector("#msgUsername").value,
        msg: texto.value,
        createdAt: new Date().getTime(),
    }
    message.nickname && message.msg ? socket.emit("new_message", message) : false;
    texto.value = "";
    return false;
}

const lowCostRender = (payload) => {
    console.log(payload)
    const html = payload
        .map((elem) => {
            return `<div>
                <span>${elem.id}.</span>
                <span class="timestamp">[${elem.createdAt}]</span>
                <strong>${elem.nickname}</strong>:
                <span>${elem.msg}</span>
            </div>`;
        })
        .join(" ");
    document.querySelector("#messages").innerHTML += html;
    document.querySelector("#messages").scrollTo({top: 10000, left: 0, behavior: 'smooth'});
}

socket.on("messages_init", (msgs) => {
    msgs.length > 0 ? lowCostRender(msgs) : false;
    // document.querySelector("html").scrollTo({top: 10000, left: 0, behavior: 'smooth'});
});

socket.on("push_new_message", (newMsg) => {
    // const lastMsg = newMsg[newMsg.length - 1];
    lowCostRender(newMsg);
});
