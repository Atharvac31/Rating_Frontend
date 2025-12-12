import Home from './pages/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login.jsx';  
import Signup from './pages/Signup.jsx';
import StoreList from './pages/StoreList.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminUserDetails from './pages/AdminUserDetails.jsx';
import AdminCreateStore from './pages/AdminCreateStore.jsx';
import UserStoreList from './pages/UserStoreList.jsx';
import AdminStoreEdit from './pages/AdminStoreEdit.jsx';
import OwnerStoreList from './pages/OwnerStoreList.jsx';
import OwnerStoreRatings from './pages/OwnerStoreRatings.jsx';
// import AdminStoresList from './pages/AdminStoresList.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserProfile from './pages/UserProfile.jsx';
// import AdminUsersCreateOrRedirectToForm from './pages/AdminUsersCreateOrRedirectToForm.jsx';
function App() {


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stores" element={<StoreList />} />
        
<Route element={<ProtectedRoute allowedRoles={["NORMAL_USER"]} />}>
      <Route path="/user/stores" element={<UserStoreList />} />

      <Route path='/me' element={<UserProfile />} />
   </Route>
<Route element={<ProtectedRoute allowedRoles={["STORE_OWNER"]} />}>
   <Route path="/owner/stores" element={<OwnerStoreList />} />
<Route path="/owner/stores/:storeId/ratings" element={<OwnerStoreRatings />} />
</Route>

  

          <Route element={<ProtectedRoute allowedRoles={["SYSTEM_ADMIN"]} />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
            <Route path="/admin/stores/create" element={<AdminCreateStore />} />
            <Route path="/admin/stores/:id" element={<AdminStoreEdit />} />
           {/* <Route path="/stores" element={<StoreList />} /> */}
        </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
