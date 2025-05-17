import React, { useContext } from "react";
import Navbar from "./Navbar";
import { UserContext } from "../../context/userContext";
import SideMenu from "./SideMenu";

const DashbroardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex flex-1">
          <div className="hidden max-[1080px]:hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <main className="flex-1 overflow-auto px-5 py-4">
            {children}
          </main>
        </div>
      )}
    </div>
  );
};

export default DashbroardLayout;
