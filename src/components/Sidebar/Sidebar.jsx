import React, { useEffect, useState } from 'react'
import userImg from '../../assets/dummy-user.jpg'
// import logo from '../../assets/neplakolgo.png'
import logo from '../../assets/chathub.png'
import { AiFillHome } from 'react-icons/ai'
import { RiBuilding4Fill } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'
import { BsFillChatLeftFill } from 'react-icons/bs'
import { AiFillSetting } from 'react-icons/ai'
import { Link, Outlet } from 'react-router-dom'
import { logout } from '../API/Request/Logout/logout'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { getuserById } from '../API/Request/User/getUserById'
import {server} from '../API/domain'



const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSettingComp, setShowSettingComp] = useState(true)
    const [user, setUser] = useState();
    // const id = localStorage.getItem('uid');

    const showModal = () => {
        setIsModalOpen(true);
    }
    const hideModal = () => {
        setIsModalOpen(false);
    }
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const navigate = useNavigate();
    const Logout = async () => {
        await logout()
            .then(data => {
                if (data === 'success') {
                    localStorage.clear();
                    navigate('/login');
                }
            })
            .catch(err => {
                // console.log(err);
                // localStorage.clear();
                // navigate('/login');
            })
    }

    const id = localStorage.getItem('uid');
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

      
    useEffect(() => {
        getUserByUserId();
    },[])

    return (
        <div className="col-md-auto py-2 overflow-auto sidebar hide__on__chat__section">
            <div className="sidenav__bar d-flex flex-column text-center">
                <Link to={'/'} className='sidebar__logo__icon'>
                    <img src={logo} alt="logo" />
                </Link>
                <ul className="nav nav-pills nav-flush flex-column mb-auto ">
                    {role === 'superadmin' || role === 'admin' ? (
                        <li className="nav-item py-4">
                            <Link to="/" className="nav-link" title="Home"><AiFillHome /></Link>
                        </li>
                    ) : null}
                    {role === 'superadmin' ? (
                        <li className="nav-item py-4">
                            <Link to="/departments" className="nav-link" title="Departments"><RiBuilding4Fill /></Link>
                        </li>
                    ) : null}
                    {role === 'superadmin' || role === 'admin' ? (
                        <li className="nav-item py-4">
                            <Link to="/users" className="nav-link" title="Users"><FaUsers /></Link>
                        </li>
                    ) : null}
                    {role === 'superadmin' || role === 'admin' || role === 'user' ? (
                        <li className="nav-item py-4">
                            <Link  to="/chat" className="nav-link" title="Chat"><BsFillChatLeftFill /></Link>
                        </li>
                    ) : null}
                    <li className="nav-item py-4">
                        <Link state={{showSettingComp : showSettingComp}} to="/chat" className="nav-link" title="Setting"><AiFillSetting /></Link>
                    </li>
                </ul>
                <div className='bottom__profile__img'>

                    <button onClick={() => showModal()}>
                            
                        <img 
                        src={user?.profilePictureULR ? `${server}${user?.profilePictureULR}` : userImg}
                        alt="user-image" className='sidebar__user__img' />
                    </button>
                </div>
            </div>
            <Modal show={isModalOpen} onHide={hideModal} className='sidebar__user__profile'>
                <Modal.Header className='border-0'>
                    <Modal.Title>
                        <img 
                        src={user?.profilePictureULR ? `${server}${user?.profilePictureULR}` : userImg}
                        alt="user-image" className='modal__user__image' />
                        <h5 className='m-0 pt-2'>{user?.fullname ? user?.fullname : username}</h5>
                        <p className='active__time'>Last seen 5 min ago</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='my-2'>
                    <div className='border-bottom py-2'>
                        <div>
                            Email:
                        </div>
                        <div>
                            <p>
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className='border-bottom my-2 py-2'>
                        <div>
                            Phone
                        </div>
                        <div>
                            <p>
                                {user?.phone}
                            </p>
                        </div>
                    </div>
                    <div className='py-2'>
                        <div>
                            Department
                        </div>
                        <div>
                            <p>
                                {user?.departmentName}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='border-0'>
                    <button type='button' onClick={() => Logout()}>
                        Logout
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Sidebar
