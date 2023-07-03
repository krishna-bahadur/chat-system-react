import { Formik, Form, Field } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { BiSearchAlt } from 'react-icons/bi'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import { getAllRoles } from '../API/Request/Role/getAllRoles'
import { getAllDepartment } from '../API/Request/Department/getAllDepartments'
import { userExists } from '../API/Request/User/userExists'
import { userEmailExists } from '../API/Request/User/userEmailExists'
import { createUser } from '../API/Request/User/createUser'
import { ToastContainer, toast } from 'react-toastify'
import { getAllUsers } from '../API/Request/User/getAllUsers'
import { handleUserStatus } from '../API/Request/User/handleUserStatus'

const User = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState('');
    const [idForChangeStatus, setIdForChangeStatus] = useState('');

    const showModal = () => {
        setIsModalOpen(true);
    }
    const hideModal = () => {
        setIsModalOpen(false);
    }
    const showUserModal = () => {
        setIsUserModalOpen(true);
    }
    const hideUserModal = () => {
        setIsUserModalOpen(false);
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

    const getUsers = async () => {
        await getAllUsers()
            .then(data => {
                setUsers(data);
                setTotalUsers('');
            })
            .catch(err => {
                if (err.response && err.response.status === 500) {
                    setTotalUsers('No users found.')
                } else {

                }
            })
    }

    const getRoles = async () => {
        await getAllRoles()
            .then(data => {
                setRoles(data);
            })
            .catch(err => {
                console.log("server error...")
            });
    }

    const getDepartments = async () => {
        await getAllDepartment()
            .then(data => {
                setDepartments(data);
            })
            .catch(err => {
                console.log("server error...");
            });
    }



    const validateEmail = async (value) => {
        let error;
        if (value != null && value !== '') {
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
        if (value != null && value !== '') {
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
                getUsers();
            })
            .catch(err => {
                console.log("Server Error");
            })
    }
   
    const  handleUserUpdate = async () => {
        debugger;
        await handleUserStatus(idForChangeStatus)
        .then(data=>{
            toast.success('User status change successfully.')
            hideUserModal();
            getUsers();
            setIdForChangeStatus('');
        })
        .catch(err=>{
            if(err.response && err.response.status === 500){
                toast.error("Something went wrong.")
            }
            else{
                //console.log(err.message);
            }
        })
      }
    useEffect(() => {
        (async () => {
            await getUsers();
        })();
    }, [])


    return (
        <div className='col-md department m-0 p-0'>
            <ToastContainer />
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
                        <button className='btn btn-success' title='Add User' onClick={() => {
                            getDepartments();
                            getRoles();
                            showModal()
                        }}><IoMdAdd className='mx-1' /></button>
                    </div>
                </div>
                <div className='department__table my-3'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, index) => {
                                    return (
                                        <tr key={user.userId}>
                                            <td>{index + 1}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.departmentName}</td>
                                            <td>{user.roleName}</td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    role="switch" 
                                                    id="flexSwitchCheckChecked" 
                                                    checked={user.isActive}
                                                    onChange={(e) => {
                                                        showUserModal();
                                                        setIdForChangeStatus(user.userId);
                                                      }} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {totalUsers && <p className='text-center'>{totalUsers}</p>}
                </div>
            </div>

            <Modal show={isModalOpen} className='department__modal'>
                <Modal.Header>
                    <Modal.Title>
                        User
                    </Modal.Title>
                    <button type='button' className="btn-close" onClick={hideModal}></button>
                </Modal.Header>
                <Formik
                    initialValues={
                            {
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
            <Modal show={isUserModalOpen}>
                <Modal.Header>
                    <Modal.Title>
                        Change Status
                    </Modal.Title>
                    <button type='button' className="btn-close" onClick={hideUserModal}></button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to change user status ?
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className='btn btn-success' onClick={()=>handleUserUpdate()}>Yes</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default User
