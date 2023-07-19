
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from '../models/appointmentModel.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

//register callback
export const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
export const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, 'secret', {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

export const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};


export const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" })
    await newDoctor.save()

    const adminUser = await userModel.findOne({ isAdmin: true });

    const notifcation = adminUser.notifcation
    notifcation.push({
      type: 'apply-doctor-request',
      message: `${newDoctor.firstName}   ${newDoctor.lastName} has applied for a doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: '/admin/doctors'


      }

    })

    await userModel.findByIdAndUpdate(adminUser._id, { notifcation })
    res.status(201).send({
      success: true,
      message: " Dcotor Account Aplied Successully"

    })





  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Apply error",
      success: false,
      error,
    });
  }


};




export const getallNotificationController = async (req, res) => {

  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    const seennotification = user.seennotification;

    const notifcation = user.notifcation;

    seennotification.push(...notifcation);

    user.notifcation = [];

    user.seennotification = notifcation;

    const updateUser = await user.save();

    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updateUser,


    })




  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "notification error",
      success: false,
      error,
    });
  }

};


export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    user.notifcation = [];
    user.seennotification = [];

    const updateuser = await user.save();
    updateuser.password = undefined;

    res.status(200).send({
      success: true,
      message: "All notification are deleted",
      data: updateuser,


    })



  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "notification error",
      success: false,
      error,
    });
  }


};




export const getAllDoctorController = async (req, res) => {
  try {

    const doctors = await doctorModel.find({ status: 'approved' })

    res.status(200).send({
      success: true,
      message: 'Doctors list fetched Successfully',
      data: doctors,
    })




  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "All Doctor Error",
      success: false,
      error,
    });
  }


};


export const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time, 'HH:mm').toISOString();



    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notifcation.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Book Appointment error",
      success: false,
      error,
    });
  }


};



export const bookingAvailbilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Book Appointment error",
      success: false,
      error,
    });
  }


};


export const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: 'Users Appointment fetch Succesfully',
      data:appointments,
    });


  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Appointment error",
      success: false,
      error,
    });
  }


};










