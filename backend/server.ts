import express from "express";
import { checkDbConnection } from "./database/db.js";
import dotenv from "dotenv";
import companyRouter from "./route/company.route.js";
import cors from "cors"

dotenv.config();

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.listen(PORT, () => {
  checkDbConnection();
  console.log(`Listening to http://localhost:${PORT}`);
});

// Test route to check if the server is running.
// Uncomment the lines below and visit http://localhost:<PORT>/hello
// to verify the server responds correctly.
//
// app.get("/hello", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/", companyRouter);
