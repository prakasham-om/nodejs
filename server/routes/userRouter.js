import express from 'express'
import { registerUser,loginUser,forgetPassword } from '../controllers/userControl.js';

let Router=express.Router();

Router.route('/').post(registerUser)
Router.route('/login').post(loginUser)
Router.route('/forgetpassword').post(forgetPassword)

export default Router