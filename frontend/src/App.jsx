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
import MeasurementOfEmployee from "./pages/Employee/MeasurementOfEmployee";
import ImageOfEmployee from "./pages/Employee/ImageOfEmployee";
import ManagerDashbroad from "./pages/Manager/ManagerDashbroad";
import EmployeeOfFactory2 from "./pages/Manager/EmployeeOfFactory2";
import ExperimentOfManager from "./pages/Manager/ExperimentOfManager";
import StatisticsByExperimentManager from "./pages/Manager/StatisticsByExperimentManager";
import StatisticsByMeasurementManager from "./pages/Manager/StatisticsByMeasurementManager";
import MeasurementOfManager from "./pages/Manager/MeasurementOfManager";
import ImageOfManager from "./pages/Manager/ImageOfManager";
import ChangePassword from "./pages/Auth/ChangePassword";

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
              <Route
                path="/employee/measurement"
                element={<MeasurementOfEmployee />}
              />
              <Route path="/employee/images" element={<ImageOfEmployee />} />
            </Route>
            {/* Manager Routes */}
            <Route element={<PrivateRoute allowedRoles={["manager"]} />}>
              <Route path="/manager/dashboard" element={<ManagerDashbroad />} />
              <Route
                path="/manager/employee"
                element={<EmployeeOfFactory2 />}
              />
              <Route
                path="/manager/experiment"
                element={<ExperimentOfManager />}
              />
              <Route
                path="/manager/measurement"
                element={<MeasurementOfManager />}
              />
              <Route
                path="/manager/images"
                element={<ImageOfManager />}
              />
              <Route
                path="/manager/statistics/by-experiment"
                element={<StatisticsByExperimentManager />}
              />
              <Route
                path="/manager/statistics/by-measurement"
                element={<StatisticsByMeasurementManager />}
              />
              <Route
                path="/change-password"
                element={<ChangePassword />}
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

  if (user.role === "admin") {
    return <Navigate to="/admin/factory" />;
  } else if (user.role === "manager") {
    return <Navigate to="/manager/dashboard" />;
  } else {
    return <Navigate to="/employee/dashboard" />;
  }
};
