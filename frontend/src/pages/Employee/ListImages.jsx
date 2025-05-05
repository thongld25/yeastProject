import React, { use, useContext, useEffect, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { IoAddOutline } from "react-icons/io5";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { UserContext } from "../../context/userContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import ExperimentListTable from "../../components/ExperimentListTable";
import {
  createExperiment,
  getExperimentsOfEmployee,
} from "../../services/ExperimentService";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getImagesOfMeasurement } from "../../services/ImageService";
import ImageListTable from "../../components/ImageListTable";
import { addImage } from "../../services/MeasurementService";

const ListImages = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const { measurementId } = useParams();
  const [formData, setFormData] = useState({
    imageType: "",
    lensType: "",
    images: [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesArray = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prev) => [...prev, ...imagesArray]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const fetchImagesOfMeasurement = async () => {
    try {
      const res = await getImagesOfMeasurement(measurementId);
      console.log(res);
      if (res.status === 200) {
        setImages(res.metadata);
      }
    } catch (error) {
      toast.error("Failed to fetch measurements");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await addImage(
        measurementId,
        selectedImages.map((image) => image.file),
        formData.imageType,
        formData.lensType
      );
      console.log("image data:", formData);
      if (res.status === 200) {
        toast.success("image added!");
        setFormData({ imageType: "", images: [] });
        setSelectedImages([]);
        setOpen(false);
        fetchImagesOfMeasurement();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchImagesOfMeasurement();
  }, []);

  return (
    <DashbroardLayout activeMenu="Thí nghiệm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Danh sách ảnh</h5>
              <button className="card-btn" onClick={() => setOpen(true)}>
                <IoAddOutline className="text-lg" />
                <span className="text-lg">Thêm ảnh</span>
              </button>
            </div>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại ảnh
                        </label>
                        <select
                          id="imageType"
                          value={formData.imageType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">-- Chọn loại ảnh --</option>
                          <option value="thường">Ảnh bình thường</option>
                          <option value="methylene">
                            Ảnh chụp xanh methylene
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại lăng kính
                        </label>
                        <select
                          id="lensType"
                          value={formData.lensType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">-- Chọn loại lăng kính --</option>
                          <option value="thường">Lăng kính bình thường</option>
                          <option value="buồng đếm">
                            Lăng kính buồng đếm
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tải hình ảnh lên
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col w-full h-32 border-4 border-dashed hover:border-gray-300 hover:bg-gray-100 cursor-pointer">
                            <div className="flex flex-col items-center justify-center pt-7">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="pt-1 text-sm tracking-wider text-gray-400">
                                Chọn hoặc kéo thả ảnh
                              </p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="opacity-0"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.preview}
                                alt={`preview ${index}`}
                                className="h-24 w-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          setSelectedImages([]);
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            >
                              {/* Loading spinner SVG */}
                            </svg>
                            Đang thêm...
                          </div>
                        ) : (
                          "Thêm ảnh"
                        )}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </div>
            </Dialog>
            <ImageListTable tableData={images} />
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default ListImages;
