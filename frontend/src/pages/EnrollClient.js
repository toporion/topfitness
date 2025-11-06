// src/pages/EnrollClientPage.jsx

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiLoader, FiCheckCircle, FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

// --- IMPORTANT ---
// Make sure to import your actual hooks from your project files.

import UseAxiosPublic from "../hook/UseAxiosPublic";
import UseAuth from "../hook/UseAuth";
import UseAxiosSecure from "../hook/UseAxiosSecure";
// ---

const EnrollClientPage = () => {
  const { id: classId } = useParams();
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const axiosPublic = UseAxiosPublic();
  const navigate = useNavigate();

  const [classDetails, setClassDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  // Fetch real class details from the API when the component mounts
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await axiosPublic.get(`/get-class/${classId}`);
        console.log(res.data.data)
        setClassDetails(res.data.data);
      } catch (error) {
        console.error("Failed to fetch class details:", error);
        setNotification({
          message: "Could not load class details. Please try again later.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId,]);

  // Handle the form submission to enroll the user
  const onSubmit = async (data) => {
    setNotification({ message: "", type: "" });
    try {
      const payload = {
        classId,
        note: data.note || "",
      };
      const res = await axiosSecure.post("/enroll", payload);

      if (res.data?.success) {
        setNotification({ message: "Success! You are now enrolled.", type: "success" });
        setTimeout(() => navigate(`/admin/myClassList`), 2000);
      } else {
        throw new Error(res.data?.message || "An unknown error occurred.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Server connection failed.";
      setNotification({ message: errorMessage, type: "error" });
    }
  };

  // --- UI STATES ---

  // 1. Loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <FiLoader className="animate-spin text-rose-500 text-4xl" />
        <p className="ml-4 text-slate-400">Loading Class Details...</p>
      </div>
    );
  }

  // 2. Error state if fetching fails
  if (!classDetails) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-slate-800 p-8 rounded-xl border border-slate-700">
          <FiAlertTriangle className="mx-auto text-red-400 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Class</h2>
          <p className="text-slate-400 mb-6">{notification.message}</p>
          <button onClick={() => navigate(-1)} className="bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 3. View for non-logged-in users
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-slate-800 p-8 rounded-xl border border-slate-700">
          <FiAlertTriangle className="mx-auto text-yellow-400 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400 mb-6">You need to be logged in to enroll in a class.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate("/login")} className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 transition-colors">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-600 transition-colors">
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Main enrollment form for logged-in users
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/20">
        <div className="p-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <FiArrowLeft /> Back to Classes
          </button>
          <h1 className="text-4xl font-extrabold text-white mb-2">Confirm Your Enrollment</h1>
          <p className="text-slate-400 mb-8">You are enrolling in the class below as <strong className="text-rose-400">{user.name}</strong>.</p>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-rose-400 uppercase tracking-wider">CLASS</p>
                <h2 className="text-2xl font-bold text-white mt-1">{classDetails.name}</h2>
                <p className="text-slate-400 mt-1">with {classDetails.trainer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-400 uppercase tracking-wider">PRICE</p>
                <p className="text-2xl font-bold text-white mt-1">${classDetails.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-slate-300 mb-2">
                Add a Note (Optional)
              </label>
              <textarea
                id="note"
                {...register("note")}
                placeholder="Any special requirements or information for the trainer..."
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                rows={3}
              />
            </div>

            {notification.message && (
              <div className={`flex items-center gap-3 p-4 rounded-lg text-sm ${notification.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                {notification.type === 'success' ? <FiCheckCircle className="text-xl" /> : <FiAlertTriangle className="text-xl" />}
                <p>{notification.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-rose-600 text-white font-bold text-lg py-4 rounded-lg hover:bg-rose-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" /> Processing Enrollment...
                </>
              ) : (
                "Complete Enrollment"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollClientPage;