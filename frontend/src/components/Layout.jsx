import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen hc-bg">
      <div className="flex relative z-10">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
