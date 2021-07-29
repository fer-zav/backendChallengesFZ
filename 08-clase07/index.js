import express from 'express';
import path from 'path';
import fs from 'fs';

const puerto = process.env.PORT || 8080;

const visitas = {items: 0, item: 0, visitas: 0, visitasGlobales: 0};
const prods = JSON.parse(fs.readFileSync("products.txt", "utf-8"));
const cantProds = prods.products.length;
const app = express();

app.get("/", (request, response) => {
    visitas.visitasGlobales++; // landing page tmb cuenta!
    const linkList = path.resolve('./views/linkList.html');
    response.sendFile(linkList);
});

app.get("/items", (request, response) => {
    visitas.items++;
    visitas.visitasGlobales++;
    response.json({
        prods: prods.products,
        cantidad: cantProds
    });
});

app.get("/item-random", (request, response) => {
    visitas.item++;
    visitas.visitasGlobales++;
    response.json({
        prod: prods.products[Math.floor(Math.random() * cantProds - 1) + 1],
    })
});

app.get("/visitas", (request, response) => {
    visitas.visitas++;
    visitas.visitasGlobales++;
    response.send({
        visitas: {
            items: visitas.items,
            item: visitas.item,
            visitas: visitas.visitas,
            visitasGlobales: visitas.visitasGlobales,
        }
    });
});

const server = app.listen(puerto, () => {
    console.log(`Server HTTP listening @ port ${server.address().port}`);
});
server.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));
