import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../hook/UseAxiosSecure'; // Adjust path if needed
import { PlusCircle, XCircle, Search, X } from 'lucide-react';

const fitnessBgUrl = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';

// --- Helper components (FormInput, FormSelect, FormTextarea) ---
// (These are unchanged from the previous code)
const FormInput = ({ label, name, register, errors, type = 'text', ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-medium text-zinc-300">
      {label}
    </label>
    <input
      id={name}
      type={type}
      {...register(name)}
      {...props}
      className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200"
    />
    {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>}
  </div>
);

const FormSelect = ({ label, name, register, errors, children, ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-medium text-zinc-300">
      {label}
    </label>
    <select
      id={name}
      {...register(name)}
      {...props}
      className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200"
    >
      {children}
    </select>
    {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>}
  </div>
);

const FormTextarea = ({ label, name, register, errors, ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-medium text-zinc-300">
      {label}
    </label>
    <textarea
      id={name}
      {...register(name)}
      {...props}
      rows="4"
      className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200"
    />
    {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>}
  </div>
);
// --- End Helper Components ---


// --- MAIN COMPONENT ---
const NutritionPlanForm = () => {
  const axiosSecure = UseAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // --- State for the new Searchable Dropdown ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState('');
  // --- (No debounce needed) ---

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      planName: '',
      client: '', 
      generalNotes: '',
      planDetails: [
        { day: 'Monday', mealType: 'Breakfast', details: '' }
      ]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'planDetails',
  });

  // ✅ --- THIS IS THE FRONTEND FIX ---
  // We fetch the *full client list* as soon as the dropdown is opened
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['my-clients-list'], // Only one query
    queryFn: async () => {
      // Calls your GET /api/my-clients route (with no search)
      const res = await axiosSecure.get('/my-clients');
      return res.data.data;
    },
    enabled: showResults, // 💡 KEY CHANGE: Only fetch when the user clicks the input
  });
  // ✅ --- END OF FIX ---

  // Now, we filter the list *locally* based on the search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    if (!data.client) {
      setServerError("Please select a client from the search results.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('planName', data.planName);
    formData.append('client', data.client);
    formData.append('generalNotes', data.generalNotes);
    formData.append('planDetails', JSON.stringify(data.planDetails));

    if (data.foodImage && data.foodImage[0]) {
      formData.append('foodImage', data.foodImage[0]);
    }

    try {
      const res = await axiosSecure.post('/nutrion-plan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage(res.data.message || 'Plan created successfully!');
      reset(); 
      setSearchTerm(''); 
      setSelectedClientName('');
    } catch (error) {
      setServerError(error.response?.data?.error || 'Failed to create plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectClient = (client) => {
      setValue('client', client._id, { shouldValidate: true }); 
      setSearchTerm(client.name); 
      setSelectedClientName(client.name);
      setShowResults(false); 
  };
  
  const clearSelection = () => {
      setValue('client', '', { shouldValidate: true });
      setSearchTerm('');
      setSelectedClientName('');
      setShowResults(true); // Re-open the list
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-8 flex items-center justify-center bg-zinc-900"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${fitnessBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-6xl bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl border-t-4 border-red-600 overflow-hidden backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Create Nutrition Plan
          </h1>
          <p className="text-zinc-400 mb-8">
            Build a custom plan and assign it to one of your enrolled clients.
          </p>

          {serverError && <div className="p-3 bg-red-800 text-red-100 rounded-lg mb-6">{serverError}</div>}
          {successMessage && <div className="p-3 bg-green-800 text-green-100 rounded-lg mb-6">{successMessage}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- LEFT COLUMN: Main Details --- */}
            <div className="flex flex-col gap-6">
              <FormInput
                label="Plan Name"
                name="planName"
                register={register}
                errors={errors}
                placeholder="e.g., Summer Shred Phase 1"
                required
              />

              {/* --- SEARCHABLE DROPDOWN --- */}
              <div className="flex flex-col relative">
                <label htmlFor="clientSearch" className="mb-2 text-sm font-medium text-zinc-300">
                  Assign to Client
                </label>
                <div className="relative">
                  <input
                    id="clientSearch"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if(selectedClientName) clearSelection(); // Clear selection if user types again
                      setShowResults(true); // Keep list open while typing
                    }}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    placeholder="Click to see list or type to search..."
                    autoComplete="off"
                    // We don't disable, we just clear the selection if they type
                  />
                  {selectedClientName ? (
                      <button type="button" onClick={clearSelection} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <X className="h-5 w-5 text-zinc-400 hover:text-red-500" />
                      </button>
                  ) : (
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <Search className="h-5 w-5 text-zinc-400" />
                      </span>
                  )}
                </div>
                
                {/* This is the list that shows on click/search */}
                {showResults && !selectedClientName && (
                  <div className="absolute z-10 w-full mt-1 top-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {clientsLoading && <div className="px-4 py-2 text-sm text-zinc-400">Loading your clients...</div>}
                      
                      {!clientsLoading && filteredClients.length === 0 && (
                          <div className="px-4 py-2 text-sm text-zinc-400">
                            {clients.length > 0 ? `No clients found for "${searchTerm}"` : "You have no enrolled clients."}
                          </div>
                      )}
                      
                      {/* We map over the LOCALLY filtered list */}
                      {filteredClients.map(client => (
                          <div
                              key={client._id}
                              onMouseDown={() => handleSelectClient(client)} // Use onMouseDown to fire before onBlur
                              className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 cursor-pointer flex items-center"
                          >
                              <img 
                                src={client.profileImage || `https://placehold.co/40x40/3F3F46/9CA3AF?text=${client.name[0]}`} 
                                alt={client.name} 
                                className="w-6 h-6 rounded-full mr-2 object-cover"
                              />
                              {client.name} <span className="text-zinc-500 ml-2">({client.email})</span>
                          </div>
                      ))}
                  </div>
                )}
                
                <input
                    type="hidden"
                    {...register('client', { required: 'Please select a client from the list.' })}
                />
                {errors.client && <p className="mt-1 text-sm text-red-500">{errors.client.message}</p>}
              </div>
              {/* --- END SEARCHABLE DROPDOWN --- */}

              <FormTextarea
                label="General Notes"
                name="generalNotes"
                register={register}
                errors={errors}
                placeholder="e.g., Drink 3L of water, avoid sugary drinks..."
              />
              
              <div>
                <label htmlFor="foodImage" className="mb-2 text-sm font-medium text-zinc-300 block">
                  Cover Image (Optional)
                </label>
                <input
                  type="file"
                  id="foodImage"
                  {...register('foodImage')}
                  className="block w-full text-sm text-zinc-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-600 file:text-white
                    hover:file:bg-red-700 transition"
                />
              </div>
            </div>

            {/* --- RIGHT COLUMN: Dynamic Meal Plan --- */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white mb-2">Detailed Meal Plan</h2>
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 relative">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 transition"
                    >
                      <XCircle size={20} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormSelect
                        label="Day"
                        name={`planDetails.${index}.day`}
                        register={register}
                        errors={errors}
                        defaultValue={item.day}
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </FormSelect>
                      
                      <FormSelect
                        label="Meal Type"
                        name={`planDetails.${index}.mealType`}
                        register={register}
                        errors={errors}
                        defaultValue={item.mealType}
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                      </FormSelect>
                    </div>
                    
                    <div className="mt-4">
                      <FormTextarea
                        label="Food & Details"
                        name={`planDetails.${index}.details`}
                        register={register}
                        errors={errors}
                        placeholder="e.g., 100g Chicken, 150g Rice, 1 cup Broccoli"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => append({ day: 'Monday', mealType: 'Breakfast', details: '' })}
                className="flex items-center justify-center gap-2 w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                <PlusCircle size={20} />
                Add Meal
              </button>
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <div className="mt-10 pt-6 border-t border-zinc-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create & Assign Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NutritionPlanForm;

