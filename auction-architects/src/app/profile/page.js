"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Box, Typography, TextField, Button } from "@mui/material";

export default function Profile() {
  const { user, isLoading, error } = useUser();
  const [additionalInfo, setAdditionalInfo] = useState({
    address: "",
    phone: "",
  });
  const [savedInfo, setSavedInfo] = useState(null);

  useEffect(() => {
    // Fetch additional user info from your database
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
    <Box sx={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4">Welcome, {user.name}!</Typography>
      <img
        src={user.picture}
        alt="Profile"
        style={{
          borderRadius: "50%",
          width: "100px",
          height: "100px",
          margin: "1rem 0",
        }}
      />
      <Typography>Email: {user.email}</Typography>

      <form onSubmit={handleSave}>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Add Additional Information
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
      </form>
    </Box>
  );
}
