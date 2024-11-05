import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/Employes/register.tsx";
import Login from "./pages/Employes/login.tsx";
import ProductList from "./pages/Customer/productList.tsx";
import ProtectedRoute from "./protectedRoute.tsx";

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProductList/>} />
            </Routes>
        </Router>
    </>

  )
}

export default App
