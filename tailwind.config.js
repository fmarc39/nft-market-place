module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "bg-img": "url('../public/assets/images/photography-3130594_1920.jpg')",
      }),
    },
    fontFamily: {
      sans: ["Roboto"],
    },
    colors: {
      red: "#F64C72",
      green: "#00EE95",
      purple: "#553D67",
      lightBlue: "#A8D0E6",
      blue: "#00A7F3",
      darkBlue: "#2F2FA2",
      white9: "rgb(255, 255, 255, 0.95)",
      white5: "rgb(255, 255, 255, 0.5)",
      white: "#FFF",
      black: "#000",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
