import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import { Product } from "./models/product.model";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Interfaz (tipado para los items del carrito)
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

const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema);

// ✅ Conexión a MongoDB Atlas
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://<usuario>:<clave>@<cluster>.mongodb.net/tienda-ropa"
  )
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

// ✅ Obtener carrito por usuario

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});
// ✅ Agregar producto al carrito
app.post("/cart", async (req: Request, res: Response) => {
  try {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(400).json({ message: "Error al agregar producto" });
  }
});

// ✅ Eliminar producto por ID
app.delete("/cart/:id", async (req: Request, res: Response) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(400).json({ message: "Error al eliminar producto" });
  }
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
app.get("/", (_, res) => {
  res.send("🚀 API de tienda zodiacal funcionando");
}); 