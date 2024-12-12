"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../components/NavBar";
import {
  Box,
  Container,
  Typography,
  Button,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import useUserInfo from "../../../hooks/useUserInfo";

export default function CheckoutPage() {
  const { id } = useParams(); // Dynamically resolve params
  const [car, setCar] = useState(null);
  const { user, isLoading } = useUser();
  const [bidAmount, setBidAmount] = useState(""); // To store the bid amount
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { userInfo, isLoadingData, fetchError } = useUserInfo(user);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) throw new Error("Failed to fetch car details");
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCarDetails();
  }, [id]);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (car.images && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car._id,
          price: car.price,
          description: car.description,
          model: car.model,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Checkout error:", data.error);
        alert(data.error || "Checkout failed.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    }
  };

  const handleBid = async () => {
    if (!car.showListing) {
      alert("Listing Not Available");
      return;
    } else if (car.listingClosed) {
      alert("Listing Has Closed");
      return;
    }

    if (!user) {
      alert("Login to Bid.");
      return;
    }

    const bidDifference = car.price - car.currBid;
    let increment = bidDifference > 1000 ? 500 : 100;

    if (bidAmount < car.currBid + increment || bidAmount % increment !== 0) {
      alert(
        `Must place a bid of at least $${increment} more than the current bid, in increments of $${increment}.`
      );
      return;
    }

    // Proceed with bid submission
    try {
      const response = await fetch(`/api/cars/${id}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          id: car._id,
          amount: bidAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to place bid.");
        return;
      }

      // Update car data locally after a successful bid
      setCar(data);
      alert("Bid placed successfully!");

      // Add carId to user's userBids array using the combined API
      try {
        const addBidResponse = await fetch(
          `/api/users/update-array/${user.sub}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              carId: car._id,
              actionType: "userBids", // Specify the array to update
            }),
          }
        );

        if (!addBidResponse.ok) {
          const errorData = await addBidResponse.json();
          console.error("Failed to update user bids:", errorData.error);
        } else {
          console.log("User bids updated successfully!");
        }
      } catch (addBidError) {
        console.error("Error updating user bids:", addBidError);
      }

      // After a successful bid, send an email invoice
      const invoiceSubject = `Invoice for your new bid on ${car.year} ${car.make} ${car.model}`;
      const invoiceBody = `
      <html>
        <body>
          <p>Hello!<br><br>
          Thank you for placing a bid of $${bidAmount} on the ${car.year} ${car.make} ${car.model}. Please rate your seller and we'll keep you updated if you win the bid!<br><br>
          Best regards,<br>
          <img src="https://utfs.io/f/z7jUGIcSO2eq4aiykGFs3MIfUn8F9OAWiDPkZTVJzHl2mYqX" width="16" height="16" style="vertical-align:middle; margin-right:5px;">
          AuctionArchitects
          </p>
        </body>
      </html>
    `;

      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "alexab6104@gmail.com",
            subject: invoiceSubject,
            body: invoiceBody,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Failed to send email invoice.");
        } else {
          console.log("Email invoice sent successfully!");
        }
      } catch (emailError) {
        console.error("Error sending invoice email:", emailError);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("An error occurred while placing the bid.");
    }
  };

  if (loading || isLoadingData) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#fff",
          backgroundColor: "#000",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#fff",
          backgroundColor: "#000",
        }}
      >
        <Typography>Car details not found.</Typography>
      </Box>
    );
  }

  // --- Prepare Data for Accordions ---

  // Personal Information
  const personalInfoData = [
    { label: "Name", value: car.name },
    { label: "Address", value: car.address },
    { label: "Phone", value: car.phone },
  ];

  // Car Details
  const carDetailsData = [
    { label: "VIN", value: car.vin },
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Year", value: car.year },
    { label: "Color", value: car.color },
    { label: "Type", value: car.type },
    { label: "Description", value: car.description },
  ];

  // Auction Details
  const auctionDetailsData = [
    { label: "Minimum Bid", value: car.minBid },
    { label: "Buy Now Price", value: car.price },
    { label: "End Time", value: car.endTime },
  ];

  // Accident Data
  const accidentData = [
    { label: "Accident History", value: car.accidentHistory },
    ...(car.accidentHistory === "yes"
      ? [
          { label: "Damage Severity", value: car.damageSeverity },
          { label: "Point of Impact", value: car.pointOfImpact },
          { label: "Repair Records", value: car.repairRecords },
          { label: "Airbag Deployment", value: car.airbagDeployment },
          { label: "Structural Damage", value: car.structuralDamage },
        ]
      : []),
  ];

  // Service History (Short-Term)
  const serviceHistoryShortTerm = [
    { label: "Oil & Filter", value: car.oilChanges },
    { label: "Tire Rotations", value: car.tireRotations },
    { label: "Coolant", value: car.coolant },
    { label: "Air Filter", value: car.airFilter },
    { label: "Tire Pressure/Tire Depth", value: car.tirePressureDepth },
    { label: "Lights", value: car.lights },
  ];

  // Service History (Long-Term)
  const serviceHistoryLongTerm = [
    { label: "Transmission", value: car.transmissionReplaced },
    { label: "Transfer Case Fluid", value: car.transferCaseFluid },
    { label: "Shocks and Struts", value: car.shocksStruts },
    { label: "Coolant Fluid Exchange", value: car.coolantFluidExchange },
    { label: "Spark Plugs", value: car.sparkPlugs },
    { label: "Serpentine Belt", value: car.serpentineBelt },
    { label: "Front/Rear Differential", value: car.differential },
  ];

  // Ownership History
  const ownershipHistoryData = [
    { label: "Previous Owners", value: car.previousOwners },
    { label: "States/Provinces Owned", value: car.ownershipStates },
    { label: "Length of Ownership (Years)", value: car.ownershipLength },
    { label: "Current Odometer Reading", value: car.currentOdometerReading },
    { label: "Flood or Lemon Title", value: car.floodOrLemonTitle },
  ];

  const renderDataList = (dataArray) =>
    dataArray.map((item, i) => (
      <Typography key={i} sx={{ mb: 1 }}>
        <strong>{item.label}:</strong> {item.value || "N/A"}
      </Typography>
    ));

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
        py: 5,
      }}
    >
      <NavBar />
      <Container maxWidth="lg">
        {/* Header Section */}
        <Typography
          textAlign="center"
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "#e0e0e0",
          }}
        >
          {car.year} {car.make} {car.model}
          {(car.currBid >= car.price || car.listingClosed) && (
            <> - (Auction Closed)</>
          )}
        </Typography>

        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ position: "relative", textAlign: "center" }}>
              {car.images?.length ? (
                <>
                  <CardMedia
                    component="img"
                    image={`https://utfs.io/f/${car.images[currentImageIndex]}`}
                    alt={`${car.model} image`}
                    sx={{
                      width: "90%",
                      height: "auto",
                      borderRadius: 2,
                      boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                    }}
                  />
                  {currentImageIndex > 0 && (
                    <Button
                      onClick={handlePrevImage}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "#fff",
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                        zIndex: 1,
                      }}
                    >
                      <ArrowBackIosIcon />
                    </Button>
                  )}
                  {currentImageIndex < car.images.length - 1 && (
                    <Button
                      onClick={handleNextImage}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "#fff",
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                        zIndex: 1,
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </Button>
                  )}
                </>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    color: "#e0e0e0",
                    border: "2px dashed #e0e0e0",
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  No images attached.
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Contact / Basic Car Details */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#1a1a1a",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                sx={{ mb: 2, color: "#fff" }}
              >
                Contact Information
              </Typography>
              <Typography>
                <strong>Name:</strong> {car.name || "Not provided"}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {car.phone || "Not provided"}
              </Typography>
              <Typography>
                <strong>Area:</strong> {car.address || "Not provided"}
              </Typography>
            </Box>

            <Box
              sx={{
                marginTop: "50px",
                backgroundColor: "#1a1a1a",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                sx={{ mb: 2, color: "#fff" }}
              >
                Basic Car Details
              </Typography>
              <Typography>
                <strong>VIN:</strong> {car.vin || "N/A"}
              </Typography>
              <Typography>
                <strong>Color:</strong> {car.color || "N/A"}
              </Typography>
              <Typography>
                <strong>Odometer:</strong> {car.currentOdometerReading || "N/A"}
              </Typography>
              <Typography>
                <strong>Type:</strong> {car.type || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Container
          maxWidth="md"
          sx={{
            overflowX: "hidden",
            paddingX: 3,
          }}
        >
          <Grid container spacing={2}>
            {/* Description Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 3,
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "justify",
                  }}
                >
                  {car.description || "No description available."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Pricing Information */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, color: "#fff" }}>
          Current Bid: ${car.currBid || "N/A"}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
          Buy Now Price: ${car.price || "N/A"}
        </Typography>

        {/* Countdown Timer */}
        {car.showListing && !car.listingClosed && car.currBid < car.price && (
          <Box
            sx={{
              position: "absolute",
              top: 50,
              right: 16,
              backgroundColor: "#1a1a1a",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography variant="h6">
              {Math.max(
                0,
                Math.floor(
                  (new Date(car.endTime) - new Date()) / (1000 * 60 * 60 * 24)
                )
              )}
              d{" "}
              {Math.max(
                0,
                Math.floor(
                  ((new Date(car.endTime) - new Date()) / (1000 * 60 * 60)) % 24
                )
              )}
              h
            </Typography>
          </Box>
        )}

        {/* Accordions for all sections */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* Row 2: Accident Data, Ownership History */}
          <Grid item xs={12} md={6}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              >
                <Typography>Accident Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderDataList(accidentData)}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={6}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              >
                <Typography>Ownership History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderDataList(ownershipHistoryData)}
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Row 3: Service History Short-Term, Service History Long-Term */}
          <Grid item xs={12} md={6}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              >
                <Typography>Service History (Short-Term)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderDataList(serviceHistoryShortTerm)}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={6}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              >
                <Typography>Service History (Long-Term)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderDataList(serviceHistoryLongTerm)}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          {!userInfo.userListings.includes(id) &&
          car.showListing &&
          !car.listingClosed &&
          car.currBid < car.price ? (
            <>
              {/* Bid Input and Buttons Row */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Left Side: Bid Input and Place Bid Button */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    label="Enter Bid Amount"
                    type="number"
                    variant="outlined"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    InputLabelProps={{ style: { color: "#fff" } }}
                    sx={{
                      width: "200px",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#1a1a1a",
                        color: "#fff",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleBid}
                    sx={{
                      backgroundColor: "#4caf50",
                      "&:hover": { backgroundColor: "#388e3c" },
                      px: 3,
                    }}
                  >
                    Place Bid
                  </Button>
                </Box>

                {/* Right Side: Buy Now Button */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleCheckout}
                    sx={{
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#1565c0" },
                      px: 4,
                    }}
                  >
                    Buy Now
                  </Button>
                </Box>
              </Box>

              {/* Dynamic Bid Instruction */}
              <Typography sx={{ color: "#fff", textAlign: "center", mt: 2 }}>
                {car.price - car.currBid > 1000
                  ? "You must bid at least $500 more than the current bid, in increments of $500."
                  : "You must bid at least $100 more than the current bid, in increments of $100."}
              </Typography>
            </>
          ) : userInfo.userListings.includes(id) ? (
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                mt: 2,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              This is your listing.
            </Typography>
          ) : car.currBid >= car.price ? (
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                mt: 2,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              The car has been purchased at the Buy Now price.
            </Typography>
          ) : (
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                mt: 2,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              This auction has closed.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
