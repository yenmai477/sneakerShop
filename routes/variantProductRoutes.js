const express = require('express');
const authController = require('../controllers/authController');
const productVariantController = require('../controllers/productVariantController');

const router = express.Router();

router
  .route('/')
  .get(productVariantController.getAllProductVariant)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productVariantController.createProductVariant
  );

router
  .route('/:id')
  .get(productVariantController.getProductVariant)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productVariantController.updateProductVariant
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productVariantController.deleteProductVariant
  );

module.exports = router;
