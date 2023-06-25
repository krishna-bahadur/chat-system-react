import React from 'react'
import ChatImg from '../../assets/user.jpg'
import logo from '../../assets/chathub.png'
import { AiFillHome } from 'react-icons/ai'
import { RiBuilding4Fill } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'
import { BsFillChatLeftFill } from 'react-icons/bs'
import { AiFillSetting } from 'react-icons/ai'
import { Link, Outlet } from 'react-router-dom'

const Sidebar = () => {
    const Logout = () =>{
        localStorage.clear();
    }
    return (
            <div className="col-md-1 py-2 overflow-auto sidebar">
                <div className="sidenav__bar d-flex flex-column text-center">
                    <a href="" className='sidebar__logo__icon'>
                        <img src={logo} alt="logo" />
                    </a>
                    <ul className="nav nav-pills nav-flush flex-column mb-auto ">
                        <li className="nav-item my-3">
                            <Link to="/" className="nav-link" title="Home"><AiFillHome /></Link>
                        </li>
                        <li className="nav-item my-3">
                            <Link to="/departments" className="nav-link" title="Departments"><RiBuilding4Fill /></Link>
                        </li>
                        <li className="nav-item my-3">
                            <Link to="/users" className="nav-link" title="Users"><FaUsers /></Link>
                        </li>
                        <li className="nav-item my-3">
                            <Link to="" className="nav-link" title="Chat"><BsFillChatLeftFill /></Link>
                        </li>
                        <li className="nav-item my-3">
                            <Link to="" className="nav-link" title="Setting"><AiFillSetting /></Link>
                        </li>
                    </ul>
                    <div>
                        <a href="" onClick={Logout}>
                            <img src={ChatImg} alt="user-image" className='sidebar__user__img' />
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default Sidebar
