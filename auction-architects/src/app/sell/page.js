"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
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
    images: [],
    accidentHistory: "",
    damageSeverity: "",
    pointOfImpact: "",
    repairRecords: "",
    airbagDeployment: "",
    structuralDamage: "",
    oilChanges: "",
    tireRotations: "",
    openRecalls: "",
    brakeRotorReplaced: "",
    transmissionReplaced: "",
    safetyInspections: "",
    typeOfUse: "",
    previousOwners: "",
    ownershipStates: "",
    ownershipLength: "",
    lastReportedMileage: "",
    currentOdometerReading: "",
    floodOrLemonTitle: "",
  });

  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    for (let file of files) {
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
          setPreviewImages((prev) => [...prev, filePath]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          accidentHistory: "",
          damageSeverity: "",
          pointOfImpact: "",
          repairRecords: "",
          airbagDeployment: "",
          structuralDamage: "",
          oilChanges: "",
          tireRotations: "",
          openRecalls: "",
          brakeRotorReplaced: "",
          transmissionReplaced: "",
          safetyInspections: "",
          typeOfUse: "",
          previousOwners: "",
          ownershipStates: "",
          ownershipLength: "",
          lastReportedMileage: "",
          currentOdometerReading: "",
          floodOrLemonTitle: "",
        });
        setPreviewImages([]);
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

  const textFieldStyles = {
    fieldset: { borderColor: "#fff" },
    "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "#fff" },
    "& .MuiOutlinedInput-input": { color: "#fff" },
    "& .MuiInputLabel-root": {
      color: "#fff",
      transition: "all 0.2s ease",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#1976d2",
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  };


  return (
      <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}>
        <Container maxWidth="md">
          <Typography textAlign="center" variant="h3" sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0" }}>
            Let's Sell Your Car!
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
            {/* Personal Information */}
            <div></div><TextField
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
    
            {/* Car Details */}
            <TextField
              label="VIN"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Minimum Bid"
              name="minBid"
              value={formData.minBid}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Buy Now Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              sx={textFieldStyles}
            />
    
            {/* Accident Data */}
          <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
            Accident Data
          </Typography>
          <TextField
            label="Was the car involved in an accident?"
            name="accidentHistory"
            select
            value={formData.accidentHistory}
            onChange={handleChange}
            required
            sx={textFieldStyles}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>

          {/* Conditionally Render Additional Fields */}
          {formData.accidentHistory === "yes" && (
            <>
              <TextField
                label="Damage Severity"
                name="damageSeverity"
                value={formData.damageSeverity}
                onChange={handleChange}
                sx={textFieldStyles}
              />
              <TextField
                label="Point of Impact"
                name="pointOfImpact"
                value={formData.pointOfImpact}
                onChange={handleChange}
                sx={textFieldStyles}
              />
              <TextField
                label="Records of Damage Repair"
                name="repairRecords"
                select
                value={formData.repairRecords}
                onChange={handleChange}
                sx={textFieldStyles}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                label="Airbag Deployment"
                name="airbagDeployment"
                select
                value={formData.airbagDeployment}
                onChange={handleChange}
                sx={textFieldStyles}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              <TextField
                label="Structural Damage"
                name="structuralDamage"
                select
                value={formData.structuralDamage}
                onChange={handleChange}
                sx={textFieldStyles}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
            </>
          )}
    
            {/* Service History */}
            <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
              Service History
            </Typography>
            <TextField
              label="Oil Changes"
              name="oilChanges"
              select
              value={formData.oilChanges}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField
              label="Tire Rotations"
              name="tireRotations"
              select
              value={formData.tireRotations}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField
              label="Open Recalls"
              name="openRecalls"
              select
              value={formData.openRecalls}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField
              label="Brake Rotor Replaced"
              name="brakeRotorReplaced"
              select
              value={formData.brakeRotorReplaced}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField
              label="Transmission Replaced"
              name="transmissionReplaced"
              select
              value={formData.transmissionReplaced}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
            <TextField
              label="Safety Inspections Passed"
              name="safetyInspections"
              select
              value={formData.safetyInspections}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
    
            {/* Ownership History */}
            <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
              Ownership History
            </Typography>
            <TextField
              label="Previous Owners"
              name="previousOwners"
              value={formData.previousOwners}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            <TextField
              label="States/Provinces Owned"
              name="ownershipStates"
              value={formData.ownershipStates}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            <TextField
              label="Length of Ownership (Years)"
              name="ownershipLength"
              value={formData.ownershipLength}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            <TextField
              label="Last Reported Mileage"
              name="lastReportedMileage"
              value={formData.lastReportedMileage}
              onChange={handleChange}
              type="number" // Ensures only numbers can be entered
              sx={textFieldStyles}
            />
            <TextField
              label="Current Odometer Reading"
              name="currentOdometerReading"
              value={formData.currentOdometerReading}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            <TextField
              label="Flood or Lemon Title"
              name="floodOrLemonTitle"
              select
              value={formData.floodOrLemonTitle}
              onChange={handleChange}
              sx={textFieldStyles}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
    
            {/* Upload Images */}
            <Button variant="contained" component="label">
              Upload Pictures
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
    
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
    
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:disabled": { backgroundColor: "#5a5a5a" },
              }}
            >
              {loading ? "Submitting..." : "Submit Car for Auction"}
            </Button>
      </Box>
    </Container>
  </Box>
);

}
