import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams ,useLocation } from "react-router-dom";
import { StyledLi } from "./StyledLi";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const PhotoDisplay = () => {
  const location = useLocation();
const title = location.state;
  const { id } = useParams();
  const [lastLoaded, setLastLoaded] = useState(null);
  const [roll, setRoll] = useState(-1);
  const [photosData, setPhotosData] = useState({
    loading: true,
    photoList: [],
    error: "",
  });

  useEffect(() => {
    const url = `https://jsonplaceholder.typicode.com/photos?albumId=` + id;
    const pull = async () => {
      try {
        const response = await axios.get(`${url}`);
        setPhotosData({
          ...photosData,
          loading: false,
          photoList: response.data,
          error: "",
        });
        setLastLoaded(response.data[5].id);
      } catch (err) {
        setPhotosData({
          ...photosData,
          loading: false,
          photoList: [],
          error: err.massage,
        });
      }
    };
    pull();
  }, []);

  window.onscroll = function () {
    myFunction();
  };

  const myFunction = () => {
    if (lastLoaded) {
      if (
        document.body.scrollTop > roll ||
        document.documentElement.scrollTop > roll
      ) {
        let html = document.getElementById(`${lastLoaded}`)?.innerHTML;
        if (lastLoaded % 50 > 0) {
          document.getElementById(`${lastLoaded}`).innerHTML =
            `<img src="` +
            photosData.photoList[(lastLoaded % 50) - 1].thumbnailUrl +
            `"></img>` +
            html;
          setLastLoaded(lastLoaded + 1);
        }
        setRoll(roll + 180);
      }
    }
  };

  return photosData.loading ? (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="100px"
    >
      <Typography variant="h3" gutterBottom>Album - {title}</Typography>
      <Typography variant="h5" gutterBottom>Loading images...</Typography>
    </Box>
  ) : photosData.error ? (
    <h1>{photosData.error}</h1>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      marginTop="100px"
    >
      <Typography variant="h3" gutterBottom>Album - {title}</Typography>
      <ul>
        {photosData.photoList.map((photo) => (
          <StyledLi
            id={photo.id}
            key={photo.id}
            style={{ display: "flex", margin: "2rem" }}
          >
            {photo.id % 50 < 6 ? (
              <img src={`${photo.thumbnailUrl}`}></img>
            ) : (
              <></>
            )}
            <Typography variant="h5" gutterBottom style={{ margin: "2.5rem" }}>{photo.title}</Typography>
          </StyledLi>
        ))}
      </ul>
    </Box>
  );
};
export default PhotoDisplay;
