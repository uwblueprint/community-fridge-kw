const Button = {
  variants: {
    navigation: {
      background: "raddish.100",
      color: "squash.100",
      fontSize: "16px",
      py: "20px",
      px: "53px",
      _disabled: {
        background: "hubbard.100",
      },
      _hover: {
        _disabled: {
          background: "hubbard.100",
        },
      },
    },
    cancelNavigation: {
      border: "1px",
      borderColor: "hubbard.100",
      color: "hubbard.100",
      size: "lg",
      width: "100%",
    },
    editInfo: {
      border: "none",
      color: "hubbard.100",
      fontSize: "14px",
      height: "20px",
      width: "28px",
      background: "none",
      marginBottom: "10px",
    },
    cancelEditInfo: {
      border: "none",
      color: "black.100",
      height: "12.73px",
      width: "12.73px",
      background: "none",
      marginBottom: "10px",
    },
    deleteDonation: {
      background: "tomato.100",
      color: "squash.100",
    },
    changePassword: {
      border: "1px",
      borderColor: "raddish.100",
      color: "raddish.100",
      fontSize: "16px",
      py: "12px",
      px: "53px",
    },
    edit: {
      color: "hubbard.100",
      fontSize: "16px",
      fontWeight: 300,
      textDecoration: "underline",
    },
    viewDetails: {
      border: "1px",
      borderColor: "raddish.100",
      color: "raddish.100",
      fontSize: "16px",
      height: "38px",
      width: "153px",
      py: "12px",
      px: "53px",
    },

    approve: {
      background: "raddish.100",
      color: "squash.100",
      fontSize: "14px",
      py: "12px",
      px: "16px",
      _disabled: {
        background: "hubbard.100",
      },
      _hover: {
        _disabled: {
          background: "hubbard.100",
        },
      },
    },
    export: {
      background: "none",
      border: "1px",
      borderColor: "dorian.100",
      color: "hubbard.100",
      fontSize: "14px",
      py: "20px",
      px: "20px",
      lineHeight: "20px",
      fontWeight: "400",
    },
    exportMobile: {
      background: "dorian.100",
      border: "none",
      color: "hubbard.100",
      fontSize: "14px",
      py: "20px",
      px: "20px",
      lineHeight: "20px",
      fontWeight: "400",
    },
    create: {
      background: "raddish.100",
      color: "white",
      border: "1px",
      borderColor: "champagne.100",
      fontSize: "14px",
      py: "20px",
      px: "53px",
      lineHeight: "20px",
    },
  },
};

export default Button;
