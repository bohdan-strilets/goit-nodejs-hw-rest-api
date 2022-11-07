const { User } = require("../../models");

const updateSubscription = async (req, res) => {
  const { subscription, _id } = req.user;
  const user = await User.findByIdAndUpdate(
    _id,
    { ...req.body },
    { new: true }
  );

  if (subscription === req.body.subscription) {
    return res.status(400).json({
      status: "succes",
      code: 400,
      message: `your subscription is already equal to - '${req.body.subscription}'`,
    });
  }

  return res.json({
    status: "succes",
    code: 200,
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      subscription: user.subscription,
    },
  });
};

module.exports = updateSubscription;
