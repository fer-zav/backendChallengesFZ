import fs from "fs";

export class ProductosFSDAO{
    productos = [];
    nombreArchivo = "";
    constructor(fileName){
        const mockData = [
            {_id: "1", nombre: "lapiz", precio: 200},
            {_id: "2", nombre: "cartuchera", precio: 250},
            {_id: "3", nombre: "boligoma", precio: 260},
        ];
        this.nombreArchivo = fileName;
        this.productos = mockData;
        this.guardar();
    }

    leer = async (archivo) => {
        this.productos = JSON.parse(await fs.promises.readFile(archivo, "utf-8"));
    }

    guardar = async () => {
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(this.productos, null, "\t"));
    }

    findIndex = async (id) => {
        await this.leer(this.nombreArchivo);
        return this.productos.findIndex((aProduct) => aProduct._id == id);
    }

    find = async (id) => {
        await this.leer(this.nombreArchivo);
        return this.productos.find((aProduct) => aProduct._id === id);
    }

    get = async (id) => {
        await this.leer(this.nombreArchivo);
        return id ? this.productos.filter((aProduct) => aProduct._id === id) : this.productos;
    }

    add = async (data) => {
        if (!data.nombre || !data.precio) throw new Error("invalid data");
        await this.leer(this.nombreArchivo);
        const newItem = {
            _id: (this.productos.length + 1).toString(),
            nombre: data.nombre,
            precio: data.precio,
        };
        this.productos.push(newItem);
        await this.guardar();
        return newItem;
    }

    update = async (id, newProductData) => {
        await this.leer(this.nombreArchivo);
        const index = await this.findIndex(id);
        const oldProduct = this.productos[index];
        const updatedProduct = {...oldProduct, ...newProductData};
        this.productos.splice(index, 1, updatedProduct);
        await this.guardar();
        return updatedProduct;
    }

    delete = async (id) => {
        await this.leer(this.nombreArchivo);
        const index = await this.findIndex(id);
        this.productos.splice(index, 1);
        await this.guardar();
    }

    query = async (options) => {
        await this.leer(this.nombreArchivo);
        const query = [];
        if (options.nombre)
            query.push((aProduct) => aProduct.nombre == options.nombre);
        if (options.precio)
            query.push((aProduct) => aProduct.precio == options.precio);
        return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
    }
}
