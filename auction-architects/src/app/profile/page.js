"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Profile() {
  const { user, isLoading, error } = useUser();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [editFields, setEditFields] = useState({
    firstName: "",
    lastName: "",
    generalLocation: "",
    phoneNumber: "",
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.sub) return; // Ensure user.sub is available before making the request

      try {
        const response = await fetch(`/api/users/${user.sub}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo(data);
        setEditFields({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          generalLocation: data.generalLocation || "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (err) {
        console.error("Error fetching user info:", err.message);
        setFetchError(err.message); // Store the fetch error
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserInfo();
  }, [user?.sub]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (
      editFields.firstName === "" ||
      editFields.lastName === "" ||
      editFields.generalLocation === "" ||
      editFields.phoneNumber === ""
    ) {
      alert("Fill in all fields.");
      return;
    }

    if (editFields.phoneNumber.length != 10) {
      alert("Input in a real phone number");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.sub}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editFields.firstName,
          lastName: editFields.lastName,
          generalLocation: editFields.generalLocation,
          phoneNumber: editFields.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user info");
      }

      // Fetch the updated user info after saving changes
      const updatedResponse = await fetch(`/api/users/${user.sub}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated user info");
      }

      const updatedUserInfo = await updatedResponse.json();
      setUserInfo(updatedUserInfo);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user info:", err.message);
      alert("Failed to update profile. Please try again later.");
    }
  };

  if (isLoading || isLoadingData)
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

  if (!isLoading && !user) {
    router.push("/api/auth/login");
  }

  if (!user) return null;

  return (
    <Box sx={{ padding: "2rem", marginTop: "40px" }}>
      <Grid container spacing={4}>
        <NavBar />
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 2, mb: 3 }}>
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
                {userInfo.firstName} {userInfo.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Seller
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {userInfo.generalLocation}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                {userInfo.reviews.length === 0
                  ? "No Ratings Yet"
                  : `Rating: ${(
                      userInfo.reviews.reduce(
                        (sum, review) => sum + review.score,
                        0
                      ) / userInfo.reviews.length
                    ).toFixed(1)}/5`}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
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

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Balance</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Balance: ${userInfo.balance}
              </Typography>
              <Button variant="contained">Add Funds</Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Reviews</strong>
              </Typography>
              {userInfo.reviews.length === 0 ? (
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  No Reviews Yet
                </Typography>
              ) : (
                userInfo.reviews.map((review, index) => (
                  <React.Fragment key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Typography>{review.message}</Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="textSecondary"
                      >
                        - Anonymous
                      </Typography>
                    </Box>
                    {index < userInfo.reviews.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </React.Fragment>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Edit Profile Information</strong>
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editFields.firstName}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editFields.lastName}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="General Location"
                name="generalLocation"
                value={editFields.generalLocation}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                type="number"
                name="phoneNumber"
                value={editFields.phoneNumber}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Balance</strong>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Balance: ${userInfo.balance}
              </Typography>
              <Button variant="contained">Add Funds</Button>
            </CardContent>
          </Card> */}

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="current-bids-content"
                  id="current-bids-header"
                >
                  <Typography>
                    <strong>Current Bids</strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {userInfo.userBids.length === 0 ? (
                    <Typography>You have't placed any bids.</Typography>
                  ) : (
                    userInfo.userBids.map((listingID) => (
                      <Typography key={listingID}>
                        <a
                          href={`/car/${listingID}`}
                          style={{ textDecoration: "none", color: "blue" }}
                        >
                          View Listing {listingID}
                        </a>
                      </Typography>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="current-listings-content"
                  id="current-listings-header"
                >
                  <Typography>
                    <strong>My Listings</strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {userInfo.userListings.length === 0 ? (
                    <Typography>You haven't created any listings.</Typography>
                  ) : (
                    userInfo.userListings.map((listingID) => (
                      <Typography key={listingID}>
                        <a
                          href={`/car/${listingID}`}
                          style={{ textDecoration: "none", color: "blue" }}
                        >
                          View Listing {listingID}
                        </a>
                      </Typography>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
