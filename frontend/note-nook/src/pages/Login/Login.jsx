import React, {useState} from 'react';
import {  FaRegEnvelope} from 'react-icons/fa';
import {Link , useNavigate} from "react-router-dom";
import Navbar from '../../components/Navbar/Navbar.jsx';
import { MdLockOutline} from 'react-icons/md';
import PasswordInput from '../../components/Input/PasswordInput.jsx';
import axiosInstance from "../../utils/axiosInstance.js";
import {validateEmail} from '../../utils/helper.js';
import Header from '../../components/Header/Header.jsx';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)){
          setError("Please enter a valid email address.");
          return;
    }
    
    if (!password){
      setError("Please enter the password.");
      return;
       
    }

    setError("")
    

  // Login API Call
try {
  
  const response = await axiosInstance.post("/user/login", {
      email: email,
      password: password,
  });

  // Handle successful login response
  
  if (response.data && response.data.accessToken) { 
      localStorage.setItem("token", response.data.accessToken);
      navigate("/dashboard");
      
  }
} catch (error) {
  // Handle login error
  if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
  } else {
      setError("An unexpected error occurred. Please try again.");
  }
}
};

  return (
    <>
      <Header/>
     
        <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100">
            
            <main className="flex flex-col items-center justify-center w-full flex-1 px-2  text-center">
           
                <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-2xl" >
                    <div className="w-3/5 p-5">
                      
                      <div className=' py-8 px-8'>
                           <h2 className="text-3xl font-bold text-black-500 mb-2">
                           Sign in to account
                           </h2>
                           <div className="border-2 w-10 border-black inline-block mb-2"></div>
                           
                                <div className="flex flex-col items-center">
                                <form onSubmit={handleLogin}>
                                      <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                                               <FaRegEnvelope className="text-gray-400 m-2" />
                                                   <input type="email" placeholder="Email" className="bg-gray-100 outline-none text-sm flex-1" value={email}  onChange={(e) => setEmail(e.target.value)} />
                                      </div>
                                       <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                                             <MdLockOutline className="text-gray-400 m-2" />
                                              <PasswordInput  className="bg-gray-100 outline-none text-sm flex-1" value={password} onChange={(e) => setPassword(e.target.value)} />
                                       
                                       </div>
                                     {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
       
                                   <button data-testid="login-submit-button" type="submit" className="border-2 border-black text-black-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white"> Sign In </button>
                                   </form>
                      </div> 
                      </div>                
                    </div>

              



                    {/* Sign in section */}
                    <div className="w-2/5 bg-black text-white rounded-tr-2xl rounded-br-2xl pt-5 pb-0 px-12">
                        <h2 className="text-3xl font-bold mb-2">Start Your Journey With Us!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-2"></div>
                        <p className="mb-10">Not registered yet?{" "} </p>
                        <a href="/signUp" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-black">Sign Up</a>
                    </div>
                </div>
                
                
                <div className="flex flex-col items-center">
                   
                </div>
            </main>
        </div>

</>
  );
};

export default Login;