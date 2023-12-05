import React from 'react'

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-96 h-auto bg-gray-300 p-4 px-6 rounded-lg mt-20">
        <h2 className="text-2xl font-bold mx-4">Login</h2>
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
          <button type="submit" className='mb-6 bg-stone-400 w-full p-2 m-4 rounded text-stone-50 hover:bg-stone-500'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login