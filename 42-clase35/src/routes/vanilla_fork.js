export const randoms = async (cant) => {
    cant = Number(cant) || parseInt(2**26.5754247591); //10e8 mata la ejecucion D", pero log(2, 10e7) funciona!
    const payload = [...Array(cant).keys()].map((i) => Math.ceil(Math.random() * 1000));
    const count = {}
    payload.map((i) => count[i] ? count[i] += 1 : count[i] = 1);
    return count;
}

process.on("message", async (msg) => {
    if (msg.msg == "start"){
        const resultado = (await randoms(msg.cant));
        process.send({process: process.pid, msg: resultado});
        process.exit(0);
    }
});
