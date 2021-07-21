const operacion = (num1:number, num2:number, oper:string) =>{
    return new Promise ((resolve, reject) => {
        if (oper.toLowerCase() === "suma"){
            import("./suma")
                .then((lib) => resolve(new lib.Suma(num1, num2).result()))
                .catch((err) => console.log("Module not found!", err));
        }else if (oper.toLowerCase() === "resta"){
            import('./resta')
                .then((lib) => resolve(new lib.Resta(num1, num2).result()))
                .catch((err) => console.log("Module not found!", err));
        }else{
            reject("Ingresa un par de numeros, seguidos de la operacion \"suma\" o \"resta\"");
        }
    });
}

const operaciones = (async () =>{
    const test1 = await operacion(10, 15, "suma");
    console.log(`test1: ${test1}`);
    const test2 = await operacion(28, 47, "resta");
    console.log(`test2: ${test2}`);
})();
