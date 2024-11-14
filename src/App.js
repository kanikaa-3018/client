import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
    <Header/>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
              
            
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer/>
    </>
  );
}
export function ProtectedRoutes(props) {
  console.log("User data:", localStorage.getItem("user"));
  if (localStorage.getItem("user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
};



export default App;
