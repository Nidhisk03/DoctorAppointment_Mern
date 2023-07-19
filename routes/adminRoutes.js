import express from "express";

const router = express.Router();
import auth from "../middlewares/auth.js";
import {getAllDoctorsController,updateProfileController,getAllUsersController,changeAccountStatusController} from '../controllers/adminctrl.js';


router.get('/getAllUsers' , auth , getAllUsersController );


router.get('/getAllDoctors' , auth ,  getAllDoctorsController);

router.post('/chnageAccountStatus' , auth , changeAccountStatusController);

router.post('/updateProfile' , auth , updateProfileController);

export default router;
