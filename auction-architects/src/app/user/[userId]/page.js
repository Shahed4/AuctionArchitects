"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter, useParams } from "next/navigation";
import NavBar from "../../components/NavBar";
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
  Rating,
} from "@mui/material";

export default function UserProfile() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  const [profileData, setProfileData] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewRating, setReviewRating] = useState(0); // Rating state
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProfileData();
  }, [userId, router]);

  const handleSubmitReview = async () => {
    if (!reviewMessage || reviewRating === 0) {
      alert("Please provide a review message and select a rating.");
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${profileData.auth0Id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: reviewMessage,
          rating: reviewRating,
          reviewerId: user.sub,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      alert("Review submitted successfully!");
      setReviewMessage("");
      setReviewRating(0); // Reset the rating

      // Refresh profile data after submitting the review
      const refreshedResponse = await fetch(`/api/users/${userId}`);
      if (refreshedResponse.ok) {
        const refreshedData = await refreshedResponse.json();
        setProfileData(refreshedData);
      }
    } catch (error) {
      console.error(error.message);
      alert("Failed to submit review. Please try again later.");
    }
  };

  if (!profileData || isLoadingData) {
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

  if (!isLoadingData && profileData.roles.includes("admin")) {
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
        <Typography>Page Doesn&apos;t Exist. Admins Can&apos;t Be Reviewed</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", marginTop: "40px" }}>
      <NavBar />
      <Grid container spacing={4} justifyContent="center">
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
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {profileData.generalLocation}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {profileData.isSuspended ? (
                <Typography
                  variant="h6"
                  sx={{ color: "red", fontWeight: "bold", mb: 2 }}
                >
                  This profile is suspended.
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ color: "green", mb: 2 }}>
                  This profile is active.
                </Typography>
              )}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Suspension Count: {profileData.numSuspensions || 0}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Rating:{" "}
                {profileData.reviews.length === 0
                  ? "No Ratings Yet"
                  : `${(
                      profileData.reviews.reduce(
                        (sum, review) => sum + review.rating,
                        0
                      ) / profileData.reviews.length
                    ).toFixed(1)}/5`}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Write a Review</strong>
              </Typography>
              {userId !== user?.sub && (
                <Box sx={{ mt: 3 }}>
                  <Rating
                    value={reviewRating}
                    onChange={(e, newValue) => setReviewRating(newValue)}
                    precision={1}
                    size="large"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Leave a Review"
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitReview}
                  >
                    Submit Review
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Reviews</strong>
              </Typography>
              {profileData.reviews.length === 0 ? (
                <Typography>No Reviews Yet</Typography>
              ) : (
                profileData.reviews.map((review, index) => (
                  <React.Fragment key={index}>
                    <Typography>
                      {review.message} —{" "}
                      <Rating
                        value={review.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                    </Typography>
                    {index < profileData.reviews.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </React.Fragment>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
