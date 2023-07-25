import React, { useEffect, useState } from 'react'
import ChatImg from '../../assets/user.jpg'
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

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                console.log(err);
            })
    }

    return (
        <div className="col-md-1 py-2 overflow-auto sidebar">
            <div className="sidenav__bar d-flex flex-column text-center">
                <Link to={'/'} className='sidebar__logo__icon'>
                    <img src={logo} alt="logo" />
                </Link>
                <ul className="nav nav-pills nav-flush flex-column mb-auto ">
                    {role === 'superadmin' || role === 'admin' ? (
                        <li className="nav-item my-3">
                            <Link to="/" className="nav-link" title="Home"><AiFillHome /></Link>
                        </li>
                    ) : null}
                    {role === 'superadmin' ? (
                        <li className="nav-item my-3">
                            <Link to="/departments" className="nav-link" title="Departments"><RiBuilding4Fill /></Link>
                        </li>
                    ) : null}
                    {role === 'superadmin' || role === 'admin' ? (
                        <li className="nav-item my-3">
                            <Link to="/users" className="nav-link" title="Users"><FaUsers /></Link>
                        </li>
                    ) : null}
                    {role === 'superadmin' || role === 'admin' || role === 'user' ? (
                        <li className="nav-item my-3">
                            <Link to="/chat" className="nav-link" title="Chat"><BsFillChatLeftFill /></Link>
                        </li>
                    ) : null}
                    <li className="nav-item my-3">
                        <Link to="" className="nav-link" title="Setting"><AiFillSetting /></Link>
                    </li>
                </ul>
                <div>

                    <button onClick={() => showModal()}>
                        <img src={ChatImg} alt="user-image" className='sidebar__user__img' />
                    </button>
                </div>
            </div>
            <Modal show={isModalOpen} onHide={hideModal} className='sidebar__user__profile'>
                <Modal.Header className='border-0'>
                    <Modal.Title>
                        <img src={ChatImg} alt="user-image" className='modal__user__image' />
                        <h5 className='m-0 pt-2'>{username}</h5>
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
                                sumanrai@gmail.com
                            </p>
                        </div>
                    </div>
                    <div className='border-bottom my-2 py-2'>
                        <div>
                            Phone
                        </div>
                        <div>
                            <p>
                                9817405449
                            </p>
                        </div>
                    </div>
                    <div className='py-2'>
                        <div>
                            Department
                        </div>
                        <div>
                            <p>
                                HR Department
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
