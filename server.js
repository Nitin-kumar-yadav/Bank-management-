import app from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
    connectDB()
})

app.get("/health", (req, res) => {
    res.send("OK");
})