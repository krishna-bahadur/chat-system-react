import { Formik, Form, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { BiSearchAlt } from 'react-icons/bi'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import { getAllRoles } from '../API/Request/Role/getAllRoles'
import { getAllDepartment } from '../API/Request/Department/getAllDepartments'
import { userExists } from '../API/Request/User/userExists'
import { userEmailExists } from '../API/Request/User/userEmailExists'
import { createUser } from '../API/Request/User/createUser'
import { toast } from 'react-toastify'

const User = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const showModal = () => {
        setIsModalOpen(true);
    }
    const hideModal = () => {
        setIsModalOpen(false);
    }
    const validateUserModal = Yup.object().shape({
        username: Yup.string().required('Please enter username.'),
        email: Yup.string().email('Invalid email').required('Please enter email.'),
        password: Yup.string().required('Please enter password.'),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password does not match.')
            .required('Please enter confirm password.'),
        roleId: Yup.string().required('Please select role.'),
        departmentId: Yup.string().required('Please select department.')
    })
    useEffect(() => {
        getAllRoles()
            .then(data => {
                setRoles(data);
            })
            .catch(err => {
                console.log("server error...")
            });

        getAllDepartment()
            .then(data => {
                setDepartments(data);
            })
            .catch(err => {
                console.log("server error...");
            });

        
    }, [])

    const validateEmail = async (value) => {
        let error;
        if(value != null && value !== ''){
        await userEmailExists(value)
            .then(data => {
                if (data.exists) {
                    error = 'Email already exists.';
                }
            })
            .catch(err => {
                console.log("Server Error");
            })
        }
        return error;
    }
    const validateUsername = async (value) => {
        let error;
        if(value != null && value != ''){
            await userExists(value)
            .then(data => {
                if (data.exists) {
                    error = 'Username already exists.';
                }
            })
            .catch(err => {
                console.log("Server Error");
            })
        }
        
        return error;
    }
    const handleSubmit = async (values) => {
        await createUser(values)
            .then(data => {
                hideModal();
                toast.success("User created successfully.");
            })
            .catch(err => {
                console.log("Server Error");
            })
    }


    return (
        <div className='col-md department m-0 p-0'>
            <div className='bg-light p-3'>
                <div className='row'>
                    <div className='col-md'>
                        <h5>Users</h5>
                    </div>
                    <div className='col-md d-flex justify-content-end mx-4'>
                        <AiOutlineArrowLeft className='back__arrow' />
                    </div>
                </div>
            </div>
            <div className='department__list mx-4 my-4'>
                <div className='row search__department'>
                    <div className='col-md-4'>
                        <form action="" className="search__form__container"  >
                            <BiSearchAlt />
                            <input type="search" className="form-control search__form" placeholder="search users" />
                        </form>
                    </div>
                    <div className='col-md d-flex justify-content-end'>
                        <button className='btn btn-success' title='Add User' onClick={() => showModal()}><IoMdAdd className='mx-1' /></button>
                    </div>
                </div>
                <div className='department__table my-3'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Department</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Krishna Bahdur Bk</td>
                                <td>Krishnabk651@gmail.com</td>
                                <td>krishnabk</td>
                                <td>HR Department</td>
                                <td title='Edit Department' className='edit__icon'><FiEdit /></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Krishna Bahdur Bk</td>
                                <td>Krishnabk651@gmail.com</td>
                                <td>krishnabk</td>
                                <td>HR Department</td>
                                <td title='Edit Department' className='edit__icon'><FiEdit /></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Krishna Bahdur Bk</td>
                                <td>Krishnabk651@gmail.com</td>
                                <td>krishnabk</td>
                                <td>HR Department</td>
                                <td title='Edit Department' className='edit__icon'><FiEdit /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={isModalOpen} onHide={hideModal} className='department__modal'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        User
                    </Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmpassword: '',
                        roleId: '',
                        departmentId: ''
                    }}
                    validationSchema={validateUserModal}
                    onSubmit={values => {
                        handleSubmit(values);
                    }}
                >
                    {({ errors, touched, setFieldValue, value }) => (
                        <Form>
                            <Modal.Body>
                                <div className='row my-4'>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Username</label>
                                        <Field
                                            name='username'
                                            className='form-control'
                                            type='text'
                                            validate={validateUsername}
                                        />
                                        {errors.username && touched.username && <div className='text-danger text-start errors'>{errors.username}</div>}
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Email</label>
                                        <Field
                                            name='email'
                                            className='form-control'
                                            type='text'
                                            validate={validateEmail}
                                        />
                                        {errors.email && touched.email && <div className='text-danger text-start errors'>{errors.email}</div>}
                                    </div>
                                </div>
                                <div className='row my-4'>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Password</label>
                                        <Field
                                            name='password'
                                            className='form-control'
                                            type='password'
                                        />
                                        {errors.password && touched.password && <div className='text-danger text-start errors'>{errors.password}</div>}
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Confirm Password</label>
                                        <Field
                                            name='confirmpassword'
                                            className='form-control'
                                            type='password'
                                        />
                                        {errors.confirmpassword && touched.confirmpassword && <div className='text-danger text-start errors'>{errors.confirmpassword}</div>}
                                    </div>
                                </div>
                                <div className='row my-4'>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Department</label>
                                        <Field
                                            as='select'
                                            name='departmentId'
                                            className='form-select'
                                        >
                                            <option>-- select department --</option>
                                            {departments.map(department => (
                                                <option key={department.departmentId} value={department.departmentId}>{department.departmentName}</option>
                                            ))}
                                        </Field>
                                        {errors.departmentId && touched.departmentId && <div className='text-danger text-start errors'>{errors.departmentId}</div>}
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <label className='form-label'>Role</label>
                                        <Field
                                            as='select'
                                            name='roleId'
                                            className='form-select'
                                        >
                                            <option>-- select role --</option>
                                            {roles.map(role => (
                                                <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                                            ))}
                                        </Field>
                                        {errors.roleId && touched.roleId && <div className='text-danger text-start errors'>{errors.roleId}</div>}
                                    </div>
                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <button type='submit' className='btn btn-success'>save</button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>

            </Modal>
        </div>
    )
}

export default User
