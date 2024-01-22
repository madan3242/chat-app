import React from 'react'
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center bg-blue-50"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="w-96 h-auto bg-blue-200 p-4 px-6 rounded-lg">
        <h2 className="text-2xl font-bold mx-4 text-blue-500">Login</h2>
        <form action="" className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 m-4 mb-6 rounded"
          />
          <input
            type="text"
            placeholder="Password"
            className="w-full p-2 m-4 mb-6 rounded"
          />
          <button
            type="submit"
            className="mb-3 bg-blue-400 w-full p-2 m-4 rounded text-white hover:bg-blue-500"
          >
            Login
          </button>
          <div>
            <p className='mb-3'>Don't have account? <Link to={'/signup'}>Signup</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login