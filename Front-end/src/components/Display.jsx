import React, { useEffect, useRef } from 'react'
import { Route, Routes } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import { useLocation } from 'react-router-dom';

const Display = () => {

  const {albumsData} = useContext(PlayerContext);



  const displayRef = useRef();
  const location = useLocation();
  console.log(location);
  const isAlbum  = location.pathname.includes("album");
  console.log(isAlbum);
 const albumId = isAlbum ? location.pathname.split("/").pop():"";
 console.log(albumId);
 const bgColor = isAlbum && albumsData.length >0 ? albumsData.find((x)=> (x._id == albumId)).bgColor : "#121212";
 console.log(bgColor);

 useEffect(() => {
  if(isAlbum){
    displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`
  }
  else
  {
    displayRef.current.style.background = `#121212`
  }
 })
 
  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
      {albumsData.length>0
      ? <Routes>
        <Route path='/' element={<DisplayHome/>} />
        <Route path='/album/:id' element={<DisplayAlbum album={albumsData.find((x)=>(x._id==albumId))}/>} />
      </Routes>
    : null
  }
     
    </div>
  )
}

export default Display
