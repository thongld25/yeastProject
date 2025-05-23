import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import StatsCard from "../../components/StatsCard";
import { countingExperimentOfUser } from "../../services/UserService";
import {
  BeakerIcon,
  ChartBarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { LuClipboardCheck, LuContact } from "react-icons/lu";
import { use } from "react";
import { countExperimentOfManager } from "../../services/FactoryService";

const ManagerDashbroad = () => {
  useUserAuth();
  const [countExperiment, setCountExperiment] = useState(0);
  const [countMeasurement, setCountMeasurement] = useState(0);
  const [countImage, setCountImage] = useState(0);
  const [countEmployee, setCountEmployee] = useState(0);

  const fetchData = async () => {
    try {
      const response = await countExperimentOfManager();
      console.log(response);
      if (response.status === 200) {
        setCountExperiment(response.metadata.experimentCount);
        setCountMeasurement(response.metadata.measurementCount);
        setCountImage(response.metadata.imageCount);
        setCountEmployee(response.metadata.employeeCount);
      }
    } catch (error) {
      console.error("Error fetching experiments:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashbroardLayout activeMenu="Bảng điều khiển">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        <StatsCard
          title="Tổng số nhân viên"
          value={countEmployee}
          linkText="employee"
          icon={<LuContact className="w-full h-full" />}
        />
        <StatsCard
          title="Tổng số thí nghiệm"
          value={countExperiment}
          linkText="experiment"
          icon={<BeakerIcon className="w-full h-full" />}
        />

        <StatsCard
          title="Tổng số lần đo"
          value={countMeasurement}
          linkText="measurement"
          icon={<LuClipboardCheck className="w-full h-full" />}
        />

        <StatsCard
          title="Tổng số ảnh"
          value={countImage}
          linkText="images"
          icon={<PhotoIcon className="w-full h-full" />}
        />
      </div>
    </DashbroardLayout>
  );
};

export default ManagerDashbroad;
