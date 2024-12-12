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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Reusable Car Card Component
const CarCard = ({ car, onClick }) => (
  <Card
    sx={{
      maxWidth: 345,
      cursor: "pointer",
      backgroundColor: "#1a1a1a",
      border: "2px solid #fff",
      "&:hover": { boxShadow: "0 0 10px #fff" },
    }}
    onClick={onClick}
  >
    {car.images?.[0] ? (
      <CardMedia
        component="img"
        height="140"
        image={`https://utfs.io/f/${car.images[0]}`}
        alt={`${car.model}`}
        sx={{ border: "2px solid #000", objectFit: "cover" }}
      />
    ) : (
      <Box
        sx={{
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          border: "2px solid #fff",
        }}
      >
        <Typography variant="body2" color="#bdbdbd">
          No images attached
        </Typography>
      </Box>
    )}
    <CardContent>
      <Typography variant="h6" sx={{ textAlign: "center", color: "#fff" }}>
        {car.make} {car.model}
      </Typography>
      <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
        Year: {car.year} | Price: ${car.price}
      </Typography>
      {car.minBid && (
        <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
          Minimum Bid: ${car.minBid}
        </Typography>
      )}
      {car.purchasedPrice && (
        <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
          Purchased Price: ${car.purchasedPrice}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Reusable Accordion Component
const AccordionSection = ({ title, items, loading, onCardClick }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${title.toLowerCase()}-content`}
          id={`${title.toLowerCase()}-header`}
        >
          <Typography>
            <strong>{title}</strong>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
            <Typography>Loading {title.toLowerCase()}...</Typography>
          ) : items.length === 0 ? (
            <Typography>
              You haven't added any {title.toLowerCase()}.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {items.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car._id}>
                  <CarCard car={car} onClick={() => onCardClick(car._id)} />
                </Grid>
              ))}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
    </CardContent>
  </Card>
);

export default function Profile() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [editFields, setEditFields] = useState({
    firstName: "",
    lastName: "",
    generalLocation: "",
    phoneNumber: "",
  });
  const [carBids, setCarBids] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);

  const fetchData = async (url, ids) => {
    if (!ids || ids.length === 0) return [];
    const data = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch data for ID: ${id}`);
        return response.json();
      })
    );
    return data;
  };

  const capitalizeRoles = (roles) =>
    roles.map((role) => role.charAt(0).toUpperCase() + role.slice(1));

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.sub) return;
      try {
        const response = await fetch(`/api/users/${user.sub}`);
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUserInfo(data);
        setEditFields({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          generalLocation: data.generalLocation || "",
          phoneNumber: data.phoneNumber || "",
        });

        const [bids, listings, purchases] = await Promise.all([
          fetchData("/api/cars", data.userBids),
          fetchData("/api/cars", data.userListings),
          fetchData("/api/cars", data.userPurchases),
        ]);

        setCarBids(bids);
        setMyListings(listings);
        setMyPurchases(purchases);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Function to add "seller" role to the user
  const handleBecomeSeller = async () => {
    if (
      userInfo.firstName === "" ||
      userInfo.lastName === "" ||
      userInfo.generalLocation === "" ||
      userInfo.phoneNumber.length != 10
    ) {
      alert("Complete Profile Information To Become Seller");
      return;
    }

    try {
      const response = await fetch(`/api/users/update-roles/${user.sub}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "seller" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user roles");
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

      alert("Added role successfully!");
    } catch (err) {
      console.error("Error updating user roles:", err.message);
      alert("Failed to update roles. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/users/${user.sub}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFields),
      });

      if (!response.ok) throw new Error("Failed to update user info");

      const updatedData = await response.json();

      // Update userInfo while preserving other properties
      setUserInfo((prev) => ({
        ...prev,
        ...editFields, // Merge updated fields into userInfo
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
      console.error(error.message);
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
    return null;
  }

  return (
    <Box sx={{ padding: "2rem", marginTop: "40px" }}>
      <Grid container spacing={4}>
        <NavBar />
        <Grid item xs={12} md={4}>
          {/* Profile Section */}
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
              <Box>
                {" "}
                <Typography variant="body2" color="textSecondary">
                  {" "}
                  {userInfo.roles.includes("admin") ? (
                    <>Admin</>
                  ) : userInfo.roles.includes("buyer-vip") &&
                    userInfo.roles.includes("seller") ? (
                    <>Buyer-VIP | Seller</>
                  ) : userInfo.roles.includes("buyer") &&
                    userInfo.roles.includes("seller") ? (
                    <>Buyer | Seller</>
                  ) : userInfo.roles.includes("buyer-vip") &&
                    userInfo.roles.includes("buyer") ? (
                    <>Buyer-VIP</>
                  ) : (
                    <>{capitalizeRoles(userInfo.roles).join(" | ")}</>
                  )}{" "}
                </Typography>{" "}
                {!userInfo.roles.includes("seller") && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px" }}
                    onClick={handleBecomeSeller}
                  >
                    {" "}
                    Become a Seller{" "}
                  </Button>
                )}{" "}
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
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
            </CardContent>
          </Card>

          {/* Balance Section */}
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

          {/* Reviews Section */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                <strong>Reviews</strong>
              </Typography>
              {userInfo.reviews.length === 0 ? (
                <Typography>No Reviews Yet</Typography>
              ) : (
                userInfo.reviews.map((review, index) => (
                  <React.Fragment key={index}>
                    <Typography>{review.message}</Typography>
                    {index < userInfo.reviews.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </React.Fragment>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Profile and Accordions */}
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

          {/* Accordion Sections */}
          <AccordionSection
            title="My Bids"
            items={carBids}
            loading={isLoadingData}
            onCardClick={(id) => router.push(`/car/${id}`)}
          />
          <AccordionSection
            title="My Listings"
            items={myListings}
            loading={isLoadingData}
            onCardClick={(id) => router.push(`/car/${id}`)}
          />
          <AccordionSection
            title="My Purchases"
            items={myPurchases}
            loading={isLoadingData}
            onCardClick={(id) => router.push(`/car/${id}`)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
