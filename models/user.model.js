const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 6
    },
    text: {
        type: String,
        required: true,
        minLength: 6
    },
    author: {
        type: String,
        required: true
    }
}, {
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
        }
    }
});

module.exports = mongoose.model('User', UserSchema);