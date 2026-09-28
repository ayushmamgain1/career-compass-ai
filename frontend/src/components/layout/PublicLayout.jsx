import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}