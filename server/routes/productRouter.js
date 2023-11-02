import express from 'express';

import { getProduct,createProduct,updateProduct,deleteProduct,getProductById } from '../controllers/productController.js';
import { protectData } from '../controllers/userControl.js';

const Router=express.Router();


Router.route('/').get(protectData,getProduct).post(protectData,createProduct);
Router.route('/:id').get(getProductById).patch(protectData,updateProduct)
.delete(protectData,deleteProduct)


export default Router;