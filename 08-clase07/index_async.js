import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const puerto = process.env.PORT || 8080;

const visitas = {items: 0, item: 0, visitas: 0, visitasGlobales: 0};
const [prods, cantProds] = [(async () => {let prods = await JSON.parse(await fs.readFile("products.txt", "utf-8")); return [await prods, await prods.products.length]})()];
const app = express();

app.get("/", (request, response) => {
    visitas.visitasGlobales++; // landing page tmb cuenta!
    const linkList = path.resolve('./views/linkList.html');
    response.sendFile(linkList);
});

app.get("/items", async (request, response) => {
    visitas.items++;
    visitas.visitasGlobales++;
    try{
        (async () => {
            let payload = await {
                cantidad: await cantProds,
                prods: await prods,
            };
            await response.json(payload);
        })();
    }catch{
        response.json({
            msg: "Error en el llamado async a la api :shrug:"
        });
    }
});

app.get("/item-random", async (request, response) => {
    visitas.item++;
    visitas.visitasGlobales++;
    try{
        (async () => {
            let p = await prods;
            p = p.products;
            let cants = cantProds;
            let index = Math.floor(Math.random() * cants - 1) + 1;
            let product = await p[index];
            response.json({
                prod: await product,
            });
        })();
    }catch{
        response.json({
            msg: "Error en el llamado async a la api :shrug:"
        });
    }
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
