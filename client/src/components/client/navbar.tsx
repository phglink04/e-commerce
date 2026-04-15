"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import ListItemButton from "@mui/material/ListItemButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArticleIcon from "@mui/icons-material/Article";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { fetchCart } from "@/lib/cart-api";
import { readAuthCookie } from "@/lib/auth-cookie";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const pages = ["Home", "Shop", "Blog", "About", "FAQ", "Contact"];
const links = ["/", "/shop", "/blog", "/about", "/faqs", "/contact"];

const theme = createTheme({
  palette: {
    primary: {
      main: "#15803D",
    },
  },
});

const drawerIcons = [
  <HomeIcon fontSize="small" key="home" />,
  <StoreIcon fontSize="small" key="shop" />,
  <InfoIcon fontSize="small" key="about" />,
  <HelpIcon fontSize="small" key="faq" />,
  <ContactMailIcon fontSize="small" key="contact" />,
  <ArticleIcon fontSize="small" key="blog" />,
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { token, hydrate, logout } = useAuthStore();
  const { cart, setCart } = useCartStore();

  const session = useMemo(() => readAuthCookie(), [pathname]);
  const isAuthenticated = Boolean(token || session?.token);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const activeToken = token || session?.token;
    if (!activeToken) {
      setCart([]);
      return;
    }

    void fetchCart(activeToken)
      .then((items) => setCart(items))
      .catch(() => setCart([]));
  }, [pathname, session?.token, setCart, token]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const navigateTo = (href: string) => {
    handleCloseUserMenu();
    setDrawerOpen(false);
    router.push(href);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "inline-flex", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img
                src="/frontend/logo/logo.png"
                alt="PlantWorld"
                width="150"
                height="150"
              />
            </Typography>

            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                marginLeft: "auto",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isAuthenticated && (
                <Link href="/cart" style={{ color: "white" }}>
                  <Badge
                    badgeContent={cart?.length || 0}
                    color="error"
                    overlap="circular"
                  >
                    <ShoppingCartIcon
                      style={{ fontSize: "24px", cursor: "pointer" }}
                    />
                  </Badge>
                </Link>
              )}
              <IconButton
                size="large"
                aria-label="menu"
                onClick={() => toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {pages.map((page, i) => (
                <Link
                  key={page + i}
                  href={links[i]}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                      transition: "color 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                ml: "auto",
                alignItems: "center",
                gap: 2,
              }}
            >
              {isAuthenticated && (
                <Tooltip title="View Cart">
                  <Link href="/cart" style={{ color: "white" }}>
                    <Badge
                      badgeContent={cart?.length || 0}
                      color="error"
                      overlap="circular"
                    >
                      <ShoppingCartIcon
                        style={{ fontSize: "28px", cursor: "pointer" }}
                      />
                    </Badge>
                  </Link>
                </Tooltip>
              )}
              {isAuthenticated ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Profile" src="/frontend/Profile.jpg" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
              )}
            </Box>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              slotProps={{
                paper: {
                  sx: {
                    width: 170,
                    borderRadius: 2,
                    boxShadow: 5,
                    color: "#15803D",
                    px: 2,
                    py: 1.5,
                  },
                },
              }}
            >
              {isAuthenticated
                ? [
                    <MenuItem
                      key="profile"
                      onClick={() => navigateTo("/profile")}
                      sx={{
                        px: 2,
                        pb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <AccountCircleIcon fontSize="small" />
                      <Typography>Profile</Typography>
                    </MenuItem>,
                    <MenuItem
                      key="orders"
                      onClick={() => navigateTo("/myOrders")}
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ReceiptLongIcon fontSize="small" />
                      <Typography>My Orders</Typography>
                    </MenuItem>,
                    <MenuItem
                      key="settings"
                      onClick={() => navigateTo("/settings")}
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <SettingsIcon fontSize="small" />
                      <Typography>Settings</Typography>
                    </MenuItem>,
                    <MenuItem
                      key="logout"
                      onClick={() => {
                        handleCloseUserMenu();
                        logout();
                        router.push("/login");
                      }}
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LogoutIcon fontSize="small" />
                      <Typography>Logout</Typography>
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="login"
                      onClick={() => navigateTo("/login")}
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LoginIcon fontSize="small" />
                      <Typography>Login</Typography>
                    </MenuItem>,
                  ]}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box sx={{ width: 220, pt: 2, height: "100%" }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1 }}>
            <IconButton onClick={() => toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {pages.map((page, i) => (
              <Link
                key={page + i}
                href={links[i]}
                style={{ textDecoration: "none", color: "black" }}
                onClick={() => toggleDrawer(false)}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ px: 2, py: 1 }}>
                    {drawerIcons[i]}
                    <ListItemText primary={page} sx={{ ml: 1 }} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>

          {isAuthenticated && (
            <Link
              href="/cart"
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => toggleDrawer(false)}
            >
              <ListItem disablePadding>
                <ListItemButton sx={{ px: 2, py: 1 }}>
                  <ShoppingCartIcon fontSize="small" />
                  <ListItemText primary="View Cart" sx={{ ml: 1 }} />
                </ListItemButton>
              </ListItem>
            </Link>
          )}

          <Box sx={{ px: 2, mt: 2 }}>
            {isAuthenticated ? (
              <>
                <Button
                  fullWidth
                  startIcon={<AccountCircleIcon />}
                  onClick={() => navigateTo("/profile")}
                >
                  Profile
                </Button>
                <Button
                  fullWidth
                  startIcon={<ReceiptLongIcon />}
                  onClick={() => navigateTo("/myOrders")}
                >
                  My Orders
                </Button>
                <Button
                  fullWidth
                  startIcon={<SettingsIcon />}
                  onClick={() => navigateTo("/settings")}
                >
                  Settings
                </Button>
                <Button
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    toggleDrawer(false);
                    logout();
                    router.push("/login");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                startIcon={<LoginIcon />}
                onClick={() => navigateTo("/login")}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}
