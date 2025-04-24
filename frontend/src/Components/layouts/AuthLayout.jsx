import React from 'react'
import UI_IMG from '../../assets/images/beer.jpeg'

const AuthLayout = ({children}) => {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'></h2>
            {children}
        </div>

        <div className='hidden md:flex w-[40vw] h-screen intems-center justify-center overflow-hidden'>
            <img src={UI_IMG} className='w-64 lg:w-[100%]' alt="" />
        </div>
    </div>
  )
}

export default AuthLayout