const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  variant: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductVariant',
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
});

cartItemSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'variant',
    // select: 'name price',
  });
  next();
});

cartItemSchema.index({ variant: 1, user: 1 }, { unique: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
