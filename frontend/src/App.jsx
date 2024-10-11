import "./App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import About from "./Components/About/About";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import Services from "./Components/Servicesp/Services";
import "./themes.css";


function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);


  return (
    <>
    <Navbar />
    <div className="container-1">
      

      <Header />
      <About />
      <Services />
      <Footer />
    </div>
    </>
  );
}

export default App;
