import { Router, Request, Response } from "express";
import { Product } from "../models/product.model";

const router = Router();

// Obtener todos los productos
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

/* Agregar un nuevo producto
router.post("/", async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto" });
  }
});*/

export default router;
