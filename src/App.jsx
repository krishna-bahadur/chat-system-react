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
import Chat from './components/Chat/Chat';
import RoutesComponents from './components/RoutesComponents/RoutesComponents';
import ChatComponent from './components/Chat/ChatComponent';
import ChatCom from './components/Chat/ChatCom';

const App = () => {
const role = localStorage.getItem('role');

  return (
    <Router>
        <Routes>
        <Route path="/initialize" element={<Initialize/>} />
        <Route path="/login" element={<Login/>} />
          <Route path='/' element={<Protected><Layout/></Protected>}>
          <Route index element={role === 'superadmin' || role ==='admin' ? <HomePage /> : <Chat/>} />
            {role === 'superadmin' ? <Route path='/departments' element={<Department />} /> : null } 
            {role === 'superadmin' || role ==='admin' ? <Route path='/users' element={<User />} />: null}
            <Route path='/chatapp' element={<Chat />} />          
            <Route path='/chat' element={<ChatComponent />} />          
            <Route path='/chatcom' element={<ChatCom />} />          
          </Route>
          <Route path='*' element={<NotFound/>}></Route>
        </Routes>
    </Router>
  )
}

export default App