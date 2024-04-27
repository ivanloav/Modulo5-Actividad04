const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    /*     verified: {
      type: Boolean,
      default: false,
    }, */
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    bio: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        // Guarda el id en una variable temporal
        const id = doc._id;
        // Elimina _id y __v
        delete ret._id;
        delete ret.__v;
        // Agrega id al inicio del objeto
        ret = { id, ...ret };

        return ret;
      },
    },
  }
);

module.exports = mongoose.model("User", UserSchema);
