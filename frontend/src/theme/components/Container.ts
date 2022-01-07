const Container = {
  variants: {
    baseContainer: {
      px: "32px",
      pt: "0.5rem",
      maxWidth: ["default", "70%"],
    },
    responsiveContainer: {
      p: ["30px", "2rem 1rem"],
      maxWidth: ["default", "70%"],
    },
    dashboardContainer: {
      px: ["33px", "0px"],
      pt: ["55px", "121px"],
      maxWidth: ["default", "70%"],
    },
  },
};

export default Container;
