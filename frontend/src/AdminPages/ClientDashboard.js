import React from 'react';
import { useQuery } from '@tanstack/react-query';
// import { useAuth } from '../contexts/AuthContext'; // ⚠️ !! Update this path !!
import UseAxiosSecure from '../hook/UseAxiosSecure'; // ⚠️ !! Update this path !!
import { ClipboardCheck, Activity, UserCheck, AlertTriangle } from 'lucide-react';
import UseAuth from '../hook/UseAuth';

/**
 * A reusable card for displaying a plan.
 */
const PlanCard = ({ plan, type }) => {
  const isNutrition = type === 'nutrition';
  const icon = isNutrition ? 
    <ClipboardCheck className="w-8 h-8 text-red-500" /> : 
    <Activity className="w-8 h-8 text-red-500" />;

  return (
    <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700 hover:border-red-600 transition-all duration-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-zinc-900 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{plan.planName}</h3>
          <p className="text-sm text-zinc-400">
            Created: {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-zinc-300 text-sm mb-4">
        {plan.generalNotes || "No general notes provided."}
      </p>
      <button className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
        View Details
      </button>
    </div>
  );
};

/**
 * A card to display the client's assigned trainer.
 */
const TrainerCard = ({ trainer }) => {
  if (!trainer) {
    return null; // Don't show a card if no trainer info is found
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
      <h3 className="text-lg font-semibold text-white mb-4">Your Trainer</h3>
      <div className="flex items-center gap-4">
        <img
          src={trainer.profileImage || `https://placehold.co/64x64/3F3F46/9CA3AF?text=${trainer.name[0]}`}
          alt={trainer.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-zinc-600"
        />
        <div>
          <h4 className="text-xl font-bold text-white">{trainer.name}</h4>
          <p className="text-zinc-400 text-sm">{trainer.email}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * The main Client Dashboard component.
 */
const ClientDashboard = () => {
  const { user } = UseAuth(); // Get the logged-in user
  const axiosSecure = UseAxiosSecure();

  // 1. Fetch Nutrition Plans
  const { data: nutritionPlans = [], isLoading: nutritionLoading } = useQuery({
    queryKey: ['my-nutrition-plans'],
    queryFn: async () => {
      // This route (GET /api/nutrition-plans) is role-based and
      // will automatically return only this client's plans.
      const res = await axiosSecure.get('/nutrition-plans');
      return res.data.data;
    }
  });

  // 2. Fetch Workout Plans
  const { data: workoutPlans = [], isLoading: workoutLoading } = useQuery({
    queryKey: ['my-workout-plans'],
    queryFn: async () => {
      // We assume a 'GET /api/workout-plans' route exists
      // with the same role-based logic as the nutrition one.
      const res = await axiosSecure.get('/workout-plans');
      return res.data.data;
    }
  });

  // 3. Get Trainer Info
  // We can get the trainer's info from the first plan (if it exists)
  const myTrainer = nutritionPlans.length > 0 ? nutritionPlans[0].trainer : (workoutPlans.length > 0 ? workoutPlans[0].trainer : null);

  const isLoading = nutritionLoading || workoutLoading;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>
      <p className="mt-2 text-zinc-300">Welcome back, {user.name}! Here's your plan for today.</p>

      {isLoading && <div className="mt-8 text-zinc-300">Loading your plans...</div>}

      {!isLoading && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content (Left: 2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Nutrition Section */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">My Nutrition</h2>
              {nutritionPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nutritionPlans.map(plan => (
                    <PlanCard key={plan._id} plan={plan} type="nutrition" />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-zinc-500" />
                  <p className="text-zinc-400">You have no nutrition plans assigned yet.</p>
                </div>
              )}
            </div>

            {/* Workout Section */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">My Workouts</h2>
              {workoutPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workoutPlans.map(plan => (
                    <PlanCard key={plan._id} plan={plan} type="workout" />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-zinc-500" />
                  <p className="text-zinc-400">You have no workout plans assigned yet.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar (Right: 1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <TrainerCard trainer={myTrainer} />

            <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-zinc-200">
                  <span>Active Nutrition Plans:</span>
                  <span className="font-bold">{nutritionPlans.length}</span>
                </div>
                <div className="flex justify-between text-zinc-200">
                  <span>Active Workout Plans:</span>
                  <span className="font-bold">{workoutPlans.length}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
