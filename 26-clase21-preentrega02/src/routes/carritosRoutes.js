import Router from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json("GET A CART");
});

router.post("/", (req, res) => {
    res.json("POST A CART");
});

router.put("/", (req, res) => {
    res.json("PUT A CART");
});

router.delete("/", (req, res) => {
    res.json("DELETE A CART");
});
/*
router.get("/:id?",                 cartController.checkProductExists,  asyncHandler(cartController.getProducts));
router.post("/",        checkAdmin, cartController.checkAddProducts,    asyncHandler(cartController.addProducts));
router.put("/:id",      checkAdmin, cartController.checkProductExists,  asyncHandler(cartController.updateProducts));
router.delete("/:id",   checkAdmin, cartController.checkProductExists,  asyncHandler(cartController.deleteProducts));
*/

export default router;
