import { Router } from "express";
import { verifyToken } from "../utils/index.js";
import passport from 'passport';
import User from "../models/users.model.js";


const router = Router();
router.get("/", (req, res) => {
  res.redirect("/home")
});

router.get("/register", (req, res) => {
  res.render("register", { title: "REGISTER" });
});
router.get("/login", (req, res) => {
  res.render("login", { title: "LOGIN" });
});

router.get("/home", (req, res) => {
  res.render("home", { title: "Bienvenido" });
});


router.get("/current", async (req, res) => {
  // Extraer el token de la cookie
  const token = req.signedCookies.token; // 🔹 No uses signedCookies si no firmaste la cookie

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verificar el token
  const userToken = verifyToken(token);
  if (!userToken) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Asignar el payload del token a req.user
  req.user = userToken;


  try {
    // Buscar al usuario en la BD
    const user = await User.findById(req.user.id).lean(); // 🔹 Aquí estaba el problema

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Usuario encontrado en la BD======", user);

    // Renderizar la vista con la información del usuario
    res.render("current", { title: "CURRENT", user });
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
