const getCurrent = async (req, res) => {
  const { name, email, subscription, avatarURL } = req.user;

  res.json({
    status: "succes",
    code: 200,
    user: {
      name,
      email,
      subscription,
      avatarURL,
    },
  });
};

module.exports = getCurrent;
