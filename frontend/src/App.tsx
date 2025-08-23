import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import ProtectedRoute from "./security/ProtectedRoute"
import Signup from "./pages/Signup"
import ForgetPassword from "./pages/FrogetPassWord"
import { ToastContainer } from "react-toastify"
import Order from "./pages/Order"

function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/forget" element={<ForgetPassword/>} />
          <Route path="/cart" element={
            <ProtectedRoute >
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute >
              <Order />
            </ProtectedRoute>
          } />
         
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App