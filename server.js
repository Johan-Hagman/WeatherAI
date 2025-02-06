import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("AI Chatbot API is running!");
});
app.use("/api", chatRoutes);

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
