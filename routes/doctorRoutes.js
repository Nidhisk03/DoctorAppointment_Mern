import express from "express";

const router = express.Router();
import auth from "../middlewares/auth.js";
import {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController} from '../controllers/doctorctrl.js';

router.post('/getDoctorInfo' , auth , getDoctorInfoController);


router.post('/updateProfile' , auth , updateProfileController);


router.post('/getDoctorById' , auth , getDoctorByIdController);


router.get('/doctor-appointments' , auth , doctorAppointmentsController);


router.post('/update-status' , auth , updateStatusController);









export default router;

