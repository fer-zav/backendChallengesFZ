import admin from "firebase-admin";
import firebase from "../../../config/firebase_creds.js";

admin.initializeApp({credential: admin.credential.cert(firebase)});
const db = admin.firestore();

export class ProductosFirebase{
    constructor(){
        this.db = db;//admin.firestore();
        this.fireQuery = this.db.collection("productos");
        (async (mockData) => { // IIFE init
            if (!(await this.getLastId())){
                mockData.forEach(async (item) => {
                    let doc = this.fireQuery.doc(`${item._id}`)
                    await doc.create({
                        internalId: item._id,
                        nombre: item.nombre,
                        precio: item.precio,
                    })
                })
                console.log("table initialized!");
            }
        })([
            {_id: "1", internalId: "1", nombre: "lapiz", precio: 200},
            {_id: "2", internalId: "2", nombre: "cartuchera", precio: 250},
            {_id: "3", internalId: "3", nombre: "boligoma", precio: 260},
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

    add = async (data) => {
        const lastId = Number(await this.getLastId());
        if (data && data.nombre && data.precio){
            (async (item) => {
                let newDoc = this.fireQuery.doc(`${lastId + 1}`);
                data.internalId
                ? await newDoc.create({nombre: item.nombre, precio: item.precio, internalId: data.internalId})
                : await newDoc.create({nombre: item.nombre, precio: item.precio, internalId: (await this.getLastId()) + 1});
                console.log("newItemCreated!");
                return await this.get(lastId + 1);
            })(data);
        }
        return false;
    }

    update = async (id, newProductData) => {
        if (id){
            const target = this.fireQuery.doc(`${id}`);
            if (newProductData && (newProductData.nombre || newProductData.precio)){
                await target.update({...newProductData});
                console.log(`product ${id} updated!`);
                return await this.get(id);
            }
        }
        return false;
    }

    delete = async (id) => {
        if (id){
            const deletedItem = await this.get(id);
            await (this.fireQuery.doc(`${id}`)).delete();
            return deletedItem;
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
