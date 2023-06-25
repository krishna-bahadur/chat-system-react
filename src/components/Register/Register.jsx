import React from 'react';
import chatphoneimg from '../../assets/undraw_personalization_re_grty.svg';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import './Register.css'
import '../Login/Login.css';
import logo from '../../assets/chathub.png';
import {FaUserAlt} from 'react-icons/fa'
import {FaLock} from 'react-icons/fa'
import {MdEmail} from 'react-icons/md'
import {BsTelephoneFill} from 'react-icons/bs'
import {FaRegUserCircle} from 'react-icons/fa'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Register = () => {
        const initialValues ={
            fullname:'',
            email:'',
            phone:'',
            username:'',
            password:'',
        };

        const validateRegisterForm = (values) =>{
            const errors = {};

            if(!values.fullname){
                errors.fullname ='Please enter name.'
            }
            if(!values.email){
                errors.email='Please enter email.'
            }
            else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if(!values.phone){
                errors.phone="Please enter phone no."
            }
            else if(values.phone.length !== 10)
            {
                errors.phone="Phone no must be 10 digit."
            }
            if(!values.username){
                errors.username='Please enter username'
            }
            if(!values.password){
                errors.password='Please enter password'
            }
            else if(!values.password.length < 5){
                errors.password="Password must be atleast 5 character long"
            }
            return errors;
        };
        const ProceedRegister = (values) => {
            console.log(values);
        }

    
  return (
      <section className="login__page">
          <ToastContainer />
          <div className="row">
              <div className="col-md-7 login__image">
                  <img src={chatphoneimg} alt="chat_image" />
              </div>
              <div className="col-md-5 login__form__wrapper">
                  <Formik initialValues={initialValues} validate={validateRegisterForm} onSubmit={ProceedRegister}>
                      <Form className="login__form register__form">
                          <div className="logo__container mb-2">
                              <img src={logo} alt="" />
                          </div>
                          <div className="form-floating my-2">
                              <Field type="text" className="form-control" id="floatingFullName" placeholder='Full Name' name="fullname" />
                              <label htmlFor='fullname'>Full Name</label>
                              <i><FaRegUserCircle /></i>
                              <ErrorMessage  name='fullname' component="div" className='text-danger'/>
                          </div>
                          <div className="form-floating my-2">
                              <Field type="text" className="form-control" id="floatingEmail" placeholder='Email' name="email"/>
                              <label htmlFor='email'>Email</label>
                              <i><MdEmail /></i>
                              <ErrorMessage  name='email' component="div" className='text-danger'/>
                          </div>
                          <div className="form-floating my-2">
                              <Field type="text" className="form-control" id="floatingPhone" placeholder='Phone' name="phone" />
                              <label htmlFor='phone'>Phone</label>
                              <i><BsTelephoneFill /></i>
                              <ErrorMessage  name='phone' component="div" className='text-danger' />
                          </div>
                          <div className="form-floating my-2">
                              <Field className="form-control" id="floatingUsername" placeholder='Username'  name="username"/>
                              <label htmlFor='username'>Username</label>
                              <i><FaUserAlt /></i>
                              <ErrorMessage  name='username' component="div" className='text-danger'/>
                          </div>
                          <div className="form-floating my-2">
                              <Field type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password"/>
                              <label htmlFor='password'>Password</label>
                              <i><FaLock /></i>
                              <ErrorMessage  name='password' component="div" className='text-danger'/>
                          </div>
                          <div className="form__submit__btn my-4">
                              <input type="submit" className="submit__btn" value="REGISTER" />
                          </div>
                          <div className="create__new__account my-3">
                              <a href='/login' className="create__btn" >Already Have Account?</a>
                          </div>
                      </Form>
                  </Formik>
              </div>
          </div>
      </section>

  )
}

export default Register