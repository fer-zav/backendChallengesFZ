export class ProductosMemDAO{
    productos = [];
    constructor(){
        const mockData = [
            {_id: "1", nombre: "lapiz", precio: 200},
            {_id: "2", nombre: "cartuchera", precio: 250},
            {_id: "3", nombre: "boligoma", precio: 260},
        ];
        mockData.forEach((aMock) => this.productos.push(aMock));
    }

    findIndex = (id) => {
        return this.productos.findIndex((aProduct) => aProduct._id == id);
    }

    find = (id) => {
        return this.productos.find((aProduct) => aProduct._id === id);
    }

    get = async (id) => {
        return id ? this.productos.filter((aProduct) => aProduct._id === id) : this.productos;
    }

    add = async (data) => {
        if (!data.nombre || !data.precio) throw new Error("invalid data");
        const newItem = {
            _id: (this.productos.length + 1).toString(),
            nombre: data.nombre,
            precio: data.precio,
        };
        this.productos.push(newItem);
        return newItem;
    }

    update = async (id, newProductData) => {
        const index = this.findIndex(id);
        const oldProduct = this.productos[index];
        const updatedProduct = {...oldProduct, ...newProductData};
        this.productos.splice(index, 1, updatedProduct);
        return updatedProduct;
    }

    delete = async (id) => {
        this.productos.splice(this.findIndex(id), 1);
    }

    query = async (options) => {
        const query = [];
        if (options.nombre)
            query.push((aProduct) => aProduct.nombre == options.nombre);
        if (options.precio)
            query.push((aProduct) => aProduct.precio == options.precio);
        return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
    }
}
