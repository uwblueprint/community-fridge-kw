const Container = {
  variants: {
    baseContainer: {
      px: "32px",
      pt: "0.5rem",
      maxWidth: ["default", "70%"],
    },
    responsiveContainer: {
      px: ["42px", "0px"],
      maxWidth: ["default", "70%"],
    },
    dashboardContainer: {
      px: ["42px", "0px"],
      pt: ["55px", "121px"],
      maxWidth: ["default", "70%"],
    },
  },
};

export default Container;
