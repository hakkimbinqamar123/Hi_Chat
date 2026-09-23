import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="h-screen hc-bg flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden w-full">
        {showSidebar && (
          <div className="flex-shrink-0 z-40 h-full border-r-4 border-[var(--neo-border)]">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 w-full mx-auto p-4 sm:p-8 overflow-y-auto flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
