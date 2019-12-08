const mongoose = require('mongoose');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review, {
  path: 'user',
  select: 'name photo',
});
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.checkUserDelete = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  const review = await Review.findById(req.params.id);

  if (!review || review.user._id.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You don't have permission to delete this review!", 403)
    );
  }

  next();
});
exports.analysisReview = catchAsync(async (req, res, next) => {
  const productId = mongoose.Types.ObjectId(req.params.productId);
  const doc = await Review.analysisReview(productId);

  res.status(200).json({
    status: 'success',
    length: doc.length,
    data: {
      data: doc,
    },
  });
});
