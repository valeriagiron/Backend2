import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: "Carts" },
  role: { type: String, default: "user" },
});

// Middleware para encriptar la contraseña antes de guardar el usuario
UserSchema.pre("save", async function (next) {
  console.log("⚡ Middleware pre-save ejecutado. Cifrando contraseña...");

  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("🔐 Contraseña cifrada antes de guardar:", this.password);

    next();
  } catch (error) {
    next(error);
  }
});


UserSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

export default model("User", UserSchema);