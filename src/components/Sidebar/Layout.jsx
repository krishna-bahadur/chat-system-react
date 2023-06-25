import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <section className='chat__system'>
            <div className='row'>
                <Sidebar />
                <Outlet />
            </div>
        </section>
    )
}

export default Layout
