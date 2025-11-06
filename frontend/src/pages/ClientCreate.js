import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import UseAxiosPublic from "../hook/UseAxiosPublic"; // Assuming this custom hook is in your project
import banner from "../assets/logi2.jpg"; // Using your imported banner image
import { useNavigate } from "react-router-dom";
import UseAxiosPublic from "../hook/UseAxiosPublic";

// --- Mock Hook for demonstration since the original is not provided ---
// You can remove this and uncomment your original import above.

// --- End of Mock Hook ---


const ClientCreate = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const axiosPublic = UseAxiosPublic();
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Watch for changes in the profileImage file input
  const profileImageFile = watch("profileImage");

  useEffect(() => {
    if (profileImageFile && profileImageFile.length > 0) {
      // Create a URL for the selected file to use as a preview
      const file = profileImageFile[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
        // If no file is selected, don't show a preview
        setImagePreview(null);
    }
    // Note: For larger applications, you might want to revoke the object URL on unmount
    // to free up memory, but for a form, this is generally fine.
  }, [profileImageFile]);


  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'profileImage') {
            formData.append(key, data[key]);
        }
      });

      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const res = await axiosPublic.post("/addClient", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        console.log("Client profile created successfully", res.data);
        alert("Client profile created successfully!");
        reset();
        setImagePreview(null);
        navigate('/login');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create client profile");
    }
  };

  return (
    <div 
      className="min-h-screen text-gray-100 flex items-center justify-center p-4 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${banner})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm"></div>

      {/* Form Container - set to relative to appear above the overlay */}
      <div className="relative max-w-4xl w-full mx-auto bg-gray-800/70 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden">
        
        {/* Form Section */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wider" style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.8)' }}>
              Forge Your Strength
            </h1>
            <p className="text-red-400 mt-2 text-lg">Join us and start your transformation today.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
              
              {/* Left Side: Image Upload */}
              <div className="flex flex-col items-center justify-center space-y-4 mb-6 lg:mb-0">
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                <div className="w-64 h-64 rounded-full bg-gray-700/50 flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden">
                  {imagePreview ? (
                     <img src={imagePreview} alt="Profile Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        <p className="mt-1 text-sm">Preview</p>
                    </div>
                  )}
                </div>
                 <label htmlFor="file-upload" className="cursor-pointer bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105">
                    <span>Upload Photo</span>
                    <input id="file-upload" {...register("profileImage")} type="file" className="sr-only" accept="image/png, image/jpeg, image/gif"/>
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>

              {/* Right Side: Form Fields */}
              <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="name">Name</label>
                          <input id="name" {...register("name")} placeholder="e.g., Alex Johnson" className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all" required />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">Email</label>
                          <input id="email" {...register("email")} type="email" placeholder="you@example.com" className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all" required />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">Password</label>
                      <input id="password" {...register("password")} type="password" placeholder="••••••••" className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all" required />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="address">Address</label>
                      <input id="address" {...register("address")} placeholder="123 Fitness Ave, Iron City" className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="gender">Gender</label>
                          <select id="gender" {...register("gender")} className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all appearance-none">
                              <option value="" className="bg-gray-800">Select Gender</option>
                              <option value="male" className="bg-gray-800">Male</option>
                              <option value="female" className="bg-gray-800">Female</option>
                              <option value="other" className="bg-gray-800">Other</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="age">Age</label>
                          <input id="age" {...register("age")} type="number" placeholder="e.g., 25" className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="phone">Phone</label>
                      <input id="phone" {...register("phone")} placeholder="+1 234 567 890" className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-200 transition-all" />
                  </div>
              </div>

              {/* Submit Button (Spanning both columns) */}
               <div className="lg:col-span-2 mt-6">
                 <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50">
                    Create Profile
                 </button>
               </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientCreate;

