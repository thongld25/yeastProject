import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { login } from "../../services/AuthService";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError(null);

    try {
      const response = await login(email, password);
      if (response.status === 200) {
        const { accessToken, refreshToken, _id, role } = response.metadata.user;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", _id);
        updateUser(response.metadata.user);

        if (role === "admin") navigate("/admin/factory");
        else if (role === "manager") navigate("/manager/dashboard");
        else if (role === "employee") navigate("/employee/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <p className="text-2xl text-center text-gray-600 mt-2 mb-6">
          Đăng Nhập Hệ Thống
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Mật khẩu"
            placeholder="Tối thiểu 8 kí tự"
            type="password"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
