export const randoms = (cant) => {
    // const from = new Date().getTime();
    cant = Number(req.query.cant) || parseInt(2**26.5754247591); //10e8 mata la ejecucion D", pero log(2, 10e7) funciona!
    const payload = [...Array(cant).keys()].map((i) => Math.ceil(Math.random() * 1000));
    const count = {}
    payload.map((i) => count[i] ? count[i] += 1 : count[i] = 1);
    return count;
}

// process.on("message", async (msg) => {
//     console.log("adentro...");
//     console.log((await msg));
// });
// process.send({msg: "no estaria funcionando yet..."});
// let resultado;
// if (process && process.send){
process.on("message", (msg) => {
    console.log("nunca llega aca \"/");
    console.log(`Mensaje del padre: ${JSON.stringify(msg)}`);
    console.log(msg);
    msg = JSON.parse(msg);
    if (msg.msg == "start"){
        console.log("msg adentro: ");
        const resultado = randoms(msg.cant);
        process.send(resultado);
        process.exit(0);
    }
});
// }

    process.send({msg: "this gets through... somehow"})
    // process.send({result: resultado});

// let contador = 0;
// process.on("message", (msg) => {
//     console.log(`Mensaje del padre: ${JSON.stringify(msg)}`);
//     setInterval(() => {
//         process.send({contador: contador++});
//     }, 1000);
// });
