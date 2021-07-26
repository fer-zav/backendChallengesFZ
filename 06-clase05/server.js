const http = require("http");

const getProd = () => {
    const rand = (n, i = true) => {return i ? Math.floor(Math.random() * n - 1) + 1 : (Math.random() * n).toFixed(2)};
    const payload = {
        id: rand(10),
        title: `Producto #${rand(10)}`,
        price: `$${rand(10000, 0)}`,
        thumbnail: `Foto #${rand(10)}`,
    };
    return `${JSON.stringify(payload)}`;
}

const server = http.createServer((request, response) => {
    const message = getProd();
    response.end(message);
    console.log(response.statusCode, response.statusMessage)
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server listening @port: ${PORT}`);
});
