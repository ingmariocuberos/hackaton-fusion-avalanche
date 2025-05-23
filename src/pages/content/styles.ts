import { SxProps, Theme } from "@mui/material/styles";

export const sectionButtonStyle: SxProps<Theme> = {
  pl: 4,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  width: "100%",
  textAlign: "left",
  border: "none",
  cursor: "pointer",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "transparent",
  boxShadow: "none",
};
