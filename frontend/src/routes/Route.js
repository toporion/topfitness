import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import Dashboard from "../layout/Dashboard";
import AdminHome from "../AdminPages/AdminHome";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AddStaff from "../AdminPages/AddStaff";
import GetAllEmployeeInfo from "../AdminPages/GetAllEmployeeInfo";
import PracticeGetEmployee from "../AdminPages/PracticeGetEmployee";
import PrivateRoute from "./PrivateRoute";
import AddClass from "../AdminPages/AddClass";
import SingleClassInfo from "../pages/SingleClassInfo";
import ClientCreate from "../pages/ClientCreate";
import EnrollClient from "../pages/EnrollClient";
import MyClassList from "../AdminPages/MyClassList";
import PaymentSuccess from "../AdminPages/PaymentSuccess";
import PaymentHistory from "../AdminPages/PaymentHistory";
import NutritionPlanForm from "../AdminPages/NutritionPlanForm";
import WorkoutPlanCreate from "../AdminPages/WorkoutPlanCreate";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/register', element: <Register/> },
      { path: '/login', element: <Login/> },
      { path: '/singleClassInfo/:id', element: <SingleClassInfo/> },
      { path: '/client-create', element: <ClientCreate/>},
    ]
  },
  {
    path: 'admin',
    element: <PrivateRoute allowedRoles={['admin', 'manager', 'trainer', 'staff','client']}><Dashboard /></PrivateRoute>,
    children: [
      { path: '', element: <AdminHome /> },
      { path: 'add-staff', element: <AddStaff/> },
      { path: 'getAllStaff', element: <GetAllEmployeeInfo/> },
      { path: 'ptacticeGetAllStaff', element: <PracticeGetEmployee/> },
      { path: 'add-class', element: <AddClass/> },
      { path: 'enroll-class/:id', element: <EnrollClient/> },
      { path: 'myClassList', element: <MyClassList/> },
      { path: 'payment-success', element: <PaymentSuccess/>},
      { path: 'payment-history', element: <PaymentHistory/>},
      { path: 'nutrion-plan', element: <NutritionPlanForm/>},
      { path: 'workout-plan', element: <WorkoutPlanCreate/>},
    ]
  }
]);
export default router;