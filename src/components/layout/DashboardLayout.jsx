import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';





const DashboardLayout = () => {
  return (
        <>
          <Navbar/>
          <main className="flex-1">
            <Outlet />
          </main>
        </>         
  );
};

export default DashboardLayout;
