const CartItem = require('../models/CartItemModel');
const factory = require('./handlerFactory');

exports.createCartItem = factory.createOne(CartItem, 'variant');
exports.deleteCartItem = factory.deleteOne(CartItem);
exports.updateCartItem = factory.updateOne(CartItem);
exports.getAllCartItem = factory.getAll(CartItem);
