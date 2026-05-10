import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import { Product } from "./models/product.model";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Interfaz para los items del carrito
interface ICartItem extends Document {
  userId: string;
  name: string;
  category: string;
  color: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

// ✅ Esquema y modelo de Mongoose
const cartItemSchema = new Schema<ICartItem>({
  userId: { type: String, required: true },
  name: String,
  category: String,
  color: String,
  quantity: Number,
  price: Number,
  imageUrl: String,
});

const CartItem = mongoose.model<ICartItem>(
  "CartItem",
  cartItemSchema
);

// ✅ Conexión MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) =>
    console.error("❌ Error al conectar con MongoDB:", err)
  );

// ✅ Endpoint raíz
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 API de tienda zodiacal funcionando");
});

// ✅ Obtener productos
app.get("/api/products", async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({
      message: "Error al obtener productos",
    });
  }
});

// ✅ Agregar producto al carrito
app.post("/cart", async (req: Request, res: Response) => {
  try {
    const item = new CartItem(req.body);

    await item.save();

    res.status(201).json(item);
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);

    res.status(400).json({
      message: "Error al agregar producto",
    });
  }
});

// ✅ Eliminar producto del carrito
app.delete("/cart/:id", async (req: Request, res: Response) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);

    res.status(400).json({
      message: "Error al eliminar producto",
    });
  }
});

// ✅ Puerto Render
const PORT = process.env.PORT || 3000;

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});