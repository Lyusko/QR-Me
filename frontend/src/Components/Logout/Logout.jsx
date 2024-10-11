import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/");
  }, [navigate]);

  return null; // No need to render anything
};

export default Logout;
