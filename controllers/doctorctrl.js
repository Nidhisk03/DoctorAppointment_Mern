import doctorModel from "../models/doctorModel.js"

import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";


export const getDoctorInfoController = async (req, res) => {

    try {

        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'Doctor Data fetch Success',
            data: doctor,
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error is fetching doctor details",
            success: false,
            error,
        });

    }
}


export const updateProfileController = async (req, res) => {

    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);


        res.status(201).send({
            success: true,
            message: "Doctor Profile Updated",
            data: doctor,
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in updating Profile",
            success: false,
            error,
        });

    }

}





export const getDoctorByIdController = async (req, res) => {
    try {
      const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
      res.status(200).send({
        success: true,
        message: "Sigle Doc Info Fetched",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Erro in Single docot info",
      });
    }
  };



  export 
  const doctorAppointmentsController = async (req, res) => {
    try {
      const doctor = await doctorModel.findOne({ userId: req.body.userId });
      const appointments = await appointmentModel.find({
        doctorId: doctor._id,
      });
      res.status(200).send({
        success: true,
        message: "Doctor Appointments fetch Successfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Doc Appointments",
      });
    }
  };
  
  export const updateStatusController = async (req, res) => {
    try {
      const { appointmentsId, status } = req.body;
      const appointments = await appointmentModel.findByIdAndUpdate(
        appointmentsId,
        { status }
      );
      const user = await userModel.findOne({ _id: appointments.userId });
      const notifcation = user.notifcation;
      notifcation.push({
        type: "status-updated",
        message: `your appointment has been updated ${status}`,
        onCLickPath: "/doctor-appointments",
      });
      await user.save();
      res.status(200).send({
        success: true,
        message: "Appointment Status Updated",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error In Update Status",
      });
    }
  };
  