const { Contact } = require("../../models");

const getAll = async (req, res) => {
  const { _id } = req.user;
  const { favorite } = req.query;

  if (favorite) {
    const favoriteData = await Contact.find({ owner: _id, favorite: true });

    res.json({
      favoriteData,
    });
  }

  const data = await Contact.find({ owner: _id }).populate(
    "owner",
    "_id email subscription"
  );

  res.json({
    status: "success",
    code: 200,
    data: {
      contacts: data,
    },
  });
};

module.exports = getAll;
