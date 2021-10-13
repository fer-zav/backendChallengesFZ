import express from 'express';
import Items from '../Items.js'
import faker from "faker";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import {Config} from "../config/config.js";

const endpoints = express.Router();

// const productos = new Items();
const productos = new Items("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
const item2 = {title: "Calculadora", price: "234.56", thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"}
productos.addItem(item2);

const mySecret = Config.SESSION_SECRET;

endpoints.use(cookieParser());
endpoints.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    }),
    secret: mySecret,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 10,
    }
}));


const [userName, password] = ["testName", "testPassword"];

const validateId = (id) => {
    return !isNaN(id) ?
        id >= 0 ?
            id < productos.getLastItemId() ?
                true
            : `Error: no se encontro ningun producto con ID "${id}"!`
        : "Error: ID de producto no puede ser < 0!"
    : `Error: "${id}" es NaN!`;
}

endpoints.get("/", (req, res) => {
    res.json({
        result: "Endpoint inicial!",
    });
});

endpoints.get(["/vista-test/:cant?", "/test-view/:cant?"], (req, res) => {
    const abcd = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const randUrl = ((abc) => `https://i.imgur.com/${[...Array(Math.ceil(Math.random() * 2 + 5)).keys()].map(() => abc[Math.floor(Math.random()*abc.length)]).join("")}.jpg`);
    const cant = Number(req.query.cant) === 0 ? 0 : Number(req.query.cant) || 10;
    let payload = [];

    for (let i=0; i < cant; i++){
        payload.push({
            name: faker.commerce.productName(),
            foto: randUrl(abcd),
            price: faker.commerce.price(),
            description: faker.hacker.phrase()
        });
    }
    res.render("faker",{
        payload: payload,
        layout: "index",
    })
});

//faltaria el middleware de auth, pequeño detalle jaja...
endpoints.get("/login", (req, res) => {
    const {user, pass} = req.query;
    if (user === userName && pass === password){
        console.log("ok");
        req.session.user = user;
        req.session.loggedIn = true;
        req.admin = true;
    }
    console.log(req.query);
    const getProds = () => {return {...productos}};
    console.log(req.session)
    res.render('loginForm', {
        "logged_": req.session.loggedIn,
        "user": req.session.user,
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});
endpoints.get('/logout', (req, res) => {
    const destroyedUser = req.session.user
    req.session.loggedIn = false;
    req.session.destroy((err) => {
        !err
        ? res.render("logoutForm", {
            user: destroyedUser,
            layout: "index"
        })
        : res.json({msg: "Error al cerrar sesion", error: err});
    });
});

endpoints.get(["/vista", "/views"], (req, res) => {
    const getProds = () => {return {...productos}};
    res.render('main', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});

endpoints.get(["/listar", "/list", "/listar/:id", "/list/:id"], (req, res) => {
    let payload = {}
    const itemId = Number(req.params.id);
    if (productos.getItems().length > 0){
        if (!isNaN(itemId)){
            const result = validateId(itemId);
            if (typeof(result) !== "string"){
                payload = {result: productos.getItem(itemId) ? productos.getItem(itemId) : `No hay productos con el id ${itemId}`}
            }else{
                payload = {result: result}
            }
        }else{
            payload = {"result": productos.getItems()}
        }
    }else{
        payload = {"result": `Lista vacia!`}
    }
    res.json(payload);
});

endpoints.get(["/guardar", "/save"], (req, res) => {
    const getProds = () => {return {...productos}};
    res.render('form', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});

endpoints.post(["/agregar", "/add"], (req, res) => {
    let payload = {}
    const itemData = req.body;
    if (itemData?.title && itemData?.price && itemData?.thumbnail){
        productos.addItem(itemData);
        payload = {
            result: "Exito!",
            id: productos.getLastItemId() - 1,
            newProdcut: itemData,
        }
    }else{
        payload = {
            result: "Error: no se puede agregar un item invalido!",
            suppliedItem: itemData,
            validItemFormat: {
                title: "exampleTitle",
                price: "examplePrice",
                thumbnail: "exampleThumbnail",
            }
        }
        res.status("500");
    }
    res.json(payload);
});

endpoints.put(["/actualizar/:id", "/update/:id"], (req, res) => {
    let payload = {}
    const itemId = Number(req.params.id);
    const itemData = req.body;
    if (itemData?.title && itemData?.price && itemData?.thumbnail){
        const result = validateId(itemId);
        if (typeof(result) !== "string"){
            payload = {result: productos.modificarItem(itemId, itemData)}
        }else{
            payload = {result: result}
        }
    }else{
        payload = {
            result: "Error: no se puede actualizar un item invalido!",
            suppliedItem: itemData,
            expectedFormat: {
                title: "exampleTitle",
                price: "examplePrice",
                thumbnail: "exampleThumbnail",
            }
        }
        res.status("500");
    }
    res.json(payload);
});

endpoints.delete(["/borrar", "/delete",  "/borrar/:id", "/delete/:id"], (req, res) => {
    let payload = {}
    const itemId = Number(req.params.id);
    const result = validateId(itemId);
    if (typeof(result) !== "string" && typeof(productos.getItem(itemId)) !== "string"){
        payload = {result: productos.eliminarItem(itemId)}
    }else{
        payload = {result: result === true ? productos.getItem(itemId) : result}
    }
    res.json(payload);
});

export default endpoints;
