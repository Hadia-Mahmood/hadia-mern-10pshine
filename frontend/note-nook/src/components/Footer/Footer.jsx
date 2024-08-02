import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
            <img className="h-8 w-auto mr-2" src="https://img.icons8.com/?size=100&id=453&format=png&color=000000" alt="Product Icon"></img>
            
          </a>
          <span className="mb-3 mb-md-0 text-body-secondary">© 2024 Notes Nook, Inc</span>
        </div>
       <div></div>
        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        
        <li className="ms-3">
            <a className="text-body-secondary">
            <img src=" https://img.icons8.com/?size=100&id=60014&format=png&color=000000" alt="Twitter" width="24" height="24" />
             </a>
        </li>
        <li className="ms-3">
            <a className="text-body-secondary">
            <img src="https://img.icons8.com/?size=100&id=118467&format=png&color=000000" alt="Facebook" width="24" height="24" />
            </a>
        </li>
        <li className="ms-3">
            <a className="text-body-secondary">
            <img src="https://img.icons8.com/?size=100&id=32292&format=png&color=000000" alt="Instagram" width="24" height="24" />
            </a>
        </li>


        </ul>
      </div>
    </div>
  );
}

export default Footer;




