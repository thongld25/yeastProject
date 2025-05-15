import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { IoAddOutline } from "react-icons/io5";
import FactoryListTable from "../../components/FactoryListTable";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { createFactory, getFactories } from "../../services/FactoryService";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [factories, setFactories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const fetchFactories = async () => {
    try {
      const factoriesData = await getFactories();
      console.log(factoriesData);
      if (factoriesData.status === 200) {
        setFactories(factoriesData.metadata);
      }
    } catch (error) {
      console.error("Error fetching factories:", error);
      toast.error("Failed to fetch factories");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createFactory(formData.name, formData.location);
      if (res.status === 200) {
        toast.success("Factory created successfully!");
        setFormData({ name: "", location: "" }); // Reset form
        fetchFactories();
      }
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to create factory");
    }
  };

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    fetchFactories();
  }, []);

  return (
    <DashbroardLayout activeMenu="Nhà máy">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold">Tất cả nhà máy</h5>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleOpen}
              >
                <IoAddOutline className="text-lg" />
                Thêm nhà máy
              </button>
              <Dialog open={open} onClose={setOpen} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                    <DialogTitle className="text-xl font-bold text-gray-900 mb-6">
                      Thêm nhà máy
                    </DialogTitle>

                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Tên nhà máy
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Điền tên nhà máy"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Địa chỉ
                          </label>
                          <input
                            type="text"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Điền địa chỉ nhà máy"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Tạo nhà máy
                        </button>
                      </div>
                    </form>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>
            <FactoryListTable tableData={factories || []} />
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default Dashboard;
