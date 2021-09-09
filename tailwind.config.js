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
      blue4: "rgb(0, 167, 243, 0.9)",
      darkBlue: "#2F2FA2",
      white9: "rgb(255, 255, 255, 0.95)",
      white5: "rgb(255, 255, 255, 0.5)",
      white1: "rgb(255, 255, 255, 0.2)",
      white: "#FFF",
      black: "#000",
      grey: "#f2e9e4",
      lightBlack: "#2D2D2E",
      bgModal: "#3D3D3D",
      bgExtModal: "rgb(12, 12, 12, 0.9)",
      // tags
      abstract: "#f382ab",
      aerial: "#08e6ff",
      annimals: "#10563c",
      architecture: "#717977",
      astrophotography: "#21294a",
      culinary: "#ffc58f",
      landscapes: "#eace4c",
      street: "#d9ec30",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
