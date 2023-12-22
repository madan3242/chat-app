import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <div className="h-16 w-full shadow-md flex items-center py-2 px-10 justify-between">
      <Link to={"/"}>
        <h1 className="text-2xl font-bold text-slate-600">🤙 Yolo</h1>
      </Link>
      <div>
        <Link to={"/login"}>
          <button className="w-20 p-2 m-2 bg-slate-400 text-slate-50 rounded-lg hover:shadow-lg">
            Login
          </button>
        </Link>
        <Link to={"/signup"}>
          <button className="w-20 p-2 m-2 bg-slate-400 text-slate-50 rounded-lg hover:shadow-lg">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar