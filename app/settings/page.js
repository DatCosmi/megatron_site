"use client"
import { RoleProvider } from "../components/context/RoleContext";
import Sidebar from "../components/dashboard/sidebar";
import ProtectedRoute, { token } from "../components/protectedRoute";

function settingsPage() {
  return (
    <RoleProvider>
      <ProtectedRoute>
        <div className="flex h-screen bg-[#eff1f6] ml-60 container-dashboard">
          <Sidebar />
        </div>
      </ProtectedRoute>
    </RoleProvider>
  );
}

export default settingsPage;
