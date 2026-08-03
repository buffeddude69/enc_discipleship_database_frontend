import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffRoute from "./components/StaffRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import AddGroup from "./pages/AddGroup";
import EditGroup from "./pages/EditGroup";
import AddMembership from "./pages/AddMembership";
import MembershipDetail from "./pages/MembershipDetail";
import Members from "./pages/Members";
import AddMemberProfile from "./pages/AddMemberProfile";
import EditMemberProfile from "./pages/EditMemberProfile";
import MemberProfile from "./pages/MemberProfile";
import Leaders from "./pages/Leaders";
import ManageLookups from "./pages/ManageLookups";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/groups" replace />} />

              {/* Groups */}
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/new" element={<AddGroup />} />
              <Route path="/groups/:id" element={<GroupDetail />} />
              <Route path="/groups/:id/edit" element={<EditGroup />} />
              <Route path="/groups/:id/add-member" element={<AddMembership />} />
              <Route path="/groups/:id/memberships/:membershipId" element={<MembershipDetail />} />

              {/* Member profiles (shared roster, independent of a single group) */}
              <Route path="/members" element={<Members />} />
              <Route path="/members/new" element={<AddMemberProfile />} />
              <Route path="/members/:id" element={<MemberProfile />} />
              <Route path="/members/:id/edit" element={<EditMemberProfile />} />

              {/* Own profile */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />

              {/* Staff-only */}
              <Route element={<StaffRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaders" element={<Leaders />} />
                <Route path="/manage-lists" element={<ManageLookups />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
