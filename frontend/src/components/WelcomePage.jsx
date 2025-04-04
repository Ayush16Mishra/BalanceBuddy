import React from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import AppAppBar from "./AppBar";

const Wave = ({ color, duration, delay, position, flip }) => (
  <motion.div
    initial={{ y: 20 }}
    animate={{ y: [-20, 20, -20] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    style={{
      position: "absolute",
      bottom: position,
      width: "100%",
      height: "auto",
      zIndex: position === 0 ? 3 : position === 50 ? 2 : 1,
      transform: flip ? "scaleY(-1)" : "none",
    }}
  >
    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={color}
        fillOpacity="1"
        d="M0,192L60,181.3C120,171,240,149,360,138.7C480,128,600,128,720,144C840,160,960,192,1080,197.3C1200,203,1320,181,1380,170.7L1440,160V320H0Z"
      />
    </svg>
  </motion.div>
);

const features = [
  {
    title: "Effortless Bill Splitting",
    text: "Never worry about who owes what. BalanceBuddy ensures fair and transparent bill splitting among friends and groups.",
    image: "/tt.jpg"
  },
  {
    title: "Sponsor a Friend's Spending",
    text: "Want to cover a friend’s cost? Easily sponsor someone's transactions with a single click and keep things fair.",
    image: "/sponsor.jpg"
  },
  {
    title: "Smart Transaction Tagging",
    text: "Categorize your expenses with custom tags, making it easy to filter and track your spending habits.",
    image: "/tt.jpg"
  },
  {
    title: "Powerful Spending Insights",
    text: "Visualize your financial health with intuitive graphs and analytics, helping you make smarter money decisions.",
    image: "/chart2.jpg"  
  },
];

const WelcomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a0dad, #9c27b0)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />

      <AppAppBar />

      {/* Welcome Message (without box) */}
      <Box
        minHeight="80vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        textAlign="center"
        zIndex={2}
        color="white"
      >
        {/* Waves */}
        <Wave color="#9137d9" duration={10} delay={0} position={150} />
        <Wave color="#7715c3" duration={8} delay={1} position={70} flip={true} />
        <Wave color="#5a0ea3" duration={6} delay={2} position={-25} />

        {/* Animated Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ zIndex: 4 }}
        >
          <Typography variant="h2" fontWeight="bold">
            Welcome to BalanceBuddy
          </Typography>
          <Typography variant="h5" mt={1}>
            Your smart way to track expenses and split bills with ease.
          </Typography>
        </motion.div>
      </Box>

      {/* Content Sections */}
      <Container sx={{ zIndex: 2, position: "relative" }}>
        {features.map((feature, index) => (
          <Grid
            key={index}
            container
            spacing={4}
            alignItems="center"
            minHeight="80vh"
            sx={{ color: "white" }}
          >
            <Grid item xs={12} md={6} order={{ xs: 2, md: index % 2 === 0 ? 1 : 2 }}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography>{feature.text}</Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: index % 2 === 0 ? 2 : 1 }}>
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <Box
      component="img"
      src={feature.image} // Uses the placeholder images from the array
      alt={feature.title}
      sx={{
        width: "100%",
        maxWidth: "400px",
        height: "250px",
        objectFit: "cover",
        borderRadius: "8px",
        display: "block",
        mx: "auto",
        boxShadow: 3, // Adds a subtle shadow for a cleaner look
      }}
    />
  </motion.div>
</Grid>
          </Grid>
        ))}
      </Container>
    </Box>
  );
};

export default WelcomePage;
