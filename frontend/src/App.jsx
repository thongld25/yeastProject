import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import EmployeeDashbroad from "./pages/Employee/EmployeeDashbroad";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import EmployeeOfFactory from "./pages/Admin/EmployeeOfFactory";
import { Toaster } from "react-hot-toast";
import Experiment from "./pages/Employee/Experiment";
import Measurement from "./pages/Employee/Measurement";
import AnalysisImage from "./pages/Employee/AnalysisImage";
import ListImages from "./pages/Employee/ListImages";
import Blog from "./pages/Employee/Blog";
import StatisticsByExperiment from "./pages/Employee/StatisticsByExperiment";
import StatisticsByMeasurement from "./pages/Employee/StatisticsByMeasurement";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/factory" element={<Dashboard />} />
              <Route
                path="/factories/:factoryId"
                element={<EmployeeOfFactory />}
              />
            </Route>

            {/* Employee Routes */}
            <Route element={<PrivateRoute allowedRoles={["employee"]} />}>
              <Route
                path="/employee/dashboard"
                element={<EmployeeDashbroad />}
              />
              <Route path="/employee/experiment" element={<Experiment />} />
              <Route
                path="/experiment/:experimentId"
                element={<Measurement />}
              />
              <Route path="/images/:measurementId" element={<ListImages />} />
              <Route path="/analysis/:imageId" element={<AnalysisImage />} />
              <Route path="/blog" element={<Blog />} />
              <Route
                path="/employee/statistics/by-experiment"
                element={<StatisticsByExperiment />}
              />
              <Route
                path="/employee/statistics/by-measurement"
                element={<StatisticsByMeasurement />}
              />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "15px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/employee/dashboard" />
  );
};
