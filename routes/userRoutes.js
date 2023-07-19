import express from "express";



import { loginController,registerController,authController,applyDoctorController,getallNotificationController,deleteAllNotificationController ,getAllDoctorController,bookAppointmentController,bookingAvailbilityController,userAppointmentsController} from '../controllers/userctrl.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post('/login', loginController);

router.post('/register', registerController);

router.post('/getUserData',auth,authController);


router.post('/apply-doctor',auth,applyDoctorController);


router.post('/get-all-notification',auth,getallNotificationController);

router.post('/delete-all-notification',auth,deleteAllNotificationController);


router.get('/getAllDoctor' ,  auth ,  getAllDoctorController);


router.post('/book-appointment' ,  auth ,  bookAppointmentController);


router.post('/booking-availbility' ,  auth ,  bookingAvailbilityController);


router.get('/user-appointments' ,  auth ,  userAppointmentsController);


export default router;
