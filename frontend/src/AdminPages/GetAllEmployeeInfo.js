import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import { FaUserTie, FaChalkboardTeacher, FaUsers, FaUserShield } from 'react-icons/fa';
import SignleStaffShow from "../AdminPages/SignleStaffShow"; // ✅ Import the modal component

const GetAllEmployeeInfo = () => {
    const axiosSecure = UseAxiosSecure();
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const limit = 5; // Items per page

    // ✅ State for modal visibility and selected staff ID
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);

    const tabs = [
        { id: "all", label: "All", icon: <FaUsers /> },
        { id: "staff", label: "Staff", icon: <FaUserTie /> },
        { id: "trainer", label: "Trainer", icon: <FaChalkboardTeacher /> },
        { id: "manager", label: "Manager", icon: <FaUserShield /> },
    ];

    const { data: staffData, isLoading, isError, refetch } = useQuery({
        queryKey: ['staff', activeTab, currentPage, search],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/getAllStaff', {
                params: { role: activeTab, page: currentPage, limit, search },
            });
            return data;
        },
    });

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= (staffData?.totalPages || 1)) {
            setCurrentPage(newPage);
        }
    };

    // ✅ Functions to open and close the modal
    const handleViewDetails = (id) => {
        setSelectedStaffId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStaffId(null); // Clear ID when closing
    };


    return (
        <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-300 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Employee Directory</h1>
                    <p className="text-red-500 mt-2">Manage and view all employee information.</p>
                </div>

                {/* Search and Tabs */}
                <div className="bg-black bg-opacity-40 p-4 rounded-lg shadow-lg mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Search Input */}
                        <div className="w-full sm:w-1/3">
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search by name or email..."
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                            />
                        </div>
                        {/* Tabs */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${activeTab === tab.id
                                            ? "bg-red-600 text-white shadow-md"
                                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Staff Table */}
                <div className="overflow-x-auto bg-black bg-opacity-40 rounded-lg shadow-lg">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : isError ? (
                        <div className="text-center p-10 text-red-500">Failed to load data.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Employee</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider hidden md:table-cell">Phone</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider hidden lg:table-cell">Hire Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {staffData?.staff?.map((employee) => (
                                    // ✅ Add onClick to the table row
                                    <tr
                                        key={employee._id}
                                        className="hover:bg-gray-800 transition-colors cursor-pointer"

                                    >
                                        <td className="p-4 flex items-center gap-4">
                                            <img
                                                onClick={() => handleViewDetails(employee._id)}
                                                src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.name}&background=1f2937&color=ef4444`}
                                                alt={employee.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <span className="font-medium text-white">{employee.name}</span>
                                        </td>
                                        <td className="p-4">{employee.email}</td>
                                        <td className="p-4 hidden md:table-cell">{employee.phone}</td>
                                        <td className="p-4 hidden lg:table-cell">{new Date(employee.hireDate).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-900 text-red-300 capitalize">
                                                {employee.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {staffData && staffData.totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 px-4">
                        <span className="text-sm text-gray-400">
                            Page {staffData.currentPage} of {staffData.totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === staffData.totalPages}
                                className="px-4 py-2 bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ Render the modal component */}
            <SignleStaffShow
                isOpen={isModalOpen}
                onClose={closeModal}
                staffId={selectedStaffId}
            />
        </div>
    );
};

export default GetAllEmployeeInfo;