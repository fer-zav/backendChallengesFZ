import express from 'express';
import { title } from 'process';
import Items from './Items.js'
import serverChecker from './serverChecker.js';


const app = express();
const puerto = 8080;
const productos = new Items("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
const item2 = {title: "Calculadora", price: "234.56", thumbnail: "https://cdn3.]iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"}
productos.addItem(item2);

const server = app.listen(puerto, () => {
    console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({
        result: "Endpoint inicial!",
    });
});

app.get("/api/productos/listar/", (req, res) => {
    if (productos.getItems()){
        res.json({
            result: productos.getItems(),
        });
    }else{
        res.json({
            result: "Error: Lista de productos vacia!",
        });
    }
});

app.get("/api/productos/listar/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!isNaN(id)){
        if (id >= 0){
            if (id < productos.getItems().length){
                res.json({
                    result: productos.getItem(id),
                });
            }else{
                res.json({
                    result: `Error: no se encontro ningun producto con ID "${id}"!`,
                });
            }
        }else{
            res.json({
                result: "Error: ID de producto no puede ser < 0!",
            });
        }
    }else{
        res.json({
            result: `Error: "${req.params.id}" es NaN!`,
        });
    }
});

app.post("/api/productos/guardar/", (req, res) => {
    const itemData = req.body;
    if (itemData?.title && itemData?.price && itemData?.thumbnail){
        productos.addItem(itemData);
        res.json({
            result: "Exito!",
            id: productos.getItems().length - 1,
            newProdcut: itemData,
        })
    }else{
        res.json({
            result: "Error: no se puede agregar un item invalido!",
            suppliedItem: itemData,
            validItemFormat: {
                title: "exampleTitle",
                price: "examplePrice",
                thumbnail: "exampleThumbnail",
            }
        })
    }
});

serverChecker();
