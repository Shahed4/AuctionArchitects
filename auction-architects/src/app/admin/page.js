"use client";

import React, { useEffect, useState } from "react";
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
  Divider,
} from "@mui/material";

// Reusable Card for Users or Listings
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);

  // Redirect non-admin users

  // Fetch users and cars
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, carRes] = await Promise.all([
          fetch("/api/users"), // Fetch all users
          fetch("/api/cars"), // Fetch all car listings
        ]);

        if (!userRes.ok || !carRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [userData, carData] = await Promise.all([
          userRes.json(),
          carRes.json(),
        ]);

        setUsers(userData);
        setCars(carData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove user");

      setUsers(users.filter((user) => user._id !== userId));
      alert("User removed successfully.");
    } catch (error) {
      console.error("Error removing user:", error.message);
    }
  };

  const handleRemoveCar = async (carId) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove car");

      setCars(cars.filter((car) => car._id !== carId));
      alert("Car listing removed successfully.");
    } catch (error) {
      console.error("Error removing car:", error.message);
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

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 0 }}
    >
      <NavBar />

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Divider sx={{ mb: 4, backgroundColor: "#fff" }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Manage Users
          </Typography>
          {users.map((user) => (
            <AdminCard
              key={user._id}
              title={user.name || "Unknown User"}
              subtitle={user.email || "No email available"}
              onRemove={() => handleRemoveUser(user._id)}
            />
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Manage Car Listings
          </Typography>
          {cars.map((car) => (
            <AdminCard
              key={car._id}
              title={`${car.make} ${car.model}`}
              subtitle={`Price: $${car.price} | Year: ${car.year}`}
              onRemove={() => handleRemoveCar(car._id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
