import Router from "express";
import productsRouter from "./productosRoutes.js";
import cartRouter from "./carritosRoutes.js";

const router = Router();

router.use(["/products", "/productos"], productsRouter);
router.use(["/cart", "/carrito"], cartRouter);

export default router;
