"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Profile() {
  const { user, isLoading, error } = useUser();
  
  // Removed address/phone fetch and edit fields logic since it's no longer needed.
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <Box sx={{ padding: "2rem", marginTop: "40px" }}>
      <Grid container spacing={4}>
        <NavBar />
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardMedia
              component="img"
              image={user.picture}
              alt="Profile"
              sx={{
                borderRadius: "50%",
                width: 100,
                height: 100,
                mt: 2,
                mx: "auto",
                objectFit: "cover",
              }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Seller
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Long Island, NY
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" size="small" sx={{ mr: 1 }}>
                  Rate
                </Button>
                <Button variant="outlined" size="small">
                  Review
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                Rating: 3.4/5
              </Typography>

              {/* Descriptive Terms */}
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label="Clear"
                  variant="outlined"
                  sx={{ m: 0.5, boxShadow: 1 }}
                />
                <Chip
                  label="Concise"
                  variant="outlined"
                  sx={{ m: 0.5, boxShadow: 1 }}
                />
                <Chip
                  label="Responds Quickly"
                  variant="outlined"
                  sx={{ m: 0.5, boxShadow: 1 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Reviews moved below the left column profile card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Reviews</strong>
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  "Great experience! The seller was very responsive and the product was as described."
                </Typography>
                <Typography variant="caption" display="block" color="textSecondary">
                  - Anonymous
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography>
                  "Shipping was a bit slow, but the seller kept me informed throughout the process."
                </Typography>
                <Typography variant="caption" display="block" color="textSecondary">
                  - Anonymous
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography>
                  "The product quality was alright, not as good as expected but still acceptable."
                </Typography>
                <Typography variant="caption" display="block" color="textSecondary">
                  - Anonymous
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          {/* User Info Card (no edit fields now) */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Profile Information</strong>
              </Typography>
              <Typography variant="body1">
                <strong>Full Name:</strong> {user.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> Long Island, NY
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> (111)111-1111
              </Typography>
            </CardContent>
          </Card>

          {/* Balance Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Balance</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Balance: $3000
              </Typography>
              <Button variant="contained">Add Funds</Button>
            </CardContent>
          </Card>

          {/* Current Bids Accordion */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="current-bids-content"
                  id="current-bids-header"
                >
                  <Typography><strong>Current Bids</strong></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Replace with your bids data */}
                  <Typography>
                    You currently have no active bids.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>

          {/* Current Listings Accordion */}
          <Card>
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="current-listings-content"
                  id="current-listings-header"
                >
                  <Typography><strong>Current Listings</strong></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Replace with your listings data */}
                  <Typography>
                    You currently have no active listings.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
}
