import React, { use, useState } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PracticeGetEmployee = () => {
    const axiosSecure=UseAxiosSecure();

    const [activeTab,setActiveTab]=useState("all")
    const [currentPage,setCurrentPage]=useState(1)
    const [search,setSearch]=useState("")

    const {data:staffData,isloading,isError}=useQuery({
        queryKey:['staff',]
    })
    return (
        <div>
            
        </div>
    );
};

export default PracticeGetEmployee;