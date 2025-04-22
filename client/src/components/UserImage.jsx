import { Box } from "@mui/material";

// eslint-disable-next-line react/prop-types
const UserImage = ({ image, size = "60px" }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${API_URL}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;