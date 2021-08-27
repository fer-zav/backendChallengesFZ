//no se puede ser user y admin a la vez!!!
const check = "user";
// const check = "admin";

export const unAuthPayload = (route, method) => {
    return {
        error: -1,
        descripcion: `Ruta ${route} y metodo ${method} no autorizado`,
    }
}

export const authCheck = (req, res, next) => {
    if (check){
        if (check === "user"){
            req.authUser = true;
            next();
        }else if(check === "admin"){
            req.authAdmin = true;
            next();
        }
    }
    next();
}
