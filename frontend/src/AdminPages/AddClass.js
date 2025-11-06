// AddClass.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import UseAxiosSecure from "../hook/UseAxiosSecure";

const AddClass = () => {
  const {register,handleSubmit,reset,watch,formState: { errors, isSubmitting }} = useForm({
    defaultValues: {
      name: "",
      description: "",
      duration: 60,
      price: 0,
      capacity: 10,
      schedule: { day: "", startTime: "", endTime: "" },
      trainerId: "",
      status: "active",
    },
  });

  const [trainers, setTrainers] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverFile = watch("coverImage");
  const axiosSecure = UseAxiosSecure();

  // ✅ Image preview
  useEffect(() => {
    if (coverFile && coverFile.length > 0) {
      const file = coverFile[0];
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCoverPreview(null);
    }
  }, [coverFile]);

  // ✅ Fetch trainers only once
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axiosSecure.get("/getAllStaff");
        const allStaff = res.data.staff || [];
        console.log("All staff:", allStaff);

        // ✅ Filter only active trainers
        const onlyTrainers = allStaff.filter(
          (t) => t.role === "trainer" && t.status === "active" && t.isActive
        );
        console.log("Filtered trainers:", onlyTrainers);

        setTrainers(onlyTrainers);
      } catch (err) {
        console.error("Failed to fetch trainers:", err);
      }
    };
    fetchTrainers();
  }, []);

  // ✅ Submit form
  const onSubmit = async (data) => {
    try {
      const formdata = new FormData();
      Object.keys(data).forEach((key)=>{
        if(key === "coverImage"){
          if(data.coverImage && data.coverImage[0]){
            formdata.append(key, data.coverImage[0]);
          }
        }else{
          formdata.append(key, data[key]);
        }
      })

      const res = await axiosSecure.post("/create-class", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("✅ Class created successfully!");
        reset();
        setCoverPreview(null);
      } else {
        alert("❌ Failed to create class: " + (res.data.message || "unknown"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error creating class");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a001f] to-[#250014] text-white flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-3xl bg-[#120713] p-8 rounded-2xl shadow-2xl border border-violet-700/40">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-violet-300">
          Create / Add Class
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Class Name *
            </label>
            <input
              type="text"
              {...register("name", { required: "Class name is required" })}
              className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 focus:border-violet-400 text-white"
              placeholder="e.g. Power Training"
            />
            {errors.name && (
              <p className="text-sm text-rose-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold text-gray-300">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="3"
              className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 focus:border-violet-400 text-white"
              placeholder="Short description about the class"
            />
          </div>

          {/* Duration, Price, Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-gray-300">Duration (min) *</label>
              <input
                type="number"
                {...register("duration", {
                  required: "Duration required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Min 1 minute" },
                })}
                className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Price must be >= 0" },
                })}
                className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Capacity *</label>
              <input
                type="number"
                {...register("capacity", {
                  required: "Capacity required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Capacity min 1" },
                })}
                className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
              />
            </div>
          </div>

          {/* Trainer select */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Assign Trainer *</label>
            <select
              {...register("trainerId", { required: "Please select a trainer" })}
              className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
            >
              <option value="">-- Select Trainer --</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.skill ? `— ${t.skill}` : ""}
                </option>
              ))}
            </select>
            {errors.trainerId && (
              <p className="text-sm text-rose-400 mt-1">{errors.trainerId.message}</p>
            )}
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-gray-300">Day</label>
              <input
                type="text"
                {...register("schedule.day")}
                placeholder="e.g. Monday"
                className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300">Start Time</label>
              <input
                type="time"
                {...register("schedule.startTime")}
                className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300">End Time</label>
              <input
                type="time"
                {...register("schedule.endTime")}
                className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("coverImage")}
              className="block w-full text-sm text-gray-200 file:bg-transparent file:border-0"
            />
            {coverPreview && (
              <div className="mt-3">
                <img
                  src={coverPreview}
                  alt="cover preview"
                  className="w-48 h-28 object-cover rounded-md border border-violet-700/40"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Status</label>
            <select
              {...register("status")}
              className="w-full p-3 rounded-lg bg-[#2b1233] border border-violet-700/50 text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-700 via-red-600 to-violet-900 hover:opacity-95"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
