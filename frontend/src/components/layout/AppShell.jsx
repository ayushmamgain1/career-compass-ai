import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { closeSidebar } from "../../features/ui/uiSlice";

export default function AppShell() {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="lg:hidden fixed inset-0 z-40 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => dispatch(closeSidebar())} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10"
            >
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}