import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, Snackbar } from "@mui/material";
import { styled } from "@mui/system";

const StyledInput = styled("input")`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  width: 300px;
`;

const Popup = styled(Snackbar)`
  && {
    min-width: 1500px;
    text-align: center;
    margin-top: 50px;
  }
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    localStorage.clear()
}, [])

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async () => {
    try {
      console.log(
        `username = ${username}, password = ${password}, name = ${name}, email = ${email}, phone = ${phone}, website = ${website}`
      );

      // Send the sign-up request to the server using axios or fetch
      // Example using axios:
      const response = await axios.post("http://127.0.0.1:3001/signup", {
        username,
        password,
        name,
        email,
        phone,
        website,
      });

      // Handle the response and navigate to the appropriate page
      if (response.data) {
        const info = response.data[0];
        localStorage.setItem("name", info["name"]);
        localStorage.setItem("api_key", info["api_key"]);
        localStorage.setItem("userInfo", JSON.stringify(response.data[0]));
        navigate(`/users/${response.data[0].id}/info`); // Replace with the appropriate success page
      } else {
        togglePopup();
      }
    } catch (err) {
      togglePopup();
      console.log(err?.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <StyledInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={"Username..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Password..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={"Name..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"Email..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={"Phone..."}
          onKeyDown={handleKeyDown}
        />
        <StyledInput
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder={"Website..."}
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Sign Up
        </Button>
        <Link to="/login">
          <Button variant="text" color="primary">
            Already have an account? Sign In
          </Button>
        </Link>
      </Box>

      <Popup
        open={showPopup}
        autoHideDuration={2000}
        onClose={togglePopup}
        message="Sign-up failed"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </div>
  );
};

export default SignUp;