import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import passport from "./config/passport.js";
// import authRoutes from "./routes/users.routes.js";
import MongoStore from "connect-mongo";

import connectDb from "./database/index.js";
import userRoutes from './routes/users.routes.js';
import viewRoutes from './routes/views.routes.js';

//settings
const app = express();
app.set("PORT", 3000);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const FIRMA = "firma-cookie";
const URI = "mongodb+srv://1234:1234@cluster0.zk1bi.mongodb.net/";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(FIRMA));

//routes
app.use('/api/users',userRoutes)
app.use('/', viewRoutes)

// Inicializar Passport
app.use(passport.initialize());


//listeners
connectDb(URI);

app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
