import Router from "express";
import {productsController} from "../controllers/productosController.js";
import {checkAdmin} from "../middleware/admin.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/:id?",                 productsController.checkProductExists,  asyncHandler(productsController.getProducts));
router.post("/",        checkAdmin, productsController.checkAddProducts,    asyncHandler(productsController.addProducts));
router.put("/:id",      checkAdmin, productsController.checkProductExists,  asyncHandler(productsController.updateProducts));
router.delete("/:id",   checkAdmin, productsController.checkProductExists,  asyncHandler(productsController.deleteProducts));

export default router;
