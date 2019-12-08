const ProductVariant = require('./../models/productVariantModel');
const catchAsync = require('./../utils/catchAsync');
//const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllProductVariant = factory.getAll(ProductVariant);
exports.getProductVariant = factory.getOne(ProductVariant);
exports.createProductVariant = factory.createOne(ProductVariant);
exports.updateProductVariant = factory.updateOne(ProductVariant);
exports.deleteProductVariant = factory.deleteOne(ProductVariant);
