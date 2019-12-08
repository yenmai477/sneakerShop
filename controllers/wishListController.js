const WishList = require('../models/WishlistItemModel');
const factory = require('./handlerFactory');

exports.createWishlistItem = factory.createOne(WishList, 'product');
exports.deleteWishlistItem = factory.deleteOne(WishList);
exports.getAllWishlistItem = factory.getAll(WishList);
