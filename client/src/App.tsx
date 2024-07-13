import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
// import Loader from "./components/Loader";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

const App = () => {
  const { token, user } = useAuth();
  return (
    <>
      <Layout>
        {/* <Suspense fallback={<Loader />}> */}
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                token && user?._id ? (
                  <Navigate to={"/chat"} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />

            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            <Route path="*" element={<p>404 Page not found</p>} />
          </Routes>
          <Toaster position="top-center" reverseOrder={false} />
        {/* </Suspense> */}
      </Layout>
    </>
  );
};

export default App;
