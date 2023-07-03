import React, { useEffect, useState } from 'react'
import './Home.css'
import { FaUsers } from 'react-icons/fa'
import { BsFillBuildingsFill } from 'react-icons/bs'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import DashboardImage from '../../assets/undraw_texting_re_l11n.svg'
const Home = () => {
  return (
 
        <div className='col-md home'>
          <div className='row mx-2 my-3'>
            <div className='col-md mx-3 bg-light rounded'>
              <div className='row rounded box_shadow'>
                <div className="col-md-5 bg-success rounded-start d-flex justify-content-center">
                  <FaUsers className='home__icons' />
                </div>
                <div className="col-md total__count">
                  <div>
                    <h1>12</h1>
                    <p>Staffs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md mx-3 bg-light rounded'>
              <div className='row rounded box_shadow'>
                <div className="col-md-5 bg-success rounded-start d-flex justify-content-center">
                  <BsFillBuildingsFill className='home__icons' />
                </div>
                <div className="col-md total__count">
                  <div>
                    <h1>12</h1>
                    <p>Departments</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md mx-3 bg-light rounded'>
              <div className='row rounded box_shadow'>
                <div className="col-md-5 bg-success rounded-start d-flex justify-content-center">
                  <BsFillPersonLinesFill className='home__icons' />
                </div>
                <div className="col-md total__count">
                  <div>
                    <h1>12</h1>
                    <p>Active Staffs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mx-2 mt-5'>
            <img src={DashboardImage} alt="Dashboard Image" className='dashboard__image' />
          </div>
        </div>
  )
}

export default Home