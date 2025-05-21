import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuFactory,
  LuBookOpen,
  LuChartColumnBig,
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
  { id: "05", label: "Hình ảnh", icon: PhotoIcon, path: "/employee/image" },
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
    label: "Đăng xuất",
    icon: LuLogOut,
    path: "/logout",
  },
];
