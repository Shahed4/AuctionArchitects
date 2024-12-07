"use client";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    color: "",
    type: "",
    minBid: "",
    price: "",
    endTime: "",
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

    if (formData.phone.toString().length != 10) {
      alert("Must enter a real phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.redirectTo) {
          router.push(data.redirectTo); // Redirect to the provided URL
        } else {
          alert("Car created successfully, but no redirect URL provided.");
        }
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

  {/*vvIMAGE FUNCTIONS*/}
  // Component for acknowledgment
const Acknowledgment = () => (
  <div className={styles.acknowledgment}>
    <span className={styles.acknowledgmentIcon}>✔</span>
    <span className={styles.acknowledgmentText}>Images Received!</span>
  </div>
);

// Function to handle delete functionality
const handleDelete = (key, name, fileNameSpan, fileEntry) => {
  window.uploadedKeys = window.uploadedKeys.filter(
    (uploadedKey) => uploadedKey !== key
  );

  console.log(`File deleted: ${name}`);
  console.log("Updated uploaded keys:", window.uploadedKeys);

  // Strike through the file name
  fileNameSpan.style.textDecoration = "line-through";
  fileNameSpan.style.color = "gray";

  // Optionally, remove the entry entirely
  // fileEntry.remove();
};

// Component for file entry
const FileEntry = ({ key, name, imageUrl }) => {
  const fileEntryRef = React.useRef(null);

  return (
    <div id={`file-entry-${key}`} className={styles.fileEntry} ref={fileEntryRef}>
      <img src={imageUrl} alt={name} className={styles.image} />
      <span className={styles.fileName} id={`file-name-${key}`}>
        File Name: {name}
      </span>
      <button
        id={`delete-btn-${key}`}
        className={styles.deleteButton}
        onClick={() =>
          handleDelete(
            key,
            name,
            fileEntryRef.current.querySelector(`#file-name-${key}`),
            fileEntryRef.current
          )
        }
      >
        Delete
      </button>
    </div>
  );
};

// Main Upload Component
const UploadComponent = () => {
  const handleUploadComplete = (res) => {
    if (!window.uploadedKeys) {
      window.uploadedKeys = [];
    }

    // Append new keys to the array
    res.forEach(({ key }) => {
      if (!window.uploadedKeys.includes(key)) {
        window.uploadedKeys.push(key);
      }
    });

    console.log("Files uploaded successfully: ", res);
    console.log("Updated uploaded keys:", window.uploadedKeys);

    const uploadContainer = document.querySelector("main");
    let messageContainer = document.querySelector("#message-container");

    if (!messageContainer) {
      messageContainer = document.createElement("div");
      messageContainer.id = "message-container";
      messageContainer.className = styles.messageContainer;
      uploadContainer.appendChild(messageContainer);

      // Add acknowledgment
      const acknowledgment = document.createElement("div");
      ReactDOM.render(<Acknowledgment />, acknowledgment);
      messageContainer.appendChild(acknowledgment);
    }

    // Add or update file list
    let fileList = messageContainer.querySelector("#file-list");
    if (!fileList) {
      fileList = document.createElement("div");
      fileList.id = "file-list";
      fileList.className = styles.fileList;
      messageContainer.appendChild(fileList);
    }

    res.forEach(({ key, name }) => {
      if (!fileList.querySelector(`#file-entry-${key}`)) {
        const imageUrl = `https://utfs.io/f/${key}`;
        const fileEntryWrapper = document.createElement("div");
        ReactDOM.render(
          <FileEntry key={key} name={name} imageUrl={imageUrl} />,
          fileEntryWrapper
        );
        fileList.appendChild(fileEntryWrapper);
      }
    });
  };

  const handleUploadError = (error) => {
    console.error(`ERROR! ${error.message}`);
  };


  {/*^^IMAGE FUNCTIONS*/}

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

  const styles = {
    main: "flex min-h-screen flex-col items-center justify-between p-24",
    messageContainer: "flex flex-col items-center mt-4 w-full",
    acknowledgment: "flex items-center mb-4",
    acknowledgmentIcon: "text-green-500 text-xl font-bold",
    acknowledgmentText: "ml-2 text-green-500 font-medium",
    fileList: "flex flex-col items-start w-full",
    fileEntry: "flex items-center mb-4 w-full space-y-4 border-t pt-4",
    image: "w-10 h-10 rounded-md mr-4 border border-gray-300",
    fileName: "text-gray-600 font-medium flex-grow",
    deleteButton:
      "bg-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white font-medium transition-colors",
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
          {/* Personal Information */}
          <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
            Personal Information
          </Typography>
          <TextField
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
            type="number"
            inputProps={{
              maxLength: 10,
            }}
            value={formData.phone}
            onChange={handleChange}
            required
            sx={textFieldStyles}
          />

          {/* Car Details */}
          <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
            Car Details
          </Typography>
          <TextField
            label="VIN"
            name="vin"
            value={formData.vin}
            onChange={handleChange}
            required
            sx={textFieldStyles}
          />
          <TextField
            label="Make"
            name="make"
            value={formData.make}
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
            type="number"
            onChange={handleChange}
            required
            sx={textFieldStyles}
          />
          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            sx={textFieldStyles}
          />
          <TextField
            label="Type"
            name="type"
            select
            value={formData.type}
            onChange={handleChange}
            required
            sx={textFieldStyles}
          >
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Sedan">Sedan</MenuItem>
            <MenuItem value="Coupe">Coupe</MenuItem>
            <MenuItem value="Sports Car">Sports Car</MenuItem>
            <MenuItem value="Convertible">Convertible</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
            <MenuItem value="Electric Car">Electric Car</MenuItem>
            <MenuItem value="Hatchback">Hatchback</MenuItem>
            <MenuItem value="Minivan">Minivan</MenuItem>
            <MenuItem value="Pickup Truck">Pickup Truck</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
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
          <TextField
            label="Last Reported Mileage"
            name="lastReportedMileage"
            value={formData.lastReportedMileage}
            onChange={handleChange}
            type="number" // Ensures only numbers can be entered
            sx={textFieldStyles}
          />

          {/* Payout  */}
          <Typography variant="h5" sx={{ mt: 2, color: "#fff" }}>
            Auction Details
          </Typography>
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
            label="End Time"
            name="endTime"
            select
            value={formData.endTime}
            onChange={handleChange}
            required
            sx={textFieldStyles}
          >
            <MenuItem value={"3 Days"}>3 Days</MenuItem>
            <MenuItem value={"5 Days"}>5 Days</MenuItem>
            <MenuItem value={"1 Week"}>1 Week</MenuItem>
            <MenuItem value={"2 Weeks"}>2 Weeks</MenuItem>
            <MenuItem value={"1 Month"}>1 Month</MenuItem>
          </TextField>

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

          <main className={styles.main}>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </main>




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
}
