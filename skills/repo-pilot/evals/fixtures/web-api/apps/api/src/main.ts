import express from "express";
import { listOrders } from "./service";
const app = express();
app.get("/orders", (_req, res) => res.json(listOrders()));
app.listen(4000);
