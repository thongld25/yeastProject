import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import {
  SIDE_MENU_DATA,
  SIDE_MENU_USER_DATA,
  SIDE_MENU_MANAGER_DATA,
} from "../../utils/data";
import AVATAR_IMG from "../../assets/images/avatar.jpg";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const toggleSubMenu = (id) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (user) {
      // const menu =
      //   user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;
      // setSideMenuData(menu);
      let menu = [];
      if (user?.role === "admin") {
        menu = SIDE_MENU_DATA;
      } else if (user?.role === "employee") {
        menu = SIDE_MENU_USER_DATA;
      } else {
        menu = SIDE_MENU_MANAGER_DATA;
      }
      setSideMenuData(menu);

      // Tự mở menu cha nếu activeMenu là một submenu
      const foundParent = menu.find((item) =>
        item.children?.some((child) => child.label === activeMenu)
      );
      if (foundParent) {
        setOpenMenuId(foundParent.id);
      }
    }
  }, [user, activeMenu]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justyfy-center mb-7 pt-5">
        <div className="relative">
          <img
            src={AVATAR_IMG}
            alt="Profile"
            className="w-15 h-15 bg-slate-400 rounded-full"
          />
        </div>
        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <div key={`menu_${index}`} className="w-full">
          <button
            className={`w-full flex items-center justify-between text-left gap-4 text-[15px] ${
              activeMenu === item.label
                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                : ""
            } py-3 px-6 mb-1 cursor-pointer`}
            onClick={() => {
              if (item.children) {
                toggleSubMenu(item.id);
              } else {
                handleClick(item.path);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.label}
            </div>

            {item.children && (
              <span className="text-gray-500">
                {openMenuId === item.id ? "▾" : "▸"}
              </span>
            )}
          </button>

          {item.children && openMenuId === item.id && (
            <div className="ml-10 transition-all duration-200">
              {item.children.map((subItem, subIndex) => (
                <button
                  key={`submenu_${subIndex}`}
                  className={`w-full text-left text-[14px] text-gray-700 hover:text-primary py-2 px-4 ${
                    activeMenu === subItem.label
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                  onClick={() => handleClick(subItem.path)}
                >
                  • {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
