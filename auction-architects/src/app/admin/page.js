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
const AdminCard = ({
  title,
  subtitle,
  onAction,
  actionLabel,
  isInactive,
}) => (
  <Card
    sx={{
      backgroundColor: isInactive ? "#808080" : "#1a1a1a", // Gray for inactive listings, default for active
      color: isInactive ? "#000" : "#fff",
      border: "1px solid #fff",
      mb: 2,
    }}
  >
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="#bdbdbd" gutterBottom>
        {subtitle}
      </Typography>
      <Typography variant="body2" color={isInactive ? "#B71C1C" : "#616161"}>
        Status: {isInactive ? "Inactive" : "Active"}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: isInactive ? "#4caf50" : "#d32f2f", // Green for Reactivate, Red for Deactivate
          color: "#fff",
        }}
        onClick={onAction}
      >
        {actionLabel}
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

        // Sort users by number of suspensions (descending order)
        usersData.sort((a, b) => (b.numSuspensions || 0) - (a.numSuspensions || 0));

        setUsers(usersData);
        setCars(carsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleToggleShowListing = async (carId) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData.error);
        throw new Error(errorData.error || "Failed to toggle showListing");
      }
  
      const { car } = await response.json();
      setCars((prevCars) =>
        prevCars.map((prevCar) =>
          prevCar._id === carId ? car : prevCar
        )
      );
  
      alert("Listing visibility toggled successfully.");
    } catch (error) {
      console.error("Error toggling showListing:", error.message);
    }
  };
  
 
  
  const handleHideListing = async (carId) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData.error);
        throw new Error(errorData.error || "Failed to update listing");
      }
  
      alert("Listing hidden successfully.");
    } catch (error) {
      console.error("Error hiding listing:", error.message);
    }
  };
  
  
  
  // Inside your car listings render function
  cars.map((car) => (
    <AdminCard
      key={car._id}
      title={`${car.make} ${car.model}`}
      subtitle={`Price: $${car.price} | Year: ${car.year}`}
      onAction={() => handleHideListing(car._id)}
      actionLabel="Hide Listing"
    />
  ));
  
  // Handle user suspension or unsuspension
  const handleSuspendOrUnsuspendUser = async (userId, action) => {
    try {
      const response = await fetch(`/api/users/update-suspension/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }), // Pass the action: "suspend" or "unsuspend"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user suspension");
      }

      const { user: updatedUser } = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.auth0Id === userId ? updatedUser : user
        )
      );

      alert(
        `User ${
          action === "suspend" ? "suspended" : "unsuspended"
        } successfully.`
      );
    } catch (error) {
      console.error(`Error ${action}ing user:`, error.message);
    }
  };

  // Handle car listing removal
  const handleRemoveCar = async (carId) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, { method: "PATCH" });
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
            users.map((user) => {
              const isBanned = (user.numSuspensions || 0) >= 3;
              const status = isBanned
                ? "Permanently Banned"
                : user.isSuspended
                ? "Suspended"
                : "Active";

              return (
                <AdminCard
                  key={user._id}
                  title={user.email || "Unknown User"}
                  subtitle={`Suspensions: ${user.numSuspensions || 0}`}
                  status={status}
                  onAction={() =>
                    handleSuspendOrUnsuspendUser(
                      user.auth0Id,
                      user.isSuspended ? "unsuspend" : "suspend"
                    )
                  }
                  actionLabel={user.isSuspended ? "Unsuspend User" : "Suspend User"}
                  isBanned={isBanned} // Indicates if the user is permanently banned
                />
              );
            })
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
        onAction={() => handleToggleShowListing(car._id)}
        actionLabel={car.showListing ? "Hide Listing" : "Show Listing"}
        isInactive={!car.showListing} // Treat showListing=false as inactive
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
