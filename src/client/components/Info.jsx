import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const Heading = styled("h1")`
  color: #150;
`;

const SubHeading = styled("h2")`
  color: #333;
`;

const Paragraph = styled("p")`
  color: #500;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
`;

const Info = () => {
  const [infoData, setInfoData] = useState({});

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('userInfo'))
    setInfoData(info)
  }, []);

  return (
    <StyledBox>
      {infoData ? (
        <Box>
          <Heading>User Information</Heading>
          <SubHeading>ID: {infoData.id}</SubHeading>
          <SubHeading>Name: {infoData.name}</SubHeading>
          <SubHeading>Username: {infoData.username}</SubHeading>
          <SubHeading>Email: {infoData.email}</SubHeading>
          <SubHeading>Phone: {infoData.phone}</SubHeading>
          <SubHeading>Website: {infoData.website}</SubHeading>
        </Box>
      ) : (
        <Paragraph>No user data found in local storage.</Paragraph>
      )}
    </StyledBox>
  );
};

export default Info;
