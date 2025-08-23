
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Admin from "./pages/Admin"
import ProtectedRoute from "./security/ProtectedRoute"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify"


export default function App() {
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
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute >
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
