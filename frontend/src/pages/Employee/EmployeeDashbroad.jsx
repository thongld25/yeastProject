import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import StatsCard from "../../components/StatsCard";
import {
  BeakerIcon,
  ChartBarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const EmployeeDashboard = () => {
  useUserAuth();

  return (
    <DashbroardLayout activeMenu="Bảng điều khiển">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        <StatsCard
          title="Tổng số thí nghiệm"
          value="100"
          linkText="experiment"
          icon={<BeakerIcon className="w-full h-full" />}
        />

        <StatsCard
          title="Tổng số lần đo"
          value="100"
          linkText="measurement"
          icon={<ChartBarIcon className="w-full h-full" />}
        />

        <StatsCard
          title="Tổng số ảnh"
          value="100"
          linkText="image"
          icon={<PhotoIcon className="w-full h-full" />}
        />
      </div>
    </DashbroardLayout>
  );
};

export default EmployeeDashboard;
