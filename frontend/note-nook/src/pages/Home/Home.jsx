import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import './Home.css';


const Home = () => {
  return (
    <>
   
    <Header/>
    <div className="container-fluid max-width: 1600px; py-md-5 mb-5">
  <main>
    <div className="row py-md-5 text-center justify-content-center">

      <div className="col-md-12 col-lg-6 mb-6 mb-md-0">
        <h1 className="display-2 fw-bold mb-4 position-relative home-title">
          Write, plan, organize, play 
        </h1>
        <p className="fs-4 mb-4">
        Turn ideas into action with Notes Nook workspace.
        Millions run on Notes Nook every day.
        </p>
        <div className="flex space-x-4 justify-content-center">
      <button  className="  btn btn-outline-dark py-2 px-4 rounded ">
        
        <a  href="/login"  >Sign In </a>
      </button>
      
      <button  className="btn btn-dark py-2 px-4 rounded">
      <a href="/signUp" >Sign Up </a>
      </button>
      
    </div>
      </div>
      
    </div>
  </main>
</div>
    <Footer/>
    
  
    </>
  )
}

export default Home



    