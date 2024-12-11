"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Import left arrow icon
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Import right arrow icon

export default function CheckoutPage() {
  const { id } = useParams(); // Dynamically resolve params
  const [car, setCar] = useState(null);
  const { user, isLoading } = useUser();
  const [bidAmount, setBidAmount] = useState(""); // To store the bid amount
  const [loading, setLoading] = useState(true);

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
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };
  
  const handleNextImage = () => {
    if (currentImageIndex < car.images.length - 1) {
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
        alert(`Must place a bid of at least $${increment} more than the current bid, in increments of $${increment}.`);
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
  
        // After a successful bid, send an email invoice
        // Hardcoding the recipient email as requested:
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
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: 'alexab6104@gmail.com',
              subject: invoiceSubject,
              body: invoiceBody,
            }),
          });
  
          if (!emailResponse.ok) {
            console.error('Failed to send email invoice.');
          } else {
            console.log('Email invoice sent successfully!');
          }
        } catch (emailError) {
          console.error('Error sending invoice email:', emailError);
        }
  
    } catch (error) {
        console.error("Error placing bid:", error);
        alert("An error occurred while placing the bid.");
    }
  };  
  

  if (loading) {
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
  

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
        py: 5,
      }}
    >
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

  {/* Contact Information Section */}
  <Grid item xs={12} md={4}>
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        p: 2,
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
        mb: 2, // Add margin-bottom for spacing
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

    {/* Car Details Section */}
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
        Car Details
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
  maxWidth="md" // Restrict width
  sx={{
    overflowX: "hidden", // Prevent horizontal overflow
    paddingX: 3, // Add padding for better appearance
  }}
>
  <Grid container spacing={2}>
    {/* Description Section */}
    <Grid item xs={12}>
      <Box
        sx={{
          mt: 3,
          maxWidth: "100%", // Keep text within container
          wordBreak: "break-word", // Wrap long words
          overflowWrap: "break-word", // Ensure consistent wrapping
          hyphens: "auto", // Add hyphenation for readability
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: "justify", // Optional: Align text for better readability
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

        <Box>
{/* Countdown Timer */}
{car.showListing && !car.listingClosed && car.currBid < car.price && (
  <Box
    sx={{
      position: "absolute",
      top: 16,
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
        Math.floor((new Date(car.endTime) - new Date()) / (1000 * 60 * 60 * 24))
      )}d{" "}
      {Math.max(
        0,
        Math.floor(
          ((new Date(car.endTime) - new Date()) / (1000 * 60 * 60)) % 24
        )
      )}h
    </Typography>
  </Box>
)}


  </Box>


  {/* Car Details Accordion */}
  <Grid container spacing={2}>
    
    {/* Existing Accordion Sections */}
    {[
      {
        title: "Accident Data",
        details: (
          <>
            <Typography>Damage Severity: {car.damageSeverity || "N/A"}</Typography>
            <Typography>Point of Impact: {car.pointOfImpact || "N/A"}</Typography>
            <Typography>Repair Records: {car.repairRecords || "N/A"}</Typography>
            <Typography>Airbag Deployment: {car.airbagDeployment || "N/A"}</Typography>
            <Typography>Structural Damage: {car.structuralDamage || "N/A"}</Typography>
          </>
        ),
      },
      {
        title: "Service History",
        details: (
          <>
            <Typography>Oil Changes: {car.oilChanges || "N/A"}</Typography>
            <Typography>Tire Rotations: {car.tireRotations || "N/A"}</Typography>
            <Typography>Open Recalls: {car.openRecalls || "N/A"}</Typography>
            <Typography>Brake Rotor Replaced: {car.brakeRotorReplaced || "N/A"}</Typography>
            <Typography>Transmission Replaced: {car.transmissionReplaced || "N/A"}</Typography>
            <Typography>Safety Inspections: {car.safetyInspections || "N/A"}</Typography>
          </>
        ),
      },
      {
        title: "Ownership History",
        details: (
          <>
            <Typography>Type of Use: {car.typeOfUse || "N/A"}</Typography>
            <Typography>Previous Owners: {car.previousOwners || "N/A"}</Typography>
            <Typography>Ownership States: {car.ownershipStates || "N/A"}</Typography>
            <Typography>Ownership Length: {car.ownershipLength || "N/A"}</Typography>
            <Typography>Last Reported Mileage: {car.lastReportedMileage || "N/A"}</Typography>
            <Typography>Flood/Lemon Title: {car.floodOrLemonTitle || "N/A"}</Typography>
          </>
        ),
      },
    ].map((section, index) => (
      <Grid key={index} item xs={12} md={4}>
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
            <Typography>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>{section.details}</AccordionDetails>
        </Accordion>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
  {/* Check if auction is still open and current bid is less than the buy now price */}
  {car.showListing && !car.listingClosed && car.currBid < car.price ? (
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
            px: 3, // Padding for larger button
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
            px: 4, // Padding for larger button
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