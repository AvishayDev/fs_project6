import { styled } from "@mui/material/styles";

export const StyledLi = styled("li")(({ theme }) => ({
    listStyleType: "none",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }));