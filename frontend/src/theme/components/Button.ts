const Button = {
  variants: {
    navigation: {
      background: "raddish.100",
      color: "squash.100",
      fontSize: "16px",
      py: "20px",
      px: "53px",
      _disabled: {
        background: 'hubbard.100',
      },
      _hover: {
        _disabled: {
          background: 'hubbard.100',
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
  },
};

export default Button;
