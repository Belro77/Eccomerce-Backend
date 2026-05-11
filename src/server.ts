import express from "express";
import mongoose, { Schema } from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

import { Product } from "./models/product.model";

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());


// ✅ Esquema carrito
const cartItemSchema = new Schema({
  userId: { type: String, required: true },
  name: String,
  category: String,
  color: String,
  quantity: Number,
  price: Number,
  imageUrl: String,
});

const CartItem = mongoose.model("CartItem", cartItemSchema);


mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");

    console.log("📦 DB:", mongoose.connection.db?.databaseName);

    console.log("📂 Collections:");
    mongoose.connection.db
      ?.listCollections()
      .toArray()
      .then((cols) => console.log(cols));
  })

// ✅ Ruta principal
app.get("/", (_, res) => {
  res.send("🚀 API funcionando");
});


//✅ Productos
app.get("/api/products", async (_, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener productos",
    });
  }
});



// ✅ Agregar carrito
app.post("/cart", async (req, res) => {
  try {
    const item = new CartItem(req.body);

    await item.save();

    res.status(201).json(item);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Error al agregar producto",
    });
  }
});


// ✅ Eliminar carrito
app.delete("/cart/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Error al eliminar producto",
    });
  }
});


// ✅ Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});