import fs from "fs";

export class CarritoFSDAO{
    cart = [];
    nombreArchivo = "";
    constructor(fileName){
        const mockData = [
            {_id: '1', timestamp: 1631231271759, nombre: 'Sofa', precio: 105, descripcion: 'Sofa rojo', codigo: '123332', foto: 'https://image.flaticon.com/icons/png/512/123/123332.png', totalStock: 16, currentQuantity: 0, stock: 100},
            {_id: '2', timestamp: 1631231272759, nombre: 'Aspiradora', precio: 139, descripcion: 'Aspiradora Moderna', codigo: '123364', foto: 'https://image.flaticon.com/icons/png/512/123/123364.png', totalStock: 35, currentQuantity: 0, stock: 100},
            {_id: '3', timestamp: 1631231273759, nombre: 'Cuadro', precio: 1020, descripcion: 'Marco de madera!', codigo: '123344', foto: 'https://image.flaticon.com/icons/png/512/123/123344.png', totalStock: 49, currentQuantity: 0, stock: 100},
        ];
        this.nombreArchivo = fileName;
        this.cart = mockData;
        fs.stat(this.nombreArchivo, (err, stats) => {
            if (JSON.stringify(this.cart, null, "\t").length > stats.size){
                this.guardar(); // para evitar el loop infinito de nodemon, ademas de asegurar que exista un minimo de items al momento de inicializar
            }
        })

    }

    leer = async (archivo) => {
        this.cart = JSON.parse(await fs.promises.readFile(archivo, "utf-8"));
    }

    guardar = async () => {
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(this.cart, null, "\t"));
    }

    find = async (id) => {
        await this.leer(this.nombreArchivo);
        return this.cart.find((aProduct) => aProduct._id === id);
    }

    get = async (id) => {
        await this.leer(this.nombreArchivo);
        return id ? this.cart.filter((aProduct) => aProduct._id === id)[0] : this.cart;
    }

    add = async (id) => {
        if (id){
            const prod = await this.find(`${id}`);
            if (prod && prod.totalStock > 0){
                prod.totalStock--;
                prod.currentQuantity++;
                await this.guardar();
                return prod;
            }
        }
        return false;
    }

    update = async (id, newProductData) => {
        undefined; // not implemented, since it's NOT used in cart class;
    }

    delete = async (id) => {
        if (id){
            const prod = await this.find(`${id}`);
            if (prod && prod.currentQuantity > 0){
                console.log(prod.totalStock, prod.currentQuantity)
                prod.totalStock++;
                prod.currentQuantity--;
                console.log(prod.totalStock, prod.currentQuantity)
                await this.guardar();
                return prod;
            }
        }
        return false;
    }

    query = async (options) => {
        await this.leer(this.nombreArchivo);
        const query = [];
        if (options.nombre)
            query.push((aProduct) => aProduct.nombre == options.nombre);
        if (options.precio)
            query.push((aProduct) => aProduct.precio == options.precio);
        return this.cart.filter((aProduct) => query.every((x) => x(aProduct)));
    }
}
