import express from 'express';
import User  from "../models/users.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import { JWT_SECRET } from "../utils/index.js"

dotenv.config();

const router = express.Router();
// const JWT_SECRET = "4jdksh7s8dj38s8sdhjsdf9h238sdhjkh8234";

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error al registrar usuario');
    }
});

// Login con JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isMatch = await user.comparePassword(password);

        if (!user || !isMatch) {
          console.log("❌ Credenciales incorrectas");
          return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        
        res.cookie("token", token, { httpOnly: true, signed: true });
        res.redirect("/current");
        
    } catch (error) {
        res.status(500).send("Error en el login");
    }
});

// Logout (eliminar cookie)
router.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

export default router;
