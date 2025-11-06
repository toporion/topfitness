// This file is ALREADY CORRECT.
// It will work after you fix 'confirmPayment'.

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react"; 
import UseAxiosSecure from "../hook/UseAxiosSecure";

// -------------------------------------------------------------------
// MODAL COMPONENT
// -------------------------------------------------------------------
const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose} 
    >
      <div
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            Client Details
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 space-y-4">
        
          <div className="flex justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-3xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-400">Name</label>
            <p className="text-lg text-white">
              {user.name || <span className="text-slate-500">Not provided</span>}
            </p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <p className="text-lg text-white">{user.email || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">User ID</label>
            <p className="text-xs text-slate-500">
              {user._id || user.id || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------------------------------
// END MODAL COMPONENT
// -------------------------------------------------------------------

const PaymentHistory = () => {
  const axiosSecure = UseAxiosSecure();
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payment-history");
      return res.data.data;
    },
  });

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleViewDetails = (payment) => {
    // This logic IS correct. It's waiting for good data.
    const userObject = payment.userDetails || payment.userId;

    if (userObject && typeof userObject === 'object' && userObject.email) {
      setSelectedUser(userObject);
    } 
    else {
      // Fallback for client view or broken data
      setSelectedUser({
        name: payment.name || null, // Use the name from the payment record
        email: payment.email, 
        _id: payment.userId 
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  if (isLoading)
    return (
      <div className="text-center text-white p-10">⏳ Loading payment history...</div>
    );

  if (error)
    return (
      <div className="text-center text-red-400 p-10">
        ❌ Failed to load payment history.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">💳 Payment History</h1>

        {payments.length === 0 ? (
          <div className="text-center text-gray-400 py-16 border border-slate-700 rounded-xl">
            No payment records found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-slate-700 rounded-lg shadow-lg">
              <table className="min-w-full text-sm text-left">
                {/* ... table headers ... */}
                <thead className="bg-slate-800/80 text-slate-300 uppercase">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Class Name</th>
                    <th className="px-6 py-3">Trainer</th>
                    <th className="px-6 py-3">Amount ($)</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {payments.map((p, index) => (
                    <tr key={p._id} className="hover:bg-slate-800 transition">
                      <td className="px-6 py-3">{index + 1}</td>
                      <td
                        className="px-6 py-3 font-medium text-blue-400 cursor-pointer hover:underline"
                        onClick={() => handleViewDetails(p)}
                      >
                        {/* This will show the name once 'userDetails' is fixed */}
                        {p.userDetails?.name || p.userId?.name || p.name || p.email}
                      </td>
                      <td className="px-6 py-3">
                        {p.classDetails?.name ||
                          p.enrollmentId?.classId?.name || (
                            <span className="text-slate-500">N/A</span>
                          )}
                      </td>
                      <td className="px-6 py-3 text-slate-400">
                        {p.enrollmentId?.classId?.trainer?.name || "--"}
                      </td>
                      <td className="px-6 py-3 font-semibold text-green-400">
                        ${p.amount}
                      </td>
                      <td className="px-6 py-3 text-slate-400">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-6 text-lg font-semibold text-green-400">
              Total Amount: ${totalAmount.toFixed(2)}
            </div>
          </>
        )}
      </div>

      <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />
    </div>
  );
};

export default PaymentHistory;