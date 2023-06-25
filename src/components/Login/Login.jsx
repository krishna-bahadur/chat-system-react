import React, { useState } from 'react';
import './Login.css';
import chatphoneimg from '../../assets/undraw_personalization_re_grty.svg';
import avatar from '../../assets/undraw_pic_profile_re_7g2h.svg';
import logo from '../../assets/chathub.png';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.css'
import { FaUserAlt } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validateLoginForm = Yup.object().shape({
    username: Yup.string()
      .required('Please enter password.'),
    password: Yup.string()
      .required('Please enter password.'),
  });


const Login = () => {
    const [error, setError] = useState('');

    const ProceedLogin = async (values) => {
            const { username, password } = values;
            try{
                const response = await  fetch("https://localhost:7183/api/Authenticate/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                if (response.status === 401) {
                    debugger;
                    setError("Invalid username or password.");
                    // return response.json();
                }
                if(response.ok){
                    const result = await response.json();
                    if (result && result.token) {
                        localStorage.setItem("token", result.token);
                        window.location.href = "/";
                    } else {
                        setError("Invalid username or password.");
                    }
                }
            }
            catch (error) {
                console.log("Server Error: Something went wrong....");
              }
            }

    return (
        <section className="login__page">
            <ToastContainer />
            <div className="row">
                <div className="col-md-7 login__image">
                    <img src={chatphoneimg} alt="chat_image" />
                </div>
                <div className="col-md-5 login__form__wrapper">
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        validationSchema={validateLoginForm}
                        onSubmit={values => {
                            ProceedLogin(values);
                          }}
                    >
                        {({errors, touched, }) => (
                            <Form  className="login__form">
                            <img src={avatar} alt="login_avatar" />
                            <div className="logo__container mt-4 mb-3">
                                <img src={logo} alt="" />
                            </div>
                            {error && <div className="text-danger">{error}</div>}
                            <div className="form-floating my-2">
                                <Field 
                                name="username" 
                                type="text" 
                                className="form-control" 
                                id="floatingInput" 
                                placeholder="name@example.com" 
                                />
                                <label>username</label>
                                <i><FaUserAlt /></i>
                                {errors.username && touched.username && <div className='text-danger text-start'>{errors.username}</div>}
                            </div>
                            <div className="form-floating my-2">
                                <Field 
                                name="password"
                                type="password" 
                                className="form-control" 
                                id="floatingPassword" 
                                placeholder="Password" />
                                <label>Password</label>
                                <i><FaLock /></i>
                                {errors.password && touched.password && <div className='text-danger text-start'>{errors.password}</div>}
                            </div>
                            <div className="forget__password my-2">
                                <a href="">Forgot Password?</a>
                            </div>
                            <div className="form__submit__btn my-3">
                                <input type="submit" className="submit__btn" value="LOGIN" />
                            </div>
                        </Form>
                        )}
                        
                    </Formik>
                </div>
            </div>
        </section>
    )
}

export default Login