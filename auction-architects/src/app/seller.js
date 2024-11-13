import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function seller() {
  return (
    <Box sx={{ padding: "24px", backgroundColor: "#f7f8fa" }}>
      <Container maxWidth="sm">
        <Typography variant="h2" gutterBottom>
          Seller
        </Typography>
        <Typography variant="body1">Placeholder for seller details</Typography>
      </Container>
    </Box>
  );
}
