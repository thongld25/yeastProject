import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { IoAddOutline } from "react-icons/io5";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { createUser, getUserOfFactory } from "../../services/UserService";
import { getFactoryById } from "../../services/FactoryService";
import EmployeeListTable from "../../components/EmployeeListTable";

const EmployeeOfFactory = () => {
  useUserAuth();

  const { factoryId } = useParams();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [factory, setFactory] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "employee", // Mặc định là employee
    birthDate: "",
    gender: "male", // Mặc định là male
  });

  const fetchUsers = async () => {
    try {
      const res = await getUserOfFactory(factoryId);
      console.log(res);
      if (res.status === 200) {
        setEmployees(res.metadata);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const fetchFactory = async () => {
    try {
      const res = await getFactoryById(factoryId);
      if (res.status === 200) {
        setFactory(res.metadata);
      }
    } catch (error) {
      console.error("Error fetching factory:", error);
      toast.error("Failed to fetch factory");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createUser(
        formData.email,
        formData.fullName,
        formData.role,
        factoryId,
        formData.gender,
        formData.birthDate
      );
      toast.success("Employee created successfully!");
      setOpen(false);
      setFormData({
        fullName: "",
        email: "",
        role: "employee",
        birthDate: "",
        gender: "male",
      });
      fetchUsers(); // Refresh danh sách nhân viên
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    fetchUsers();
    fetchFactory();
  }, [factoryId]);

  return (
    <DashbroardLayout activeMenu="Factory">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">All Employee of {factory.name}</h5>
              <button
                className="card-btn flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleOpen}
              >
                <IoAddOutline className="text-lg" />
                <span className="text-lg">Add Employee</span>
              </button>

              {/* Dialog thêm nhân viên */}
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                className="relative z-50"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                    <DialogTitle className="text-xl font-bold text-gray-900 mb-6">
                      Add New Employee
                    </DialogTitle>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email"
                          required
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Role
                        </label>
                        <select
                          id="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                        </select>
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label
                          htmlFor="birthDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formData.gender === "male"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  gender: e.target.value,
                                }))
                              }
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">Male</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formData.gender === "female"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  gender: e.target.value,
                                }))
                              }
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">Female</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 relative ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating...
                          </div>
                        ) : (
                          "Create Employee"
                        )}
                      </button>
                      </div>
                    </form>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>

            {/* Danh sách nhân viên sẽ được thêm vào đây */}
            <EmployeeListTable tableData={employees} />
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default EmployeeOfFactory;
