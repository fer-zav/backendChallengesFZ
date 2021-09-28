export class CarritoMemDAO{
    cart = [];
    constructor(){
        const mockData = [
            {_id: '1', timestamp: 1631231271759, nombre: 'Sofa', precio: 105, descripcion: 'Sofa rojo', codigo: '123332', foto: 'https://image.flaticon.com/icons/png/512/123/123332.png', totalStock: 16, currentQuantity: 0, stock: 100},
            {_id: '2', timestamp: 1631231272759, nombre: 'Aspiradora', precio: 139, descripcion: 'Aspiradora Moderna', codigo: '123364', foto: 'https://image.flaticon.com/icons/png/512/123/123364.png', totalStock: 35, currentQuantity: 0, stock: 100},
            {_id: '3', timestamp: 1631231273759, nombre: 'Cuadro', precio: 1020, descripcion: 'Marco de madera!', codigo: '123344', foto: 'https://image.flaticon.com/icons/png/512/123/123344.png', totalStock: 49, currentQuantity: 0, stock: 100},
        ];
        mockData.forEach((aMock) => this.cart.push(aMock));
    }

    get = async (id) => {
        return id ? this.cart.filter((aProduct) => aProduct._id === id)[0] : this.cart;
    }

    add = async (id) => {
        if (id){
            const prod = await this.get(id);
            if (prod && prod.totalStock > 0){
                prod.totalStock--;
                prod.currentQuantity++;
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
            const prod = await this.get(id);
            if (prod && prod.currentQuantity > 0){
                prod.totalStock++;
                prod.currentQuantity--;
                return prod;
            }
        }
        return false;
    }

    query = async (options) => {
        const query = [];
        if (options.nombre)
            query.push((aProduct) => aProduct.nombre.toLowerCase() == options.nombre.toLowerCase());
        if (options.precio)
            query.push((aProduct) => aProduct.precio == options.precio);
        return this.cart.filter((aProduct) => query.every((x) => x(aProduct)));
    }
}
