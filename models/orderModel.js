const mongoose = require('mongoose');
const CartItem = require('../models/CartItemModel');
const ProductVariant = require('../models/productVariantModel');
const AppError = require('../utils/appError');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide us with the consignee's name"],
  },
  address: {
    type: String,
    required: [true, "Please provide us with the consignee's address"],
  },
  phone: {
    type: String,
    required: [true, "Please provide us with the consignee's phone"],
  },
  note: {
    type: String,
  },
  variants: [
    {
      variant: {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductVariant',
        required: [true, 'Order must belong to a product!'],
      },
      quantity: {
        type: Number,
        required: [true, 'Please tell us quantity of product'],
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a User!'],
  },
  price: {
    type: Number,
    require: [true, 'Order must have a price.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

orderSchema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name photo' }).populate({
    path: 'variants.variant',
    // select: 'name',
  });
  next();
});

orderSchema.statics.clearCartItem = async function(userId) {
  await CartItem.deleteMany({ user: userId });
};

orderSchema.statics.updateQuantityProduct = async function(
  variantId,
  orderQuantity
) {
  const variant = await ProductVariant.findById(variantId);
  variant.quantity -= orderQuantity;
  await variant.save();
};

orderSchema.post('save', function(doc) {
  this.constructor.clearCartItem(this.user);
  doc.variants.forEach(item => {
    this.constructor.updateQuantityProduct(item.variant, item.quantity);
  });
});

orderSchema.pre('save', async function(next) {
  const map = {};
  this.variants.forEach(item => {
    map[item.variant] = item.quantity;
  });
  const variantIds = Object.keys(map);
  const variants = await ProductVariant.find({ _id: { $in: variantIds } });

  variants.forEach(item => {
    if (map[item._id.toString()] > item.quantity) {
      const error = new AppError(
        `${item.product.name}(Size ${item.size} - ${item.color}) only have ${item.quantity} products in stock`,
        400
      );
      next(error);
    }
  });

  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
