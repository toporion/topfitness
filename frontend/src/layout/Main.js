import React from 'react';
import { Outlet } from 'react-router-dom';
import Menubar from '../components/Menubar';
import Footer from '../components/Footer';

const Main = () => {
    return (
        <div className='bg-stone-800 min-h-screen'>
            <Menubar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Main;