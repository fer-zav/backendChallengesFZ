const admin = true;

export const checkAdmin = (req, res, next) => {
    console.log("Checkeando acceso...");
    admin ? next() : res.status(401).json({
        msg: "Error: Acceso denegado"
    });
};
