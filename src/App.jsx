import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Promotions from './components/Promotions';
import UserPromotions from './components/UserPromotions';
import Profile from './components/Profile';
import RootLayout from './layouts/RootLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';
import NewBigPromotions from './components/NewBigPromotions';
import PromotionInfo from './components/PromotionInfo';
import BigPromotionInfo from './components/BigPromotionInfo';
import Confirmation from './components/Confirmation';

// dashboard imports
import { Space } from 'antd';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import AppRoutes from './components/AppRoutes';
import SideMenu from './components/SideMenu';
import PageContent from './components/PageContent';
import './App.css';

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Promotions />} />
      <Route
        path='/mypromotions'
        element={
          <PrivateRoute>
            <UserPromotions />
          </PrivateRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path='/promotioninfo'
        element={
          <PrivateRoute>
            <PromotionInfo />
          </PrivateRoute>
        }
      />
      <Route
        path='/newbigpromotions'
        element={
          <PrivateRoute>
            <NewBigPromotions />
          </PrivateRoute>
        }
      />
      <Route
        path='/bigpromotioninfo'
        element={
          <PrivateRoute>
            <BigPromotionInfo />
          </PrivateRoute>
        }
      />
      <Route
        path='/confirmation'
        element={
          <PrivateRoute>
            <Confirmation />
          </PrivateRoute>
        }
      />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
    </Route>
    
  )
);

function App() {
  return (
    <div className="App">
      <AppHeader />
      <Space>
        <SideMenu></SideMenu>
        <PageContent></PageContent>
      </Space>
      <AppFooter />
    </div>

    // Original code to route:
    // <AuthProvider>
    //   <RouterProvider router={router} />
    // </AuthProvider>
  );
}
export default App;
