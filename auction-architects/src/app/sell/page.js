"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

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
    //images: [],
  });

  const [loading, setLoading] = useState(false);
  //const [previewImages, setPreviewImages] = useState([]); // For image previews

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files); // Ensure files are an array
    const uploadedImages = [];

    // Upload each file
    /* for (let file of files) {
       const uploadFormData = new FormData();
       uploadFormData.append("image", file);
 
       try {
         const response = await fetch("/api/upload", {
           method: "POST",
           body: uploadFormData,
         });
 
         if (response.ok) {
           const { filePath } = await response.json();
           uploadedImages.push(filePath);
           setPreviewImages((prev) => [...prev, filePath]); // Add to preview
         } else {
           console.error("Failed to upload image:", file.name);
         }
       } catch (error) {
         console.error("Image upload error:", error);
       }
     }
 
     setFormData((prev) => ({
       ...prev,
       images: [...prev.images, ...uploadedImages],
     }));
   };
 */
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            year: parseInt(formData.year),
            minBid: parseFloat(formData.minBid),
            price: parseFloat(formData.price),
          }),
        });

        if (response.ok) {
          alert("Car added successfully!");
          // Reset form
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
            //images: [],
          });
          // setPreviewImages([]);
        } else {
          const errorData = await response.json();
          alert(`Failed to add car: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error during submission:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Box
        sx={{
          backgroundColor: "#000",
          minHeight: "100vh",
          color: "#fff",
          py: 5,
        }}
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
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="VIN"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <TextField
              label="Minimum Bid"
              name="minBid"
              value={formData.minBid}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" }, type: "number" }}
            />
            <TextField
              label="Buy Now Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" }, type: "number" }}
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
            />
            <Button variant="contained" component="label">
              Upload Pictures
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>

            {/* Preview Uploaded Images */}
            {previewImages.length > 0 && (
              <Grid container spacing={2}>
                {previewImages.map((image, index) => (
                  <Grid item xs={6} key={index}>
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Submitting..." : "Submit Car for Auction"}
            </Button>
          </Box>
        </Container>
      </Box>
    );
  };
}
