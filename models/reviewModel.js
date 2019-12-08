// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Product = require('./productModel');
const Order = require('./orderModel');
const ProductVariant = require('./productVariantModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    bought: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'product',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.statics.analysisReview = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$rating',
        nRating: { $sum: 1 },
      },
    },
  ]);
  // console.log(productId);

  const result = {};
  for (let index = 5; index > 0; index -= 1) {
    result[index] = { nRating: 0, percentage: 0 };
  }

  const totalRating = stats.reduce((pre, curr) => {
    return pre + curr.nRating;
  }, 0);

  if (totalRating === 0) {
    return result;
  }

  stats.forEach(item => {
    result[item._id] = {
      nRating: item.nRating,
      percentage: Math.round((item.nRating / totalRating) * 10) / 10,
    };
  });
  // console.log(stats);

  return result;
};

reviewSchema.pre('save', async function(next) {
  let variants = await ProductVariant.find({
    product: this.product,
  }).select('-product id');
  variants = variants.map(item => item._id.toString());
  const orders = await Order.find({
    user: this.user,
    'variants.variant': { $in: variants },
  });

  if (orders.length > 0) {
    this.bought = true;
  }

  next();
});

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.product);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
