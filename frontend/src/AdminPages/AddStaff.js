import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaUserPlus, FaUserTie, FaIdCard, FaFileAlt } from 'react-icons/fa';
import UseAxiosSecure from '../hook/UseAxiosSecure'; // Your custom hook

const AddStaff = () => {
    const axiosSecure = UseAxiosSecure();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            status: "active", // Default status as per schema
            role: "staff"      // Default role as per schema
        }
    });

    const onSubmit = async (data) => {
        const loadingToast = toast.loading('Adding new staff member...');
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'profileImage') {
                if (data.profileImage && data.profileImage[0]) {
                    formData.append(key, data.profileImage[0]);
                }
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            const response = await axiosSecure.post('/addStaff', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.success('Staff Member Added Successfully!', { id: loadingToast });
                reset();
            } else {
                toast.error(response.data.message || 'An error occurred.', { id: loadingToast });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Server error. Please try again.';
            toast.error(errorMessage, { id: loadingToast });
            console.error("Failed to add staff:", error);
        }
    };
    
    // Reusable styles
    const inputStyle = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200";
    const labelStyle = "block text-sm font-medium text-gray-400 mb-2";
    const errorStyle = "text-red-400 text-xs mt-1";
    const sectionTitleStyle = "text-xl font-semibold text-red-400 border-b-2 border-gray-700 pb-2 mb-6 flex items-center gap-3";

    return (
        <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-white">
            <div className="max-w-6xl mx-auto bg-gray-800/50 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-700">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-red-500 flex items-center justify-center gap-3">
                        <FaUserPlus /> Register New Staff
                    </h1>
                    <p className="text-gray-400 mt-2">Onboard a new member to the team with all their details.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* SECTION: Core Credentials */}
                    <section>
                        <h2 className={sectionTitleStyle}><FaIdCard /> Core Credentials</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="name" className={labelStyle}>Full Name</label>
                                <input id="name" type="text" className={inputStyle} {...register("name", { required: "Full name is required." })} />
                                {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className={labelStyle}>Email Address</label>
                                <input id="email" type="email" className={inputStyle} {...register("email", { required: "Email is required." })} />
                                {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className={labelStyle}>Password</label>
                                <input id="password" type="password" className={inputStyle} {...register("password", { required: "Password is required.", minLength: { value: 6, message: "Password must be at least 6 characters." } })} />
                                {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                            </div>
                        </div>
                    </section>

                    {/* SECTION: Professional Details */}
                    <section>
                        <h2 className={sectionTitleStyle}><FaUserTie /> Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="role" className={labelStyle}>Role</label>
                                <select id="role" className={inputStyle} {...register("role", { required: "Role is required." })}>
                                    <option value="staff">Staff</option>
                                    <option value="trainer">Trainer</option>
                                    <option value="manager">Manager</option>
                                    <option value="accountant">Accountant</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className={errorStyle}>{errors.role.message}</p>}
                            </div>
                             <div>
                                <label htmlFor="department" className={labelStyle}>Department</label>
                                <input id="department" type="text" placeholder="e.g., Fitness, Front Desk" className={inputStyle} {...register("department")} />
                            </div>
                            <div>
                                <label htmlFor="Skill" className={labelStyle}>Primary Skill</label>
                                <select id="Skill" className={inputStyle} {...register("skill")}>
                                    <option value="">Select Skill (if trainer)</option>
                                    <option value="yoga">Yoga</option>
                                    <option value="power training">Power Training</option>
                                    <option value="zumba">Zumba</option>
                                    <option value="cycling">Cycling</option>
                                    <option value="cardio">Cardio</option>
                                    <option value="meditation">Meditation</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="salary" className={labelStyle}>Salary (Monthly)</label>
                                <input id="salary" type="number" step="0.01" className={inputStyle} {...register("salary")} />
                            </div>
                            <div>
                                <label htmlFor="hireDate" className={labelStyle}>Hire Date</label>
                                <input id="hireDate" type="date" className={inputStyle} {...register("hireDate")} />
                            </div>
                             <div>
                                <label htmlFor="experience" className={labelStyle}>Experience (Years)</label>
                                <input id="experience" type="number" defaultValue={0} className={inputStyle} {...register("experience", { min: { value: 0, message: "Experience cannot be negative." } })} />
                                 {errors.experience && <p className={errorStyle}>{errors.experience.message}</p>}
                            </div>
                        </div>
                    </section>
                    
                     {/* SECTION: Personal Information */}
                    <section>
                        <h2 className={sectionTitleStyle}><FaUserPlus /> Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="phone" className={labelStyle}>Phone Number</label>
                                <input id="phone" type="tel" className={inputStyle} {...register("phone", { required: "Phone number is required." })} />
                                {errors.phone && <p className={errorStyle}>{errors.phone.message}</p>}
                            </div>
                             <div>
                                <label htmlFor="gender" className={labelStyle}>Gender</label>
                                <select id="gender" className={inputStyle} {...register("gender", { required: "Gender is required." })}>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className={errorStyle}>{errors.gender.message}</p>}
                            </div>
                             <div>
                                <label htmlFor="age" className={labelStyle}>Age</label>
                                <input id="age" type="number" className={inputStyle} {...register("age", { min: { value: 18, message: "Age must be at least 18." } })} />
                                {errors.age && <p className={errorStyle}>{errors.age.message}</p>}
                            </div>
                             {/* Address spanning two columns */}
                            <div className="lg:col-span-3">
                                <label htmlFor="address" className={labelStyle}>Address</label>
                                <input id="address" type="text" className={inputStyle} {...register("address")} />
                            </div>
                        </div>
                    </section>

                    {/* SECTION: Status and Media */}
                     <section>
                        <h2 className={sectionTitleStyle}><FaFileAlt /> Status & Media</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="status" className={labelStyle}>Account Status</label>
                                <select id="status" className={inputStyle} {...register("status")}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="lg:col-span-2">
                                <label htmlFor="profileImage" className={labelStyle}>Profile Image</label>
                                <input id="profileImage" type="file" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 transition cursor-pointer" accept="image/*" {...register("profileImage")} />
                            </div>
                         </div>
                    </section>

                    {/* Description spanning full width */}
                    <div>
                        <label htmlFor="description" className={labelStyle}>Description / Bio</label>
                        <textarea id="description" rows="4" className={inputStyle} placeholder="Add a short bio or notes about the staff member..." {...register("description")}></textarea>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold text-lg focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105">
                            Add Staff Member to System
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;