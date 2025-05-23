import React, { useEffect, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { getEmployeeInFactoryOfManager } from "../../services/UserService";
import EmployeeListTable from "../../components/EmployeeListTable";

const EmployeeOfFactory2 = () => {
  useUserAuth();
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await getEmployeeInFactoryOfManager();
    console.log(res);
    if (res.status === 200) {
      setEmployees(res.metadata);
    } else {
      console.error("Failed to fetch employees");
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  return (
    <DashbroardLayout activeMenu="Nhân viên">
      <div>
        <EmployeeListTable tableData={employees}/>
      </div>
    </DashbroardLayout>
  );
};

export default EmployeeOfFactory2;
