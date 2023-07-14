import React, { useEffect, useState } from 'react'
import './Home.css'
import { FaUsers } from 'react-icons/fa'
import { BsFillBuildingsFill } from 'react-icons/bs'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import DashboardImage from '../../assets/undraw_texting_re_l11n.svg'
import { getActiveUsers } from '../API/Request/User/getActiveUsers'
import { getAllUsers } from '../API/Request/User/getAllUsers'
import { getAllDepartment } from '../API/Request/Department/getAllDepartments'
const Home = () => {
  const [totalStaffs, setTotalStaffs] = useState('0');
  const [totalDepartments, setTotalDepartments] = useState('1');
  const [totalActiveStaff, setTotalActiveStaffs] = useState('0');

  const activeUsers = async () => {
    await getActiveUsers()
    .then(data=>{
      setTotalActiveStaffs(data);
    })
    .catch(err=>{

    })

  }
  const allUsers =async ()=>{
    await getAllUsers('includingsuperadmin')
    .then(data=>{
      setTotalStaffs(data.length.toString());
    })
    .catch(err=>{
      
    })

  }

  const allDepartments =async ()=>{
    await getAllDepartment()
    .then(data=>{
      setTotalDepartments(data.length.toString());
    })
    .catch(err=>{
      
    })

  }
useEffect(()=>{
  (async ()=>{
    await allDepartments();
    await allUsers();
    await activeUsers();
  })();
},[])
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
                    <h1>{totalStaffs}</h1>
                    <p>Total Staffs</p>
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
                    <h1>{totalDepartments}</h1>
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
                    <h1>{totalActiveStaff}</h1>
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