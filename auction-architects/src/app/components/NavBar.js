"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Box,
  ButtonBase,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useUserInfo from "../../hooks/useUserInfo";

export default function NavBar() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const { userInfo, isLoadingData, fetchError } = useUserInfo(user);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "transparent", // Set the background to transparent
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <ButtonBase
            onClick={() => router.push("/")}
            sx={{
              textTransform: "none",
              borderRadius: 1,
              color: "#fff",
              ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              ":active": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Typography variant="h6">Auction Architects</Typography>
          </ButtonBase>
        </Box>

        {!isLoading && user && (
          <Button color="inherit" onClick={() => router.push("/sell")}>
            Sell
          </Button>
        )}

        {!isLoading && user && (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  router.push("/profile");
                  handleMenuClose();
                }}
              >
                Profile
              </MenuItem>
              {userInfo?.roles.includes("admin") && (
                <MenuItem
                  onClick={() => {
                    router.push("/admin");
                    handleMenuClose();
                  }}
                >
                  Admin
                </MenuItem>
              )}

              <MenuItem
                onClick={() => {
                  document.cookie =
                    "auth0.is.authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.location.href = "/api/auth/logout?federated";
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        )}

        {!isLoading && !user && (
          <Button color="inherit" href="/api/auth/login?prompt=login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
