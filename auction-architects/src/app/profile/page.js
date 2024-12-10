"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Profile() {
  const { user, isLoading, error } = useUser();
  const [additionalInfo, setAdditionalInfo] = useState({
    address: "",
    phone: "",
  });
  const [savedInfo, setSavedInfo] = useState(null);

  useEffect(() => {
    const fetchSavedInfo = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.sub}`);
          if (response.ok) {
            const data = await response.json();
            setSavedInfo(data);
            setAdditionalInfo({
              address: data.address || "",
              phone: data.phone || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch additional user info:", error);
        }
      }
    };

    fetchSavedInfo();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user.sub}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(additionalInfo),
      });

      if (response.ok) {
        alert("Information saved successfully!");
      } else {
        alert("Failed to save information.");
      }
    } catch (error) {
      console.error("Error saving additional info:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <Box sx={{ padding: "2rem" }}>
      <Grid container spacing={4}>
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
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          {/* User Info Card */}
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
                <strong>Address:</strong> Long Island, NY{additionalInfo.address}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> (111)111-1111{additionalInfo.phone}
              </Typography>
              {/* Edit Form */}
              <Box component="form" onSubmit={handleSave} sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Edit Additional Information
                </Typography>
                <TextField
                  label="Address"
                  name="address"
                  value={additionalInfo.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={additionalInfo.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Save Information
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Single Accordion for Reviews */}
          <Card>
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="reviews-content"
                  id="reviews-header"
                >
                  <Typography><strong>Reviews</strong></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <Typography>
                      "Great experience! The seller was very responsive and the
                      product was as described."
                    </Typography>
                    <Typography variant="caption" display="block" color="textSecondary">
                      - Anonymous
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography>
                      "Shipping was a bit slow, but the seller kept me informed
                      throughout the process."
                    </Typography>
                    <Typography variant="caption" display="block" color="textSecondary">
                      - Anonymous
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography>
                      "The product quality was alright, not as good as expected
                      but still acceptable."
                    </Typography>
                    <Typography variant="caption" display="block" color="textSecondary">
                      - Anonymous
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
