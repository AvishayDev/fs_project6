import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { StyledLi } from "./StyledLi";


import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Albums = () => {
  const { userId } = useParams();
  const [albumData, setAlbumData] = useState({
    loading: true,
    albumList: [],
    error: "",
  });
  const url = `https://jsonplaceholder.typicode.com/albums?userId=${userId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setAlbumData({
          ...albumData,
          loading: false,
          albumList: response.data,
          error: "",
        });
      } catch (err) {
        setAlbumData({
          ...albumData,
          loading: false,
          albumList: [],
          error: err.message,
        });
      }
    };
    fetchData();
  }, []);

  return albumData.loading ? (
    <Box display="flex" flexDirection="column" alignItems="center" marginTop="100px">
      <Typography variant="h3" gutterBottom>
        Albums
      </Typography>
      <Typography variant="h5" gutterBottom>
        Loading data...
      </Typography>
    </Box>
  ) : albumData.error ? (
    <h1>{albumData.error}</h1>
  ) : (
    <Box display="flex" flexDirection="column" alignItems="center" marginTop="100px">
      <Typography variant="h3" gutterBottom>
        Albums
      </Typography>
      <ul>
        {albumData.albumList.map((album) => (
          <StyledLi key={album.id} style={{ display: "flex", margin: "2rem" }}>
            <Typography variant="h5" gutterBottom>
              {album.title}
            </Typography>
            <Link to={`/users/${userId}/albums/${album.id}`} state={album.title}>
              <Button
                component="a"
                variant="contained" disableElevation
                color="primary"
                style={{ marginLeft: "1rem" }}
                size="small"
              >
                Open Album
              </Button>
            </Link>
          </StyledLi>
        ))}
      </ul>
    </Box>
  );
};

export default Albums;
