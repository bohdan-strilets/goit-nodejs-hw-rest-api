const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const { sendEmail } = require("../../helpers");
const jwt = require("jsonwebtoken");

const { API_URL, SECRET_KEY } = process.env;

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: `Email '${email}' in use`,
    });
  }

  const verificationToken = v4();
  const avatarURL = gravatar.url(email);
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const result = await User.create({
    name,
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const payload = { id: result._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "3h" });
  await User.findByIdAndUpdate(result._id, { token });

  const mail = {
    to: email,
    subject: "Email confirmation.",
    html: `
      <div>
        <h1>Welcome ${name}</h1>
        <br />
        <p>Thank you for yusing our service.</p>
        <br />
        <a target="_blank" href="${API_URL}/api/user/verify/${verificationToken}">Finish registration</a>
      </div>
    `,
  };

  await sendEmail(mail);

  res.status(201).json({
    status: "succes",
    code: 201,
    data: {
      token,
      user: {
        name: result.name,
        email: result.email,
        subscription: result.subscription,
        avatarURL,
      },
    },
  });
};

module.exports = signup;
