const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const wishlistController = require('../controllers/wishListController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.get('/me', userController.getMe, userController.getUser);
router
  .route('/cart')
  .get(userController.getMe, cartController.getAllCartItem)
  .post(userController.getMe, cartController.createCartItem);

router
  .route('/cart/:id')
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

router
  .route('/wishlist')
  .get(userController.getMe, wishlistController.getAllWishlistItem)
  .post(userController.getMe, wishlistController.createWishlistItem);

router.delete('/wishlist/:id', wishlistController.deleteWishlistItem);

router
  .route('/order')
  .get(userController.getMe, orderController.getAllOrder)
  .post(userController.getMe, orderController.createOrder);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
