import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup: React.FC = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { signup } = useAuth();

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [name]: e.target.value
    });
  };

  const handleSignup = async () => await signup(data);

  return (
    <div
      className="flex items-center justify-center bg-blue-50"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="w-96 h-auto bg-blue-200 p-4 px-6 rounded-lg">
        <h2 className="text-2xl font-bold mx-4 text-blue-500">Signup</h2>
        <form action="" className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="User Name"
            className="w-full p-2 m-4 mb-6 rounded"
            value={data.username}
            onChange={handleChange("username")}
          />
          <input
            type="text"
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
            type="submit"
            className="mb-3 bg-blue-400 w-full p-2 m-4 rounded text-white hover:bg-blue-500"
            disabled={Object.values(data).some((val) => !val)}
            onClick={handleSignup}
          >
            Signup
          </button>
          <div>
            <p className="mb-3">
              Already have an account? <Link to={"/login"}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
