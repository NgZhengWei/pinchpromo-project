import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Promotions from "./components/Promotions";
import UserPromotions from "./components/UserPromotions";
import Profile from "./components/Profile";
import RootLayout from "./layouts/RootLayout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import NewBigPromotions from "./components/NewBigPromotions";
import PromotionInfo from "./components/PromotionInfo";
import BigPromotionInfo from "./components/BigPromotionInfo";
import Confirmation from "./components/Confirmation";
import ErrorPage from "./components/ErrorPage";
import BigPromotionCompanyInfo from "./components/BigPromotionCompanyInfo";
import Query from "./components/Query";
import ReceiptClaim from "./components/ReceiptClaim";
import BusinessSignUp from "./components/BusinessSignUp";
import BusinessLogin from "./components/BusinessLogin";
import HowToUse from "./components/HowToUse";
import Dashboard from "./components/businessDashboard/Dashboard";
import Customers from "./components/businessDashboard/Customers";
import Inventory from "./components/businessDashboard/Inventory";
import Orders from "./components/businessDashboard/Orders";

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Promotions />} />
      <Route
        path="/mypromotions"
        element={
          <PrivateRoute>
            <UserPromotions />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/promotioninfo"
        element={
          <PrivateRoute>
            <PromotionInfo />
          </PrivateRoute>
        }
      />
      <Route
        path="/newbigpromotions"
        element={
          <PrivateRoute>
            <NewBigPromotions />
          </PrivateRoute>
        }
      />
      <Route
        path="/bigpromotioninfo"
        element={
          <PrivateRoute>
            <BigPromotionInfo />
          </PrivateRoute>
        }
      />
      <Route
        path="/confirmation"
        element={
          <PrivateRoute>
            <Confirmation />
          </PrivateRoute>
        }
      />

      <Route
        path="/queryforadminonly"
        element={
          <PrivateRoute>
            <Query />
          </PrivateRoute>
        }
      />

      <Route
        path="/receiptclaim"
        element={
          <PrivateRoute>
            <ReceiptClaim />
          </PrivateRoute>
        }
      />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/dashboard/customers" element={<Customers />} />

      <Route path="/dashboard/inventory" element={<Inventory />} />

      <Route path="/dashboard/orders" element={<Orders />} />

      <Route path="/login" element={<Login />} />
      <Route path="/businesslogin" element={<BusinessLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/businesssignup" element={<BusinessSignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/howtouse" element={<HowToUse />} />
      <Route path="*" element={<ErrorPage />} />
      <Route
        path="/promotioncompanyinfo"
        element={<BigPromotionCompanyInfo />}
      />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App;
