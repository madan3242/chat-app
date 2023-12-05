// import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
// import Home from "./components/home/Home"
import Login from "./components/login/Login"
import Signup from "./components/login/Signup"
import Chat from "./components/chat/Chat"

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
// import Home from "./components/home/Home"
import Layout from "./Layout"

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
      {/* <RouterProvider router={routes} /> */}
      <Router>

        <Layout>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Chat />} />
        </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App