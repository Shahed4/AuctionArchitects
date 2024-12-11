"use client";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import NavBar from "../components/NavBar"; 
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

export default function Sell() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    address: "",
    phone: "",
    // Car Details
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
    // Accident Data
    accidentHistory: "",
    damageSeverity: "",
    pointOfImpact: "",
    repairRecords: "",
    airbagDeployment: "",
    structuralDamage: "",
    // Service History (Short-Term)
    oilChanges: "",
    tireRotations: "",
    coolant: "",
    airFilter: "",
    tirePressureDepth: "",
    lights: "",
    // Service History (Long-Term)
    transmissionReplaced: "",
    transferCaseFluid: "",
    shocksStruts: "",
    coolantFluidExchange: "",
    sparkPlugs: "",
    serpentineBelt: "",
    differential: "",
    // Ownership
    previousOwners: "",
    ownershipStates: "",
    ownershipLength: "",
    currentOdometerReading: "",
    floodOrLemonTitle: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Track which step of the form we're on
  const [completedSteps, setCompletedSteps] = useState(Array(6).fill(false));

  const steps = [
    "Personal Information",
    "Car Details/Auction Details",
    "Accident Data",
    "Service History",
    "Ownership History",
    "Upload Images"
  ];

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
    "& .MuiSelect-icon": {
      color: "#fff",
    },
    "& .MuiMenuItem-root": {
      backgroundColor: "#000",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#333"
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function to check required fields per step
  const validateStep = (currentStep, data) => {
    let missingFields = [];

    const requiredIfYes = (condition, fields) => {
      if (condition === "yes") {
        fields.forEach((field) => {
          if (!data[field]) missingFields.push(field);
        });
      }
    };

    switch (currentStep) {
      case 1: // Personal Information
        if (!data.name) missingFields.push("Name");
        if (!data.address) missingFields.push("Address");
        if (!data.phone || data.phone.toString().length !== 10) {
          missingFields.push("Valid Phone Number (10 digits)");
        }
        break;
      case 2: // Car Details
        ["vin","make","model","year","color","type","description","minBid","price","endTime"].forEach(field => {
          if (!data[field]) missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
        });
        break;
      case 3: // Accident Data
        if (!data.accidentHistory) {
          missingFields.push("Accident History");
        } else {
          // If accidentHistory is yes, more fields required
          if (data.accidentHistory === "yes") {
            ["damageSeverity","pointOfImpact","repairRecords","airbagDeployment","structuralDamage"].forEach(field => {
              if (!data[field]) missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
            });
          }
        }
        break;
      case 4: // Service History
        // Short-term
        ["oilChanges","tireRotations","coolant","airFilter","tirePressureDepth","lights"].forEach(field => {
          if (!data[field]) missingFields.push(field);
        });
        // Long-term
        ["transmissionReplaced","transferCaseFluid","shocksStruts","coolantFluidExchange","sparkPlugs","serpentineBelt","differential"].forEach(field => {
          if (!data[field]) missingFields.push(field);
        });
        break;
      case 5: // Ownership History
        // Based on previous logic, only "floodOrLemonTitle" was set to required in code before.
        // If you consider other fields required, add them similarly.
        if (!data.floodOrLemonTitle) missingFields.push("Flood or Lemon Title");
        break;
      case 6: // Upload Images
        // No direct required fields, but must be done before submit. 
        // Typically images might not be strictly required unless you define so.
        // If needed, add logic for required images here.
        break;
      default:
        break;
    }

    return { 
      valid: missingFields.length === 0, 
      missingFields 
    };
  };

  const handleNext = () => {
    const {valid, missingFields} = validateStep(step, formData);
    if (!valid) {
      alert(`Please complete the following fields before continuing:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    // Mark the step as completed
    const updatedCompletedSteps = [...completedSteps];
    updatedCompletedSteps[step - 1] = true;
    setCompletedSteps(updatedCompletedSteps);

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the final step before submitting
    const {valid, missingFields} = validateStep(step, formData);
    if (!valid) {
      alert(`Please complete the following fields before submitting:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    // Check if all steps are completed
    const allCompleted = completedSteps.every((completed, idx) => {
      // For the last step, we just validated above, so we can consider it completed now.
      return idx === (step - 1) ? true : completed;
    });

    if (!allCompleted) {
      const incompleteSteps = steps.filter((_, i) => !completedSteps[i] && i !== (step-1));
      if (incompleteSteps.length > 0) {
        alert(`The following sections are incomplete:\n- ${incompleteSteps.join("\n- ")}`);
        return;
      }
    }

    setLoading(true);

    try {
      const allImages = window.uploadedKeys || [];
      const updatedFormData = { ...formData, images: allImages };

      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
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

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}
    >
      <NavBar />
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0", textAlign: "center" }}
        >
          Sell Your Car
        </Typography>

        {/* Stepper for Progress */}
        <Box sx={{ mb: 4 }}>
          <Stepper
            activeStep={step - 1}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: '#fff',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: '#1976d2',
                fontWeight: 'bold'
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: '#1976d2'
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#1976d2'
              },
              '& .MuiStepIcon-text': {
                fill: '#fff'
              }
            }}
          >
            {steps.map((label, index) => (
              <Step completed={completedSteps[index]} key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

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
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
                Personal Information
              </Typography>
              <TextField
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Phone Number"
                name="phone"
                type="number"
                inputProps={{ maxLength: 10 }}
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {/* STEP 2: Car Details */}
          {step === 2 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
                Car Details / Auction Details
              </Typography>
              <TextField
                label="VIN"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Make"
                name="make"
                select
                value={formData.make}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              >
                {["Acura","Alfa Romeo","Audi","BMW","Buick","Cadillac","Chevrolet","Chrysler","Dodge","Fiat","Ford","GMC","Genesis","Honda","Hyundai","Infiniti","Jaguar","Jeep","Kia","Land Rover","Lexus","Lincoln","Mazda","Mercedes-Benz","Mini","Mitsubishi","Nissan","Porsche","Ram","Subaru","Tesla","Toyota","Volkswagen","Volvo","Other"].map((make) => (
                  <MenuItem key={make} value={make}>{make}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Year"
                name="year"
                value={formData.year}
                type="number"
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Type"
                name="type"
                select
                value={formData.type}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              >
                {["SUV","Sedan","Coupe","Sports Car","Convertible","Hybrid","Electric Car","Hatchback","Minivan","Pickup Truck","Other"].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />

              <Typography variant="h6" sx={{ mt: 2, color: "#fff" }}>
                Auction Details
              </Typography>
              <TextField
                label="Minimum Bid"
                name="minBid"
                value={formData.minBid}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Buy Now Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="End Time"
                name="endTime"
                select
                value={formData.endTime}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              >
                {["3 Days","5 Days","1 Week","2 Weeks","1 Month"].map((time) => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </TextField>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ color: "#fff", borderColor: "#fff" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {/* STEP 3: Accident Data */}
          {step === 3 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
                Accident Data
              </Typography>
              <TextField
                label="Was the car involved in an accident?"
                name="accidentHistory"
                select
                value={formData.accidentHistory}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>

              {formData.accidentHistory === "yes" && (
                <>
                  <TextField
                    label="Damage Severity"
                    name="damageSeverity"
                    value={formData.damageSeverity}
                    onChange={handleChange}
                    fullWidth
                    sx={{...textFieldStyles, mb:2}}
                  />
                  <TextField
                    label="Point of Impact"
                    name="pointOfImpact"
                    value={formData.pointOfImpact}
                    onChange={handleChange}
                    fullWidth
                    sx={{...textFieldStyles, mb:2}}
                  />
                  <TextField
                    label="Records of Damage Repair"
                    name="repairRecords"
                    select
                    value={formData.repairRecords}
                    onChange={handleChange}
                    fullWidth
                    sx={{...textFieldStyles, mb:2}}
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
                    fullWidth
                    sx={{...textFieldStyles, mb:2}}
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
                    fullWidth
                    sx={{...textFieldStyles, mb:2}}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </TextField>
                </>
              )}

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ color: "#fff", borderColor: "#fff" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {/* STEP 4: Service History */}
          {step === 4 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
                Service History (Short-Term)
              </Typography>
              {[
                { label: "Oil & Filter", name: "oilChanges" },
                { label: "Tire Rotation", name: "tireRotations" },
                { label: "Coolant", name: "coolant" },
                { label: "Air Filter", name: "airFilter" },
                { label: "Tire Pressure/Tire Depth", name: "tirePressureDepth" },
                { label: "Lights (Headlights, Turn Signals, Brake, Parking)", name: "lights" },
              ].map((item) => (
                <TextField
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  select
                  value={formData[item.name]}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{...textFieldStyles, mb:2}}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
              ))}

              <Typography variant="h5" sx={{ mb: 2, mt: 4, color: "#fff" }}>
                Service History (Long-Term)
              </Typography>
              {[
                { label: "Transmission", name: "transmissionReplaced" },
                { label: "Transfer Case Fluid", name: "transferCaseFluid" },
                { label: "Inspect Shocks and Struts", name: "shocksStruts" },
                { label: "Coolant Fluid Exchange", name: "coolantFluidExchange" },
                { label: "Spark Plugs", name: "sparkPlugs" },
                { label: "Serpentine Belt", name: "serpentineBelt" },
                { label: "Front/Rear Differential", name: "differential" },
              ].map((item) => (
                <TextField
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  select
                  value={formData[item.name]}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{...textFieldStyles, mb:2}}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
              ))}

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ color: "#fff", borderColor: "#fff" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {/* STEP 5: Ownership History */}
          {step === 5 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
                Ownership History
              </Typography>
              <TextField
                label="Previous Owners"
                name="previousOwners"
                value={formData.previousOwners}
                onChange={handleChange}
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="States/Provinces Owned"
                name="ownershipStates"
                value={formData.ownershipStates}
                onChange={handleChange}
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Length of Ownership (Years)"
                name="ownershipLength"
                value={formData.ownershipLength}
                onChange={handleChange}
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Current Odometer Reading"
                name="currentOdometerReading"
                value={formData.currentOdometerReading}
                onChange={handleChange}
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              />
              <TextField
                label="Flood or Lemon Title"
                name="floodOrLemonTitle"
                select
                value={formData.floodOrLemonTitle}
                onChange={handleChange}
                required
                fullWidth
                sx={{...textFieldStyles, mb:2}}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ color: "#fff", borderColor: "#fff" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {/* STEP 6: Upload Images & Submit */}
          {step === 6 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
                Upload Images
              </Typography>
              <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (!window.uploadedKeys) {
                      window.uploadedKeys = [];
                    }
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
                      messageContainer.className = "flex flex-col items-center mt-4 w-full";
                      uploadContainer.appendChild(messageContainer);

                      const acknowledgment = document.createElement("div");
                      acknowledgment.className = "flex items-center mb-4";
                      acknowledgment.innerHTML = `
                        <span class="text-green-500 text-xl font-bold">✔</span>
                        <span class="ml-2 text-green-500 font-medium">Images Received!</span>
                      `;
                      messageContainer.appendChild(acknowledgment);
                    }

                    const fileList = messageContainer.querySelector("#file-list") || document.createElement("div");
                    fileList.id = "file-list";
                    fileList.className = "flex flex-col items-start w-full";

                    res.forEach(({ key, name }) => {
                      if (!fileList.querySelector(`#file-entry-${key}`)) {
                        const imageUrl = `https://utfs.io/f/${key}`;
                        const fileEntry = document.createElement("div");
                        fileEntry.id = `file-entry-${key}`;
                        fileEntry.className = "flex items-center mb-4 w-full space-y-4 border-t pt-4";

                        fileEntry.innerHTML = `
                          <img src="${imageUrl}" alt="${name}" class="w-10 h-10 rounded-md mr-4 border border-gray-300" />
                          <span class="text-gray-600 font-medium flex-grow" id="file-name-${key}">File Name: ${name}</span>
                          <button 
                            id="delete-btn-${key}" 
                            class="bg-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white font-medium transition-colors"
                          >
                            Delete
                          </button>
                        `;

                        fileList.appendChild(fileEntry);

                        const deleteButton = fileEntry.querySelector(`#delete-btn-${key}`);
                        const fileNameSpan = fileEntry.querySelector(`#file-name-${key}`);
                        deleteButton.addEventListener("click", () => {
                          window.uploadedKeys = window.uploadedKeys.filter(
                            (uploadedKey) => uploadedKey !== key
                          );
                          console.log(`File deleted: ${name}`);
                          console.log("Updated uploaded keys:", window.uploadedKeys);
                          fileNameSpan.style.textDecoration = "line-through";
                          fileNameSpan.style.color = "gray";
                        });
                      }
                    });

                    if (!messageContainer.contains(fileList)) {
                      messageContainer.appendChild(fileList);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error(`ERROR! ${error.message}`);
                  }}
                />
              </main>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ color: "#fff", borderColor: "#fff" }}
                >
                  Back
                </Button>
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
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
