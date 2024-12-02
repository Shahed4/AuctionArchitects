"use client";

import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Thank you for your purchase.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          sx={{ backgroundColor: "#1976d2", color: "#fff" }}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}
