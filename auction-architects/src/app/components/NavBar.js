"use client";

import React from "react";
import { AppBar, Toolbar, Button, Typography, IconButton, Box, ButtonBase } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        {/* Spacer Box with flexGrow to push items to the right */}
        <Box sx={{ flexGrow: 1 }}>
          <ButtonBase
            onClick={() => router.push("/")}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              color: "#fff",
              // Add hover/active states
              ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              ":active": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Typography variant="h6">
              Auction Architects
            </Typography>
          </ButtonBase>
        </Box>

        {/* Right-aligned buttons */}
        {!isLoading && user && (
          <Button color="inherit" onClick={() => router.push("/sell")}>
            Sell
          </Button>
        )}

        {!isLoading && user && (
          <IconButton color="inherit" onClick={() => router.push("/profile")}>
            <AccountCircleIcon />
          </IconButton>
        )}

        {!isLoading &&
          (user ? (
            <Button color="inherit" href="/api/auth/logout">
              Logout
            </Button>
          ) : (
            <Button color="inherit" href="/api/auth/login">
              Login
            </Button>
          ))}
      </Toolbar>
    </AppBar>
  );
}
