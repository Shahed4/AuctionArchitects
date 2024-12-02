"use client";
import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";

export default function Sell() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    vin: "",
    model: "",
    year: "",
    minBid: "",
    price: "",
    description: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      images: formData.images.map((file) => file.name),
      year: parseInt(formData.year),
      minBid: parseFloat(formData.minBid),
      price: parseFloat(formData.price),
    };

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Car added successfully!");
        setFormData({
          name: "",
          address: "",
          phone: "",
          vin: "",
          model: "",
          year: "",
          minBid: "",
          price: "",
          description: "",
          images: [],
        });
      } else {
        alert("Failed to add car.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0" }}
        >
          Sell Your Car
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            backgroundColor: "#1a1a1a",
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
          }}
        >
          <TextField
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="VIN"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Minimum Bid"
            name="minBid"
            value={formData.minBid}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" }, type: "number" }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Buy Now Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" }, type: "number" }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
            sx={{
              fieldset: { borderColor: "#fff" },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#1976d2",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#1976d2",
              },
            }}
          />
          <Button variant="contained" component="label">
            Upload Pictures{" "}
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Submitting..." : "Submit Car for Auction"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
