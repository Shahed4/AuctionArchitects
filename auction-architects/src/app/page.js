"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client"; // Import Auth0 hook
import NavBar from "./components/NavBar";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser(); // Access user data and loading state
  const [cars, setCars] = useState([]); // Stores data fetched from API
  const [filters, setFilters] = useState({
    model: "",
    year: "",
    price: "",
    minBid: "",
  });
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetch car data from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars"); // Fetch from API
        if (!response.ok) throw new Error("Failed to fetch cars");
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
      }
    };

    fetchCars();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const filtered = cars.filter((car) => {
      return (
        (filters.model
          ? car.model.toLowerCase().includes(filters.model.toLowerCase())
          : true) &&
        (filters.year ? car.year.toString() === filters.year : true) &&
        (filters.price ? car.price <= parseFloat(filters.price) : true) &&
        (filters.minBid ? car.minBid <= parseFloat(filters.minBid) : true)
      );
    });
    setFilteredCars(filtered);
  };

  // Handle card click
  const handleCardClick = (carId) => {
    router.push(`/car/${carId}`);
  };

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 0 }}
    >
      <Container maxWidth="lg" sx={{ p: 0 }}>
        <NavBar />

        {/* Hero Section */}
        <Box
          sx={{
            backgroundImage: `url(/28803.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h2" gutterBottom>
            Welcome to Auction Architects!
          </Typography>
          <Typography variant="h6">
            Auction Architects allows you to create, manage, and bid on
            auctions.
          </Typography>
        </Box>

        {/* Auction Section */}
        <Box sx={{ backgroundColor: "#000", py: 10 }}>
          <Typography variant="h4" gutterBottom>
            Car Auctions
          </Typography>

          {/* Filter Options */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="Model"
              variant="outlined"
              size="small"
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <TextField
              label="Year"
              variant="outlined"
              size="small"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <TextField
              label="Price (Max)"
              variant="outlined"
              size="small"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" }, type: "number" }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <TextField
              label="Minimum Bidding Price (Max)"
              variant="outlined"
              size="small"
              name="minBid"
              value={filters.minBid}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" }, type: "number" }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <Button
              variant="contained"
              onClick={applyFilters}
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Filter
            </Button>
          </Box>

          {/* Car Cards */}
          <Grid container spacing={3}>
            {filteredCars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    cursor: "pointer",
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #fff", // White border for the card
                    "&:hover": {
                      boxShadow: "0 0 10px #fff", // Optional hover effect
                    },
                  }}
                  onClick={() => handleCardClick(car._id)}
                >
                  {car.images?.[0] ? (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`https://utfs.io/f/${car.images[0]}`}
                      alt={`${car.model}`}
                      sx={{
                        border: "2px solid #000", // Black border around the image
                        objectFit: "cover", // Ensure the image fits well
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#1a1a1a", // Background for the placeholder
                        border: "2px solid #fff", // Match card styling
                      }}
                    >
                      <Typography variant="body2" color="#bdbdbd">
                        No images attached
                      </Typography>
                    </Box>
                  )}

                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center", // Center-align the title
                        color: "#fff", // White text color for the title
                      }}
                    >
                     {car.year} {car.make} {car.model}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", color: "#bdbdbd" }}>
                      Price: ${car.price} | Current Bid: ${car.currBid}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
