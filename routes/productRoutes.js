const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productVariantController = require('../controllers/productVariantController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

router.use('/:productId/reviews', reviewRouter);

router
  .route('/:productId/variants')
  .get(productVariantController.getAllProductVariant)
  .post(productVariantController.createProductVariant);

module.exports = router;
