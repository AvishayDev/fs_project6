import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  const { userId } = useParams();
  const [infoData, setInfoData] = useState({
    loading: true,
    info: null,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users?id=${userId}`
        );
        setInfoData({
          ...infoData,
          loading: false,
          info: response.data[0],
          error: "",
        });
      } catch (err) {
        setInfoData({
          ...infoData,
          loading: false,
          info: [],
          error: err.message,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <StyledBox>
      {infoData.info ? (
        <Box>
          <Heading>User Information</Heading>
          <SubHeading>ID: {infoData.info.id}</SubHeading>
          <SubHeading>Name: {infoData.info.name}</SubHeading>
          <SubHeading>Username: {infoData.info.username}</SubHeading>
          <SubHeading>Email: {infoData.info.email}</SubHeading>
          <SubHeading>Address:</SubHeading>
          <Paragraph>Street: {infoData.info.address.street}</Paragraph>
          <Paragraph>Suite: {infoData.info.address.suite}</Paragraph>
          <Paragraph>City: {infoData.info.address.city}</Paragraph>
          <Paragraph>Zipcode: {infoData.info.address.zipcode}</Paragraph>
          <SubHeading>Geo:</SubHeading>
          <Paragraph>Latitude: {infoData.info.address.geo.lat}</Paragraph>
          <Paragraph>Longitude: {infoData.info.address.geo.lng}</Paragraph>
          <SubHeading>Phone: {infoData.info.phone}</SubHeading>
          <SubHeading>Website: {infoData.info.website}</SubHeading>
          <SubHeading>Company:</SubHeading>
          <Paragraph>Company Name: {infoData.info.company.name}</Paragraph>
          <Paragraph>
            Catch Phrase: {infoData.info.company.catchPhrase}
          </Paragraph>
          <Paragraph>BS: {infoData.info.company.bs}</Paragraph>
        </Box>
      ) : (
        <Paragraph>No user data found in local storage.</Paragraph>
      )}
    </StyledBox>
  );
};

export default Info;
