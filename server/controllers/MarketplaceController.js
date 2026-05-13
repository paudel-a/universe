const Marketplace = require("../models/MarketplaceItem");

// CREATE ITEM

exports.createItem = async (req, res) => {
  try {
    const { title, description, price, condition } = req.body;

    const item = await Marketplace.create({
      title,
      description,
      price,
      condition,
      image: req.file ? req.file.path : null,
      user: req.user,
    });

    const populated = await item.populate("user", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
// GET ITEMS
exports.getItems = async (req, res) => {
  try {
    const items = await Marketplace.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
