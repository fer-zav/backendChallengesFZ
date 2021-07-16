const fin = (n) => console.log(`Proceso completo! palabras totales: ${n}\n`);

const funcChlg03 = (phrase, callback, t = undefined) => {
    const phraseArr = phrase.split(" ");
    let cont = 0;
    t = t || 1000;

    return new Promise((resolve, reject) => {
        let timed = setInterval(() => {
            if (phraseArr[cont]){
                console.log(phraseArr[cont]);
                cont++;
            }else{
                clearInterval(timed);
                callback(cont);
                resolve();
            }
        }, t);
    });
}

funcChlg03("Frase no tan larga", fin)
    .then(() => funcChlg03("Frase corta", fin, 500))
    .then(() => funcChlg03("Solo ... frase!", fin, 300));
