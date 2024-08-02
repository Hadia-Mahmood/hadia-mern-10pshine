import React, { useState } from 'react'
import  {useNavigate } from "react-router-dom";
import SearchBar from '../SearchBar/SearchBar.jsx';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch}) => {
    const [searchQuery , setSearchQuery] =useState("");
    const navigate = useNavigate();

    const onLogout =() =>{
      localStorage.clear();
      navigate("/login");
      };
    
    const handleSearch = () => {
      if(searchQuery){
        onSearchNote(searchQuery)
      }
    };

    const  onClearSearch = () => {
      setSearchQuery("");
      handleClearSearch()
    };


    return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      
      <div className="flex items-center">
    <img className="h-8 w-auto mr-2" src="https://img.icons8.com/?size=100&id=453&format=png&color=000000" alt="Product Icon"></img>
    <h2 className="text-xl font-medium text-black py-2"><a href='/home'>Notes Nook</a></h2>
    </div>



      <SearchBar
        value={searchQuery}
        onChange={({target}) =>{
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <button class="  "></button>
      <button className='btn btn-outline-dark py-2 px-4 rounded ' onClick={onLogout}>
            Logout
           </button>
    </div>
    
  );
};
export default Navbar;



