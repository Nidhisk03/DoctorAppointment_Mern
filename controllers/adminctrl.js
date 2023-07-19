import doctorModel from "../models/doctorModel.js"
import userModel from "../models/userModel.js";

export const getAllUsersController = async (req, res) => {
  try {

    const users = await userModel.find({})
    res.status(200).send({
      success: true,
      message: "Users Data",
      data: users
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

export const getAllDoctorsController = async (req, res) => {

  try {

    const doctors = await doctorModel.find({})
    res.status(200).send({
      success: true,
      message: "Doctors Data",
      data: doctors
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Doctors error",
      success: false,
      error,
    });
  }


};


export const changeAccountStatusController = async (req, res) => {
  try {
              const {doctorId , status} = req.body;

              const doctor = await doctorModel.findByIdAndUpdate(doctorId,{status});

              const user = await userModel.findOne({_id:doctor.userId});

              const notifcation = user.notifcation;

              notifcation.push({
                type : 'doctor-account-request-updated',
                message : `Your Doctor Request has ${status} `,
                onClickPath : '/notification',
              })

              user.isDoctor = status === 'approved' ? true : false ;
               
              await user.save()

              res.status(201).send({
                success:true,
                message : 'Account Status Updated',
                data:doctor,
              });
        

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Account error",
      success: false,
      error,
    });
  }

};

export const updateProfileController = async (req, res) => {

  try {
      const doctor = await userModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
      res.status(201).send({
          success: true,
          message: "User Profile Updated",
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




