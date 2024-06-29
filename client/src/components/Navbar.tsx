import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChatBubbleOvalLeftIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Profile from "./Profile";

const Navbar: React.FC = () => {
  const { logout, token, user } = useAuth();

  const handleLogout = async () => await logout();

  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <Profile
        open={openProfile}
        onClose={() => {
          setOpenProfile(false)
        }}
      />
      <div className="h-16 w-full shadow-md flex items-center py-2 px-10 justify-between fixed z-20 top-0 bg-purple-100">
        <Link to="/">
          <h1 className="text-2xl font-bold text-purple-600 flex items-center justify-between">
            <ChatBubbleOvalLeftIcon className="h-7 w-7 " /> Mingle
          </h1>
        </Link>

        {token && user?._id ? (
          <>
            <div className="flex items-center justify-center">
              <button 
                className="text-purple-600 p-2 m-2"
                onClick={() => setOpenProfile(true)}
              >
                <UserIcon className="w-8 h-8" />
              </button>
              <button
                onClick={handleLogout}
                className="w-20 p-2 m-2 bg-purple-400 text-white rounded-lg hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Link to={"/login"}>
                <button className="w-20 p-2 m-2 bg-purple-400 text-white rounded-lg hover:shadow-lg">
                  Login
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="w-20 p-2 m-2 bg-purple-400 text-white rounded-lg hover:shadow-lg">
                  Signup
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
