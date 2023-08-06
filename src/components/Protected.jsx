import React, { useEffect, useState } from "react";
import { useNavigate,useLocation  } from "react-router-dom";
import BASE_URL from './apiConfig';


const Protected = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/Initialize/CheckInitialize`);
      const data = await response.json();
      if(data){
        navigate('/initialize');
      }
      else{

        const usertoken = localStorage.getItem("token");
        if(!usertoken || usertoken === 'undefined'){
          setIsLoggedIn(false);
          navigate('/login');
        }
        else {
          // Decode the JWT token to access the expiration time
          const tokenData = parseJwt(usertoken);
          const currentTimestamp = Math.floor(Date.now() / 1000);

          if (tokenData.exp < currentTimestamp) {
           
            setIsLoggedIn(false);
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setIsLoggedIn(true);
          }
        }
        
      }
    }catch(error){
      console.log('Error checking system initialization:', error);
    }
  }

   
  useEffect(() => {
    checkAuth();
  });

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
    );

    return JSON.parse(jsonPayload);
  }

  return isLoggedIn ? <div>{children}</div> : null;
};

export default Protected;
