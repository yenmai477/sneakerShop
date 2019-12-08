const mongoose = require('mongoose');

const wishListItemSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
});

wishListItemSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'product',
    // select: 'name price',
  });
  next();
});

wishListItemSchema.index({ product: 1, user: 1 }, { unique: true });

const WishListItem = mongoose.model('WishListItem', wishListItemSchema);

module.exports = WishListItem;
