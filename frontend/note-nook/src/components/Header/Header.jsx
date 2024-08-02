import React from 'react';


const Header = () => {
  return (
    <div className="bg-white flex items-center justify-between  px-6 py-2 drop-shadow">
    <div className="flex items-center">
    <img className="h-8 w-auto mr-2" src="https://img.icons8.com/?size=100&id=453&format=png&color=000000" alt="Product Icon"></img>
    <h2 className="text-xl font-medium text-black py-2"><a href='/home'>Notes Nook</a></h2>
    </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li><a href="/home" className="nav-link px-2 link-secondary">Home</a></li>
        <li><a href="/home" className="nav-link px-2 link-dark">Features</a></li>
        <li><a href="/home" className="nav-link px-2 link-dark">FAQs</a></li>
        <li><a href="/home" className="nav-link px-2 link-dark">About</a></li>
      </ul>     
    
      
      <div className="flex space-x-4">
      <button  className="  btn btn-outline-dark py-2 px-4 rounded ">
        
        <a href="/login" >Sign In </a>
      </button>
      
      <button className="btn btn-dark py-2 px-4 rounded">
      <a href="/signUp" >Sign Up </a>
      </button>
    </div>
    
   
</div>
  );
}

export default Header;


