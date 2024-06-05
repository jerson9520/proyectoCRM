import mongoose, { Schema } from 'mongoose';

// Definición del esquema para el cliente
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true // Elimina espacios en blanco al inicio y final del string
  },
  address: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Asegura que el email sea único
    trim: true,
    lowercase: true, // Convierte el email a minúsculas
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Validación del formato de email
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Please fill a valid phone number'] // Validación del formato de número telefónico
  },

  user: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true
  }

}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

export const ClientModel = mongoose.model('Client', clientSchema);
