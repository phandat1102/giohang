import express from 'express';
const router = express.Router();
import { handleRegister, handleLogin, handleLogout } from '../controller/userController';
import { handleGetLoginPage, 
    handleGetRegisterPage, 
    handletGetHomePage, handleGetProductDetailPage } from '../controller/homeController';
import { handleGetAdminHomePage } from '../controller/adminController';
import { handleGetAdminAddCategoryPage, 
    handleCreateANewCategory, 
    handleGetCategoriesPerPage, 
    handleGetAdminEditCategoryPage,
    handleEditACategory } from '../controller/adminCategoryController';
import { handleGetAdminAddProductPage,
    handleCreateANewProduct,
    handleGetAdminListProductPage,
    handleGetAdminEditProductPage,
    handleEditAProduct } from '../controller/adminProductController';
import cartController from '../controller/cartController';
import { handleGetAdminListBillPage } from '../controller/adminBillController';

// Route for register page
router.get('/register', handleGetRegisterPage);
router.post('/register', handleRegister);
router.get('/login', handleGetLoginPage);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.get('/product-detail/:id', handleGetProductDetailPage);

// admin 

// category
router.get('/admin/list-categories', handleGetCategoriesPerPage);
router.get('/admin/add-category', handleGetAdminAddCategoryPage);
router.post('/admin/add-category', handleCreateANewCategory);
router.get('/admin/edit-category/:id', handleGetAdminEditCategoryPage);
router.post('/admin/edit-category', handleEditACategory);

// product
router.get('/admin/list-products', handleGetAdminListProductPage);
router.get('/admin/add-product', handleGetAdminAddProductPage);
router.post('/admin/add-product', handleCreateANewProduct);
router.get('/admin/edit-product/:id', handleGetAdminEditProductPage);
router.post('/admin/edit-product', handleEditAProduct);

// cart
router.get('/add-item/:id', cartController.addItemToCart);
router.get('/remove-item/:id', cartController.removeItemFromCart);
router.get('/increase-item/:id', cartController.increaseItemQuantity);
router.get('/decrease-item/:id', cartController.decreaseItemQuantity);
router.get('/cart-detail', cartController.handleGetCartPage);
router.get('/confirm-order', cartController.handleGetConfirmPage);
router.post('/place-order', cartController.handlePlaceOrder);

// bill
router.get('/admin/list-bills', handleGetAdminListBillPage);

router.get('/admin', handleGetAdminHomePage);
router.get('/', handletGetHomePage);

export default router; 
