import "../styles/doctorcard.css";
import React from "react";
import { useNavigate } from 'react-router-dom';
const DoctorCard = ({ doctor }) => {
const navigate = useNavigate();

    return (
        <div className={`card`}  >
           

            <h2 className="card-name ">
                Dr. {doctor.firstName + " " + doctor.lastName}
            </h2>
            <p className="specialization">
                <strong>Specialization: </strong>
                {doctor.specialization}
            </p>
            <p className="experience padding">
                <strong>Experience: </strong>
                {doctor.experience}yrs
            </p>
            <p className="fees">
                <strong>Fees per consultation: </strong>$ {doctor.fee}
            </p>
            <p className="phone">
                <strong>Phone: </strong>
                {doctor.phone}
            </p>


            <button
        className="btn appointment-btn"
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        Book Appointment
      </button>


        </div>

    );
};

export default DoctorCard;
