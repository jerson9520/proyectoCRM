// models/Opportunity.js
import mongoose, { Schema } from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['in progress', 'closed', 'lost'],
    default: 'in progress'
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunity: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

export const OpportunityModel = mongoose.model('Opportunity', opportunitySchema);
