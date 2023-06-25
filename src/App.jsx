import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import React from 'react'
import Login from './components/Login/Login'
import HomePage from './components/Home/Home';
import Initialize from './components/Initialize/Initialize';
import Layout from './components/Sidebar/Layout';
import NotFound from './components/404';
import Protected from './components/Protected'
import Department from './components/Departments/Department';
import User from './components/User/User';

const App = () => {
  return (
    <Router>
        <Routes>
        <Route path="/initialize" element={<Initialize/>} />
        <Route path="/login" element={<Login/>} />
          <Route path='/' element={<Protected><Layout/></Protected>}>
            <Route index element={<HomePage/>} />
            <Route path='/departments' element={<Department/>} />
            <Route path='/users' element={<User/>} />
          </Route>
          <Route path='*' element={<NotFound/>}></Route>
        </Routes>
    </Router>
  )
}

export default App