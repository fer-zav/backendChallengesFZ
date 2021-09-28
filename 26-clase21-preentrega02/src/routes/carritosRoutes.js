import Router from "express";
import {cartController} from "../controllers/cartsController.js";
import {checkAdmin} from "../middleware/admin.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/:id?",     checkAdmin, cartController.checkCartExists,     asyncHandler(cartController.getCarts));
router.post("/:id",     checkAdmin, /*cartController.checkAddCarts,*/    asyncHandler(cartController.addCarts));
// router.put("/:id",      checkAdmin, cartController.checkCartExists,  asyncHandler(cartController.updateCarts)); // not implemented, since it's NOT used in cart class;
router.delete("/:id",   checkAdmin, cartController.checkCartExists,     asyncHandler(cartController.deleteCarts));

export default router;
