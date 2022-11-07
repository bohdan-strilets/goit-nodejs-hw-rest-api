const { User } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const cloudinary = require("cloudinary").v2;

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
  secure: true,
});

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { path: tmpUpload, originalname } = req.file;
  const { _id } = req.user;
  const imageName = `${_id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, imageName);

    await jimp
      .read(tmpUpload)
      .then((image) => image.resize(250, 180).write(resultUpload))
      .catch((error) => console.log(error));

    fs.unlink(tmpUpload);

    const cloudinaryRes = await cloudinary.uploader.upload(
      `public/avatars/${imageName}`,
      {
        upload_preset: "go2em04u",
      }
    );

    await User.findByIdAndUpdate(req.user._id, {
      avatarURL: cloudinaryRes.url,
    });

    if (cloudinaryRes) {
      fs.unlink(resultUpload);
    }

    return res.json({
      avatarURL: cloudinaryRes.url,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = updateAvatar;
