import admin from "firebase-admin";
import firebase from "../../../config/firebase_creds.js";

// admin.initializeApp({credential: admin.credential.cert(firebase)}); //deberia andar con esto, pero...
if (admin.apps.length === 0) {
    admin.initializeApp(defaultAppConfig); // ... sin esto no funciona... pero anda con permisos de admin igualmente?! quien entendera!
}
const db = admin.firestore();

export class CarritoFirebase{
    constructor(){
        this.db = db;//admin.firestore();
        this.fireQuery = this.db.collection("cart");
        (async (mockData) => { // IIFE init
            if (!(await this.getLastId())){
                mockData.forEach(async (item) => {
                    let doc = this.fireQuery.doc(`${item._id}`)
                    await doc.create({
                        internalId: item._id,
                        timestamp: item.timestamp,
                        nombre: item.nombre,
                        precio: item.precio,
                        descripcion: item.descripcion,
                        codigo: item.codigo,
                        foto: item.foto,
                        totalStock: item.totalStock,
                        currentQuantity: item.currentQuantity,
                        stock: item.stock,
                    })
                })
                console.log("table initialized!");
            }
        })([
            {_id: '1', internalId: "1", timestamp: new Date().getTime(), nombre: 'Sofa', precio: 105, descripcion: 'Sofa rojo', codigo: '123332', foto: 'https://image.flaticon.com/icons/png/512/123/123332.png', totalStock: 16, currentQuantity: 0, stock: 100},
            {_id: '2', internalId: "2", timestamp: new Date().getTime(), nombre: 'Aspiradora', precio: 139, descripcion: 'Aspiradora Moderna', codigo: '123364', foto: 'https://image.flaticon.com/icons/png/512/123/123364.png', totalStock: 35, currentQuantity: 0, stock: 100},
            {_id: '3', internalId: "3", timestamp: new Date().getTime(), nombre: 'Cuadro', precio: 1020, descripcion: 'Marco de madera!', codigo: '123344', foto: 'https://image.flaticon.com/icons/png/512/123/123344.png', totalStock: 49, currentQuantity: 0, stock: 100},
        ]);
    }

    getLastId = async () => {
        return !(await this.fireQuery.get()).empty
        ? (await this.fireQuery.orderBy("internalId", "desc").get()).docs[0].data().internalId
        : false;
    }

    get = async (id) => {
        if (id){
            const prod = await (this.fireQuery.doc(`${id}`)).get();
            if (!prod.empty){
                return {id: prod.id, ...prod.data()};
            }
        }else{
            const querySnapshot = await this.fireQuery.get();
            if (!querySnapshot.empty){
                const docs = querySnapshot.docs;
                const payload = docs.map((item) => ({...item.data(), id: item.id,}));
                return payload;
            }
        }
        return false;
    }

    add = async (id) => {
        if (id){
            const targetItem = this.fireQuery.doc(`${id}`);
            const content = await targetItem.get();
            const [stock, quant] = [content.data().totalStock, content.data().currentQuantity];
            if (stock > 0){
                await targetItem.update({
                    totalStock: stock - 1,
                    currentQuantity: quant + 1,
                });
                return await this.get(id);
            }
        }
        return false;
    }

    update = async (id, newProductData) => {
        undefined; // not implemented, since it's NOT used in cart class;
    }

    delete = async (id) => {
        if (id){
            const targetItem = this.fireQuery.doc(`${id}`);
            const content = await targetItem.get();
            const [stock, quant] = [content.data().totalStock, content.data().currentQuantity];
            if (quant > 0){
                await targetItem.update({
                    totalStock: stock + 1,
                    currentQuantity: quant - 1,
                });
                return await this.get(id);
            }
        }
        return false;
    }

    query = async (options) => {
        if (options){
            let q = {
                ...(options.nombre && {nombre: ["nombre", "==", `${options.nombre}`]}),
                ...(options.precio && {precio: ["precio", "==", `${options.precio}`]}),
                ...(options.internalId && {internalId: ["internalId", "==", `${options.internalId}`]}),
            }
            let prodsQuery = this.fireQuery;
            if (options.nombre){prodsQuery =  prodsQuery.where(q.nombre[0], q.nombre[1], q.nombre[2])};
            if (options.precio){prodsQuery =  prodsQuery.where(q.precio[0], q.precio[1], q.precio[2])};
            if (options.internalId){prodsQuery =  prodsQuery.where(q.internalId[0], q.internalId[1], q.internalId[2])};
            const prods = await prodsQuery.get();
            if (!prods.empty){
                let payload = [];
                return prods.docs.map((prod) => payload.push({id: prod.id, ...prod.data()}));
            }
        }
        return false;
    }
}
