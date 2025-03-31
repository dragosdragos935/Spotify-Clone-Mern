import React from 'react'
import {assets} from '../assets/assets'
const Sidebar = () => {
  return (
    <div className='bg-[#003A10] min-h-screen pl-[4vw]'>
        <img src={assets.logo} className='mt-5 w-[max(10vw,100px)] hidden sm:block' alt="" />
        <img src={assets.logo_small} className='mt-5 w-[max(5vw,40px)] mr-5 sm:hidden block' alt="" />
    </div>
  )
}

export default Sidebar