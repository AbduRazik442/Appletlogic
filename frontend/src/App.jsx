import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployee from "./pages/EditEmployee";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/employees" element={<Employees />} />

          <Route path="/employees/add" element={<AddEmployee />} />

          <Route path="/employees/:id/edit" element={<EditEmployee />}/>

          <Route path="/employees/:id" element={<EmployeeDetails />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
