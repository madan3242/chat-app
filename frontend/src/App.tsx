// import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { Suspense } from "react"
import { Toaster } from "react-hot-toast";

import Navbar from "./components/navbar/Navbar"
import Chat from "./components/chat/Chat"
import Login from "./components/login/Login"
import Signup from "./components/login/Signup"
import Loading from "./components/loading/Loading"

// const routes = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<Layout />}>
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/chat" element={<Chat />} />
//     </Route>
//   )
// )

const App = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="h-screen max-h-screen overflow-hidden">
        {/* <RouterProvider router={routes} /> */}
        <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </Suspense>
    </>
  );
}

export default App