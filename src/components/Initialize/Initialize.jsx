import React, { useEffect, useState } from 'react'
import './Initialize.css'
import chatImage from '../../assets/undraw_work_chat_re_qes4.svg'
import { Formik, Form, Field } from 'formik';
import { Modal } from 'react-bootstrap';
import BASE_URL from '../apiConfig';
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'

const Initialize = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async function () {
      const response = await fetch(`${BASE_URL}/Initialize/CheckInitialize`);
      const data = await response.json();
      console.log(data);
      if (!data) {
        navigate('/login');

      } 
    })();
  }, [])
  const [handleCreateSystemAdminModel, setCreateSystemAdminModel] = useState(false);
  const hideCreateSystemAdminModel = () => {

    setCreateSystemAdminModel(false);
  };

  const showCreateSystemAdminModel = () => {
    setCreateSystemAdminModel(true);
  };


  const checkForm = (values, setFieldError) => {
    let result = true;

    if (!values.OrganizationName) {
      setFieldError('OrganizationName', 'Please enter organization name.');
      result = false;
    }
    if (!values.Location) {
      setFieldError('Location', 'Please enter location.');
      result = false;
    }
    if (!values.Phone) {
      setFieldError("Phone", "Please enter phone.");
      result = false;
    }
    if (!values.EstablishedIn) {
      setFieldError("EstablishedIn", "Please enter established date.");
      result = false;
    }
    if (!values.Ceo) {
      setFieldError("Ceo", "Please enter CEO name.");
      result = false;
    }
    if (values.LogoFile) {
      console.log({
        fileName: values.LogoFile.name,
        type: values.LogoFile.type,
        size: `${values.LogoFile.size} bytes`
      })
    }
    if (result) {
      showCreateSystemAdminModel();
    }
    return result;
  };

  const checkModal = (values, setFieldError) => {
    let result = true;

    if (!values.Email) {
      setFieldError("Email", "Please enter email.");
      result = false;
    }
    if (!values.Username) {
      setFieldError("Username", "Please enter username.");
      result = false;
    }
    if (!values.Password) {
      setFieldError("Password", "Please enter password.");
      result = false;
    }
    if (!values.Confirmpassword) {
      setFieldError("Confirmpassword", "Please enter established date.");
      result = false;
    }
    else if (values.Password !== values.Confirmpassword) {
      setFieldError("Confirmpassword", "Password does not match.");
      result = false;
    }

    if (result) {
      showCreateSystemAdminModel();
    }
    return result;
  };

  const handleFormSubmit = async (values, setFieldError) => {
    if (checkForm(values, setFieldError) && checkModal(values, setFieldError)) {
      const formData = new FormData();
      formData.append("OrganizationName", values.OrganizationName);
      formData.append("Location", values.Location);
      formData.append("Phone", values.Phone);
      formData.append("EstablishedIn", values.EstablishedIn);
      formData.append("Ceo", values.Ceo);
      formData.append("Username", values.Username);
      formData.append("Password", values.Password);
      formData.append("Email", values.Email);
      formData.append("LogoFile", values.logoFile);

      try {
        const response = await fetch(BASE_URL + '/Initialize/InitializeSystem', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Server Error: ${errorMessage}`);
        }

        const data = await response.text();
        if (data && data !== null) {
          toast.success(data);
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (

    <section className='container initialize__container'>
      <ToastContainer />
      <div className='initialize__image row'>
        <div className="col-md-6 work__chat__image">
          <img src={chatImage} alt="Work Chat" />
        </div>
        <div className='col-md-6 initialize__content'>
          <Formik
            initialValues={{
              OrganizationName: '',
              Location: '',
              Phone: '',
              EstablishedIn: '',
              Ceo: '',
              Username: '',
              Password: '',
              Email: '',
              Confirmpassword: '',
              LogoFile: '',
            }}
          >
            {({ values, handleChange, handleBlur, setFieldError, errors, touched, setFieldValue }) => (
              <Form className='initialize__form' encType="multipart/form-data">
                <h4 className='my-4 text-center'><span>System Initialization</span></h4>
                <div className="row my-2">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="organizationName" className='form-label'>Organization Name</label>
                    <Field
                      name="OrganizationName"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.OrganizationName || touched.OrganizationName ? (
                      <span className='text-danger'>{errors.OrganizationName}</span>
                    ) : null
                    }

                  </div>
                  <div className='col-md-6 col-sm-12'>
                    <label htmlFor="location" className='form-label'>Location</label>
                    <Field
                      name="Location"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.Location || touched.Location ? (
                      <span className='text-danger'>{errors.Location}</span>
                    ) : null
                    }
                  </div>
                </div>

                <div className="row my-2">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="phone" className='form-label'>Phone</label>
                    <Field
                      name="Phone"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.Phone || touched.Phone ? (
                      <span className='text-danger'>{errors.Phone}</span>
                    ) : null
                    }

                  </div>
                  <div className='col-md-6 col-sm-12'>
                    <label htmlFor="EstablishedIn" className='form-label'>Established Date</label>
                    <Field
                      name="EstablishedIn"
                      className="form-control"
                      type="date"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.EstablishedIn || touched.eEtablishedIn ? (
                      <span className='text-danger'>{errors.EstablishedIn}</span>
                    ) : null
                    }

                  </div>
                </div>

                <div className="row my-2">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="ceo" className='form-label'>CEO</label>
                    <Field
                      name="Ceo"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleChange}
                    />
                    {errors.Ceo || touched.Ceo ? (
                      <span className='text-danger'>{errors.Ceo}</span>
                    ) : null
                    }

                  </div>
                  <div className='col-md-6 col-sm-12'>
                    <label htmlFor="LogoFile" className='form-label'>logo</label>
                    <input
                      type="file"
                      id="logoFile"
                      name="logoFile"
                      accept=".png,.jpg"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFieldValue('logoFile', file);
                      }}
                    />
                  </div>
                </div>
                <div className="form__submit my-4">
                  <button type='button' className="submit__btn" onClick={() => checkForm(values, setFieldError)}>Submit</button>
                </div>

                <Modal show={handleCreateSystemAdminModel} onHide={hideCreateSystemAdminModel}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      Create System Admin
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <h5 className='my-3'><span></span></h5>
                    <div className="row my-2">
                      <div className="col-md-6 col-sm-12">
                        <label htmlFor="Email" className='form-label'>Email</label>
                        <Field
                          name="Email"
                          className="form-control"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.Email || touched.Email ? (
                          <span className='text-danger'>{errors.Email}</span>
                        ) : null
                        }

                      </div>
                      <div className="col-md-6 col-sm-12">
                        <label htmlFor="username" className='form-label'>Username</label>
                        <Field
                          name="Username"
                          className="form-control"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.Username || touched.Username ? (
                          <span className='text-danger'>{errors.Username}</span>
                        ) : null
                        }

                      </div>
                    </div>

                    <div className="row my-2">
                      <div className="col-md-6 col-sm-12">
                        <label htmlFor="Password" className='form-label'>Password</label>
                        <Field
                          name="Password"
                          className="form-control"
                          type="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.Password || touched.Password ? (
                          <span className='text-danger'>{errors.Password}</span>
                        ) : null
                        }

                      </div>
                      <div className='col-md-6 col-sm-12'>
                        <label htmlFor="Confirmpassword" className='form-label'>Confirm Password</label>
                        <Field
                          name="Confirmpassword"
                          className="form-control"
                          type="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.Confirmpassword || touched.Confirmpassword ? (
                          <span className='text-danger'>{errors.Confirmpassword}</span>
                        ) : null
                        }

                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <input type="submit" className="btn btn-success" value="SUBMIT" onClick={() => handleFormSubmit(values, setFieldError)} />
                  </Modal.Footer>
                </Modal>
              </Form>
            )}

          </Formik>

        </div>
      </div>
    </section>
  )
}

export default Initialize