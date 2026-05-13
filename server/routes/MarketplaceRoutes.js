const router = require("express").Router();
const {
  createItem,
  getItems,
} = require("../controllers/marketplaceController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), createItem);

router.post("/", auth, createItem);
router.get("/", getItems);

module.exports = router;
