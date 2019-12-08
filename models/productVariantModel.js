const mongoose = require('mongoose');

const productVariantSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  size: {
    type: Number,
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
    min: [0, 'Quantity must be quantity must be greater than or equal to 0'],
  },
});

productVariantSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'product',
    select: 'name price imageCover',
  });
  next();
});

// TODO: 10/25/19 Create index to prevent duplicate variants
productVariantSchema.index({ product: 1, color: 1, size: 1 }, { unique: true });

const productVariant = mongoose.model('ProductVariant', productVariantSchema);

module.exports = productVariant;
