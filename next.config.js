const withImages = require("next-images");

module.exports = withImages({
  images: {
    domains: ["ipfs.infura.io"],
  },
  webpack(config, options) {
    return config;
  },
});
