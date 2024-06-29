import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup: React.FC = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // const [showPassword, setShowPassword] = useState(false);

  // Access signup function from  auth context
  const { signup } = useAuth();

  // Handle data change for input fields
  const handleChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };

  //Handle signup
  const handleSignup = async () => await signup(data);

  return (
    <div className="w-screen h-screen relative flex items-center justify-center bg-purple-50">
      <div className="w-full h-auto bg-purple-200 p-4 px-6 rounded-lg md:w-96">
        <h2 className="text-2xl font-bold mx-4 text-purple-500">Signup</h2>
        <div className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="User Name"
            className="w-full p-2 m-4 mb-6 rounded"
            value={data.username}
            onChange={handleChange("username")}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 m-4 mb-6 rounded"
            value={data.email}
            onChange={handleChange("email")}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 m-4 mb-6 rounded"
            value={data.password}
            onChange={handleChange("password")}
          />
          <button
            // type="submit"
            className="mb-3 bg-purple-400 w-full p-2 m-4 rounded text-white hover:bg-purple-500 disabled:bg-purple-400/50"
            disabled={Object.values(data).some((val) => !val)}
            onClick={handleSignup}
          >
            Signup
          </button>

          <div>
            <p className="mb-3 text-purple-600">
              Already have an account?{" "}
              <Link className="hover:text-purple-700" to={"/login"}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
