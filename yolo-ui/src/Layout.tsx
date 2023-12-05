import React from "react";
import Navbar from "./components/navbar/Navbar";

type MyComponentProps = React.PropsWithChildren<{}>;

const Layout = ({ children, ...props }: MyComponentProps) => {
  return (
    <>
      <div className="h-screen max-h-screen">
        <Navbar />
        <div {...props}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
