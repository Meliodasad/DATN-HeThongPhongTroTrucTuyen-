import React from 'react'
import ClientHeader from '../../components/user/Header'
import ClientFooter from '../../components/user/Footer'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => {
  return (
    <>
      <ClientHeader />
      <div className='max-w-7xl mx-auto'>
        <Outlet />
      </div>
      <ClientFooter />
    </>
  )
}

export default ClientLayout
