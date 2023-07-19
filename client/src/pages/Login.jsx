import React from 'react'
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import "../styles/Registerstyles.css";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import doctor from "../images/doctor.png"

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();



	const OnfinishHandler = async (values) => {

		try {
			dispatch(showLoading());


			const res = await axios.post('/api/v1/user/login', values);
			window.location.reload();
			dispatch(hideLoading());

			if (res.data.success) {
				localStorage.setItem("token", res.data.token);
				message.success("Login Successsfully");
				navigate('/');
			} else {
				message.error(res.data.message);
			}


		} catch (error) {
			dispatch(hideLoading());
			console.log(error);
			message.error('Something went wrong');

		}
	}


	return (

		<div className="signup_container">
			<div className="signup_form_container">


				<div className="right">


					<Form
						layout="vertical"
						onFinish={OnfinishHandler}
						className="form_container"
					>

						<h1>Login to Your Account</h1>


						<Form.Item label="Email" name="email">
							<Input type="email" className="input" required />
						</Form.Item>

						<Form.Item label="Password" name="password">
							<Input type="password" className="input" required />
						</Form.Item>

						

						<button className="green_btn" type="submit">
							Login
						</button>

						<Link to="/register" className="black">
							Not a user Register here
						</Link>

					</Form>
				</div>
				<div className="left">
				<img src={doctor} className='img' alt="Logo" />
				</div>



			</div>
		</div>

	);
}

export default Login;
