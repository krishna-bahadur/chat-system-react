import React, { useEffect, useState } from 'react'
import ProfilePicture from '../../assets/dummy-user.jpg'
import { FiLogOut } from 'react-icons/fi'
import { logout } from '../API/Request/Logout/logout'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../API/Request/User/ChangePassword'
import { toast, ToastContainer } from 'react-toastify'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup';
import { updateUser } from '../API/Request/User/updateUser'
import { getuserById } from '../API/Request/User/getUserById'
import {server} from '../API/domain'

const SettingComponent = () => {
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [changePasswordError, setChangePasswordError] = useState('');

    const [showChangeProfile, setShowChangeProfile] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [user, setUser] = useState();

    const [profilePicture, setProfilePicture] = useState(false);
    const id = localStorage.getItem('uid');

  const handleProfilePictureChange = (event) => {
    const selectedFile = event.target.files[0]; 
    if (selectedFile) {
        debugger;
        const picture = {'profilePicture': selectedFile}
        updateProfilePicture(picture);
       
    }
  };

  const updateProfilePicture = async (picture) =>{
    await updateUser(picture)
        .then(data =>{
            toast.success('Profile picture update successfully.');
            setProfilePicture(!profilePicture); 
        })
        .catch(err=>{

        })
  }

  const getUserByUserId = async () => {
    if(id){
        await getuserById(id)
      .then(data => {
        setUser(data);
      }).catch(err => {
        console.log(err);
      })
    }
  }

    const Logout = async () => {
        await logout()
            .then(data => {
                if (data === 'success') {
                    localStorage.clear();
                    navigate('/login');
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const handleTogglePasswordFields = () => {
        setShowChangePassword(!showChangePassword);
    };

    const handleToggleProfileFields = () => {
        setShowChangeProfile(!showChangeProfile);
    }
    const handleProfileChange = async (values) => {
        await updateUser(values)
        .then(data=>{
            toast.success('Profile change successfully.');
            setShowChangeProfile(!showChangeProfile);
        })
        .catch(err=>{

        })
    }

    const submitChangePassword = async () => {
        const values = { "currentPassword": currentPassword, "newPassword": newPassword }
        console.log(values);
        await changePassword(values)
            .then(data => {
                setShowChangePassword(!showChangePassword);
                setCurrentPassword('');
                setNewPassword('');
                setVerifyPassword('');
                toast.success('Password change successfully.');
            })
            .catch(err => {
                if (err.response && err.response.status === 500) {
                    setChangePasswordError(err.response.data);
                }
                else {
                    //console.log(err.message);
                }
            })
    };

    const checkPasswordMatch = (e) => {
        const verifyPassword = e.target.value;
        setVerifyPassword(verifyPassword);
        setPasswordsMatch(verifyPassword === newPassword);
    };

    const validateProfileChange = Yup.object().shape({
        fullname: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Please enter phone no'),
    });

    useEffect(() =>{
        getUserByUserId();
    },[showChangeProfile, profilePicture])

    return (
        <div className={`col-md-4 setting__comp overflow-auto p-4 `}>
            <ToastContainer />
            <div className='my-2 d-flex'>
                <div><h4>Settings</h4></div>
            </div>
            <div className='row my-2 user__setting__profile align-middle px-2 py-3'>
                <div className='col-md-auto col-auto '>
                    <label htmlFor="profile-picture-input" className='cursor__pointer'>
                        <img
                            src={user?.profilePictureULR ? `${server}${user?.profilePictureULR}` : ProfilePicture}
                            alt="user-image"
                            className='sidebar__user__img'
                        />
                    </label>
                    <input
                        type="file"
                        id="profile-picture-input"
                        style={{ display: 'none' }}
                        onChange={handleProfilePictureChange}
                        accept="image/*" // Allow only image files
                    />
                </div>

                <div className='col-md col mx-0 px-0'>
                    <div className='user_fullname'>
                        {user?.fullname ? user?.fullname: user?.username}
                    </div>
                    <div className='user__email__address'>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <div className='col-md-auto col-auto mx-0 px-0'>
                    <button onClick={() => Logout()}><p><FiLogOut /></p></button>
                </div>
            </div>
            <div className='row my-4 user__setting__profile align-middle px-2 py-3'>
                <div className='row py-2 cursor__pointer' onClick={handleToggleProfileFields} >
                    <div>Profile Settings</div>
                    <div><p>Change your profile setting</p></div>
                </div>
                <hr />
                {showChangeProfile && (
                    <div className='change__password__container'>
                        <Formik
                            initialValues={
                                user?.fullname && user?.email && user?.phone ? 
                                {
                                    fullname: user?.fullname,
                                    email: user?.email,
                                    phone: user?.phone,
                                } : 
                                {
                                    fullname: '',
                                    email: '',
                                    phone: '',
                                }
                            }
                            enableReinitialize={true}
                            validationSchema={validateProfileChange}
                            onSubmit={values => {
                                handleProfileChange(values);
                            }}
                        >
                            {({ errors, touched, setFieldValue }) => (
                                <Form>
                                    <div className='row my-2'>
                                        <div className="form-floating mb-3">
                                            <Field type="text" className="form-control" id="floatingInput" placeholder="Full Name" name="fullname" />
                                            <label for="floatingInput" className='px-4'><p>Full Name</p></label>
                                            {errors.fullname && touched.fullname && <div className='text-danger text-start errors'>{errors.fullname}</div>}
                                        </div>
                                        <div className="form-floating mb-3">
                                            <Field type="text" className="form-control" id="floatingPassword" placeholder="Email" name="email" />
                                            <label for="floatingPassword" className='px-4'><p>Email</p></label>
                                            {errors.email && touched.email && <div className='text-danger text-start errors'>{errors.email}</div>}
                                        </div>
                                        <div className="form-floating mb-3">
                                            <Field type="text" className="form-control" id="floatingPassword" placeholder="Phone" name='phone' />
                                            <label for="floatingPassword" className='px-4'><p>Phone</p></label>
                                            {errors.phone && touched.phone && <div className='text-danger text-start errors'>{errors.phone}</div>}
                                        </div>
                                        <button type='submit' className='btn btn-success w-100 my-3'>
                                            Save
                                        </button>
                                    </div>
                                </Form>
                            )}

                        </Formik>

                    </div>
                )}
                <div className='row py-2 cursor__pointer' onClick={handleTogglePasswordFields} >
                    <div>Password</div>
                    <div><p>Change your password</p></div>
                </div>
                <hr />
                {showChangePassword && (
                    <div className='change__password__container'>
                        <div className='row my-2'>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInput" placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)} />
                                <label for="floatingInput" className='px-4'><p>Current Password</p></label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <label for="floatingPassword" className='px-4'><p>New Password</p></label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Verify Password"
                                    value={verifyPassword}
                                    onChange={checkPasswordMatch}
                                />
                                <label for="floatingPassword" className='px-4'><p>Verify Password</p></label>
                            </div>
                            {!passwordsMatch && <p style={{ color: 'red' }}>Passwords does not match</p>}
                            {changePasswordError && <p style={{ color: 'red' }}>{changePasswordError}</p>}
                            <button type='button' onClick={submitChangePassword} className='btn btn-success w-100 my-3' disabled={!passwordsMatch}>
                                Change Password
                            </button>
                        </div>
                    </div>
                )}
                <div className='row py-2'>
                    <div>Email</div>
                    <div><p>Verify your email</p></div>
                </div>
                <hr />
            </div>
        </div>
    )
}

export default SettingComponent
