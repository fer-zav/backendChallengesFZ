import http from 'http';

const serverChecker = (puerto) => {

    const url = "127.0.0.1";

    setTimeout(async () => {
        const options = {
            hostname: url,
            port: puerto,
            path: '/productos/listar/',
            method: 'GET'
        }
        const req = http.request(options, (res) => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            process.stdout.write("\n");
        });
        req.on('error', (error) => {
            console.error(error);
        })
        .end();
    }, 1000);

    setTimeout(async () => {
        const options = {
            hostname: url,
            port: puerto,
            path: '/productos/listar/',
            method: 'GET'
        }
        const temp = options.path;
        for (let i = 0; i < 3; i++){
            options.path = temp + i;
            const req = http.request(options, (res) => {
                res.on('data', (d) => {
                    process.stdout.write(d);
                });
                process.stdout.write("\n");
            });
            req.on('error', (error) => {
                console.error(error);
            })
            .end();
        }
    }, 1500);

    setTimeout(async () => {
        const itemPayload = JSON.stringify({
            "title":"Globo Terraqueo",
            "price":"345.67",
            "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"
        });
        const options = {
            hostname: url,
            port: puerto,
            path: '/productos/agregar/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': itemPayload.length,
            },
        }
        const req = http.request(options, (res) => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            process.stdout.write("\n");
        });
        req.on('error', (error) => {
            console.error(error);
        })
        .write(itemPayload);
    }, 2000);

    setTimeout(async () => {
        const options = {
            hostname: url,
            port: puerto,
            path: '/productos/listar/',
            method: 'GET'
        }
        const req = http.request(options, (res) => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            process.stdout.write("\n");
        });
        req.on('error', (error) => {
            console.error(error);
        })
        .end();
    }, 3000);
}

export default serverChecker;