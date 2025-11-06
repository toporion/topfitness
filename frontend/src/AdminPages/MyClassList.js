import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { FiLoader, FiAlertTriangle, FiBookOpen, FiTrash2, FiCreditCard } from 'react-icons/fi';

const MyClassesPage = () => {
    const [myClasses, setMyClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = UseAxiosSecure();

    useEffect(() => {
        // Fetches the initial list of classes
        const fetchMyClasses = async () => {
            try {
                const res = await axiosSecure.get('/my-classes');
                if (res.data.success) {
                    setMyClasses(res.data.data);
                }
            } catch (err) {
                setError("Failed to load your classes.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyClasses();
    }, [axiosSecure]);

    // --- NEW: Function to handle cancellation ---
    const handleCancelEnrollment = async (enrollmentId) => {
        if (!window.confirm("Are you sure you want to cancel this enrollment?")) {
            return;
        }
        try {
            const res = await axiosSecure.delete(`/${enrollmentId}`);
            if (res.data.success) {
                // Remove the cancelled class from the state to update the UI instantly
                setMyClasses(prevClasses => prevClasses.filter(e => e._id !== enrollmentId));
                alert("Enrollment cancelled successfully!");
            }
        } catch (err) {
            alert("Failed to cancel enrollment. Please try again.");
            console.error(err);
        }
    };
    
    // Placeholder for payment logic
    const handleCheckout = async(enrollmentId, amount) => {
        try{
            const res=await axiosSecure.post('/create-checkout-session',{enrollmentId})
            console.log('see payment hit',res)
            if(res.data.url){
                window.location.href=res.data.url
            }
        }catch(error){
            console.log('see payment error',error)
        }
        alert(`Redirecting to checkout for enrollment ${enrollmentId} for $${amount}. \n(This is where payment gateway integration would begin)`);
        // Here you would typically redirect to a payment page or open a payment modal
    };


    // --- UI Loading and Error States (same as before) ---
    if (isLoading) { /* ... same as before ... */ }
    if (error) { /* ... same as before ... */ }

    // --- REDESIGNED JSX WITH TABLE ---
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8">My Enrolled Classes</h1>

                {myClasses.length > 0 ? (
                    <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-lg">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-slate-900/70 text-xs text-slate-300 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Class Name</th>
                                    <th scope="col" className="px-6 py-4">Trainer</th>
                                    <th scope="col" className="px-6 py-4">Enrolled Date</th>
                                    <th scope="col" className="px-6 py-4">Price</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {myClasses.map((enrollment) => (
                                    <tr key={enrollment._id} className="hover:bg-slate-800 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{enrollment.classId.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{enrollment.classId.trainer.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{new Date(enrollment.enrolledDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-mono text-slate-300">${enrollment.paymentAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                                enrollment.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-300' :
                                                enrollment.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-red-500/20 text-red-300'
                                            }`}>
                                                {enrollment.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {enrollment.paymentStatus === 'pending' && (
                                                    <button 
                                                        onClick={() => handleCheckout(enrollment._id, enrollment.paymentAmount)}
                                                        className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition" 
                                                        title="Pay Now">
                                                        <FiCreditCard />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleCancelEnrollment(enrollment._id)}
                                                    className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition" 
                                                    title="Cancel Enrollment">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // --- No classes found state (same as before) ---
                    <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-xl">
                        {/* ... same as before ... */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyClassesPage;