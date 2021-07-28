const fs = require("fs/promises");

class Archivo{
    constructor(fileName){
        this.fileName = fileName;
        this.items = [];
    }

    // crear = async () => { //C
    // }
    leer = async () => { //R
        try{
            const data = await fs.readFile(this.fileName, "utf-8");
            console.log(`Contenido de ${this.fileName}:`);
            console.log(data);
        }catch(err){
            console.log(this.content.toString());
        }
    }
    guardar = async (title, price, thumb) => { //U
        try{
            const newItem = { title: title, price: price, thumbnail: thumb, id: this.items.length + 1};
            this.items.push(newItem);
            await fs.appendFile(this.fileName, JSON.stringify(newItem), "utf-8");
            console.log(`Archivo ${this.fileName} actualizado con exito!`);
        }catch(err){
            console.log(`Error en ${this.fileName}: ${err}`);
        }
    }
    borrar = async () => { //D
        try{
            await fs.unlink(this.fileName);
            console.log(`Archivo ${this.fileName} borrado con exito!`);
        }catch(err){
            console.log(`Error borrando ${this.fileName}: No existe el archivo!`);
        }
    }
}

const payload1 = { title: "Escuadra", price: 123.45, thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"};
const payload2 = { title: "Calculadora", price: 234.56, thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"};
const payload3 = { title: "Globo Terraqueo", price: 345.67, thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"};
const otroItem = { title: "Mochila", price: 456.78, thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/bag-pack-container-school-512.png"};


const archivo = new Archivo("testFile.txt");
archivo.guardar(payload1);
archivo.guardar(payload2);
archivo.guardar(payload3);
archivo.guardar(otroItem);
archivo.leer();

const archivo2 = new Archivo("archivo_para_borrar_con_error_catcheado.txt"); // da error adrede por no existir!
archivo2.borrar();

const archivo3 = new Archivo("archivo_para_borrar_sin_error.txt");
archivo3.guardar("");
archivo3.borrar();
