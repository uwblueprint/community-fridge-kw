const Container = {
  variants: {
    headerContainer: {
      maxWidth: { base: "default", md: "70%" },
      px: { base: "42px", md: "0px" },
      py: "1.5em",
    },
    baseContainer: {
      maxWidth: { base: "default", md: "70%" },
      px: { base: "42px", md: "0px" },
      pt: "55px",
    },
    calendarContainer: {
      px: "0px",
      py: "0px",
      maxWidth: "100%",
    },
    responsiveContainer: {
      maxWidth: { base: "default", md: "70%" },
      px: { base: "42px", md: "0px" },
    },
  },
};

export default Container;
