import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RewardsRedemption from './components/RewardsRedemption';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import LandingPage from './components/LandingPage';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminAuthenticated(false);
  };

  return (
    <Router>
      <Routes>


         <Route path="/rewards-redemption" element={<RewardsRedemption/>} />
          <Route path="/" element={<LandingPage/>} />
        
        
        <Route
          path="/admin/login"
          element={
            isAdminAuthenticated ?
            <Navigate to="/admin/dashboard" /> :
            <AdminLogin onLogin={setIsAdminAuthenticated} />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            isAdminAuthenticated ?
            <AdminPanel onLogout={handleLogout} /> :
            <Navigate to="/admin/login" />
          }
        />
      </Routes>
    </Router>
  );
}

// // export default App;
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LandingPage from './components/LandingPage';
// import RewardsRedemption from './components/RewardsRedemption';
// import AdminPanel from './components/AdminPanel';
// import AdminLogin from './components/AdminLogin';

// function App() {
//   const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
//     !!localStorage.getItem('adminToken')
//   );

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     setIsAdminAuthenticated(false);
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Landing Page as default route */}
//         <Route path="/" element={<LandingPage />} />
        
//         {/* Rewards Redemption Form with service type parameter */}
//         <Route path="/rewards-redemption/:serviceType" element={<RewardsRedemption />} />
//         <Route path="/rewards-redemption" element={<RewardsRedemption />} />
        
//         {/* Admin Routes */}
//         <Route
//           path="/admin/login"
//           element={
//             isAdminAuthenticated ?
//             <Navigate to="/admin/dashboard" /> :
//             <AdminLogin onLogin={setIsAdminAuthenticated} />
//           }
//         />
//         <Route
//           path="/admin/dashboard"
//           element={
//             isAdminAuthenticated ?
//             <AdminPanel onLogout={handleLogout} /> :
//             <Navigate to="/admin/login" />
//           }
//         />
        
//         {/* Redirect any unknown routes to home */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

export default App;