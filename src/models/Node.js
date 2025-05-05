import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    default: null
  },
  title: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Virtual para hijos (ordenados)
nodeSchema.virtual('children', {
  ref: 'Node',
  localField: '_id',
  foreignField: 'parent',
  options: { sort: { id: 1 } } // Ordenar hijos por ID
});

// Middleware para validar eliminación
nodeSchema.pre('remove', async function(next) {
  const hasChildren = await this.model('Node').exists({ parent: this._id });
  if (hasChildren) {
    throw new Error('No se puede eliminar un nodo con hijos');
  }
  next();
});

export default mongoose.model('Node', nodeSchema);