const cloudinary = require("cloudinary").v2;

const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    console.log("Cloudinary Connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = cloudinaryConnect;
