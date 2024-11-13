"use client";
import React from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";

export default function Sell() {
  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0" }}
        >
          Sell Your Car
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            backgroundColor: "#1a1a1a",
            p: 4,
            borderRadius: 2,
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <TextField
            label="VIN Number"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <TextField
            label="Minimum Accepting Bid"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" }, type: "number" }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <TextField
            label="Buy Now Price"
            variant="outlined"
            fullWidth
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" }, type: "number" }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <TextField
            label="Car Description"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={4}
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{ fieldset: { borderColor: "#fff" } }}
          />

          <Button
            variant="contained"
            component="label"
            sx={{ backgroundColor: "#1976d2", color: "#fff", mb: 2 }}
          >
            Upload Car Pictures
            <input type="file" hidden multiple />
          </Button>

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#1976d2", color: "white", width: "100%" }}
            >
              Submit Car for Auction
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
