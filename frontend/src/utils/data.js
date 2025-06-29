import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuFactory,
  LuBookOpen,
  LuChartColumnBig,
  LuContact,
  LuUserPen
} from "react-icons/lu";

import {
  BeakerIcon,
  ChartBarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Nhà máy",
    icon: LuFactory,
    path: "/admin/factory",
  },
  {
    id: "02",
    label: "Đổi mật khẩu",
    icon: LuUserPen,
    path: "/change-password",
  },
  {
    id: "03",
    label: "Đăng xuất",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Bảng điều khiển",
    icon: LuLayoutDashboard,
    path: "/employee/dashboard",
  },
  {
    id: "02",
    label: "Bài viết",
    icon: LuBookOpen,
    path: "/blog",
  },
  {
    id: "03",
    label: "Thí nghiệm",
    icon: BeakerIcon,
    path: "/employee/experiment",
  },
  {
    id: "04",
    label: "Lần đo",
    icon: LuClipboardCheck,
    path: "/employee/measurement",
  },
  { id: "05", label: "Hình ảnh", icon: PhotoIcon, path: "/employee/images" },
  {
    id: "06",
    label: "Thống kê",
    icon: LuChartColumnBig,
    children: [
      {
        id: "06-1",
        label: "Theo thí nghiệm",
        path: "/employee/statistics/by-experiment",
      },
      {
        id: "06-2",
        label: "Theo lần đo",
        path: "/employee/statistics/by-measurement",
      },
    ],
  },
    {
    id: "07",
    label: "Đổi mật khẩu",
    icon: LuUserPen,
    path: "/change-password",
  },
  {
    id: "08",
    label: "Đăng xuất",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const SIDE_MENU_MANAGER_DATA = [
  {
    id: "01",
    label: "Bảng điều khiển",
    icon: LuLayoutDashboard,
    path: "/manager/dashboard",
  },
  {
    id: "02",
    label: "Nhân viên",
    icon: LuContact,
    path: "/manager/employee",
  },
  {
    id: "03",
    label: "Thí nghiệm",
    icon: BeakerIcon,
    path: "/manager/experiment",
  },
  {
    id: "04",
    label: "Lần đo",
    icon: LuClipboardCheck,
    path: "/manager/measurement",
  },
  { id: "05", label: "Hình ảnh", icon: PhotoIcon, path: "/manager/images" },
  {
    id: "06",
    label: "Thống kê",
    icon: LuChartColumnBig,
    children: [
      {
        id: "06-1",
        label: "Theo thí nghiệm",
        path: "/manager/statistics/by-experiment",
      },
      {
        id: "06-2",
        label: "Theo lần đo",
        path: "/manager/statistics/by-measurement",
      },
    ],
  },
    {
    id: "07",
    label: "Đổi mật khẩu",
    icon: LuUserPen,
    path: "/change-password",
  },
  {
    id: "08",
    label: "Đăng xuất",
    icon: LuLogOut,
    path: "/logout",
  },
];
