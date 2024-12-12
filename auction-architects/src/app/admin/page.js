"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import useUserInfo from "../../hooks/useUserInfo";

// Reusable Admin Card Component for Users or Listings
const AdminCard = ({ title, subtitle, onRemove }) => (
  <Card
    sx={{
      backgroundColor: "#1a1a1a",
      color: "#fff",
      border: "1px solid #fff",
      mb: 2,
    }}
  >
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="#bdbdbd" gutterBottom>
        {subtitle}
      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#d32f2f", color: "#fff" }}
        onClick={onRemove}
      >
        Remove
      </Button>
    </CardContent>
  </Card>
);

export default function Admin() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const {
    userInfo,
    isLoading: isLoadingUserInfo,
    fetchError,
  } = useUserInfo(user);

  // Redirect non-admin users to the homepage
  useEffect(() => {
    if (!isLoading && !isLoadingUserInfo) {
      if (userInfo && !userInfo.roles.includes("admin")) {
        router.push("/");
      }
    }
  }, [isLoading, isLoadingUserInfo, userInfo, router]);

  // Fetch users and car listings from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, carRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/cars"),
        ]);

        if (!userRes.ok || !carRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [usersData, carsData] = await Promise.all([
          userRes.json(),
          carRes.json(),
        ]);

        setUsers(usersData);
        setCars(carsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  // Handle user removal
  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove user");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("User removed successfully.");
    } catch (error) {
      console.error("Error removing user:", error.message);
    }
  };

  // Handle car listing removal
  const handleRemoveCar = async (carId) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove car");
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      alert("Car listing removed successfully.");
    } catch (error) {
      console.error("Error removing car:", error.message);
    }
  };

  // Loading state
  if (isLoading || isLoadingUserInfo) {
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

  if (fetchError) {
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
        <Typography>Error: {fetchError.message}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
        py: 0,
      }}
    >
      <NavBar />

      <Box sx={{ p: 4 }}>
        {/* Admin Panel Header */}
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Divider sx={{ mb: 4, backgroundColor: "#fff" }} />

        {/* Manage Users Section */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Manage Users
          </Typography>
          {users.length > 0 ? (
            users.map((user) => (
              <AdminCard
                key={user._id}
                title={user.name || "Unknown User"}
                subtitle={user.email || "No email available"}
                onRemove={() => handleRemoveUser(user._id)}
              />
            ))
          ) : (
            <Typography>No users available.</Typography>
          )}
        </Box>

        {/* Manage Car Listings Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Manage Car Listings
          </Typography>
          {cars.length > 0 ? (
            cars.map((car) => (
              <AdminCard
                key={car._id}
                title={`${car.make} ${car.model}`}
                subtitle={`Price: $${car.price} | Year: ${car.year}`}
                onRemove={() => handleRemoveCar(car._id)}
              />
            ))
          ) : (
            <Typography>No car listings available.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
