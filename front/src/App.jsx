import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './store/thunks/userThunks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Sidebar from './components/layout/Sidebar';
import LoadingIndicator from './components/layout/LoadingIndicator';
import DebugBar from './components/debug/DebugBar';

// Routes
import { routes } from './routes/Routes';

// Layout component
const Layout = () => {
  const { isOpen } = useSidebar();
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-800 to-black">
      <div 
        className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" 
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent, black)', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' 
        }} 
      />
      {process.env.NODE_ENV === 'development' && <DebugBar />}
      <Sidebar />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${isOpen ? 'ml-56' : 'ml-16'}`}>
        <div className="p-4 max-w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: routes,
  }
]);

function App() {
  const dispatch = useDispatch();
  const initialized = useSelector(state => state.auth.initialized);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  if (!initialized) {
    return <LoadingIndicator />;
  }

  return (
    <SidebarProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </SidebarProvider>
  );
}

export default App;
