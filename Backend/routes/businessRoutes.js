const express = require("express");

const {
    getMyBusiness,
    saveMyBusiness
} = require("../controllers/businessController");

const protect =
    require("../middleware/authMiddleware");

const router = express.Router();


/*
  Get logged-in user's business
*/

router.get(
    "/me",
    protect,
    getMyBusiness
);


/*
  Create / update logged-in user's business
*/

router.put(
    "/me",
    protect,
    saveMyBusiness
);


module.exports = router;