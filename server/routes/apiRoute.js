const express = require('express');
const apiCtrl = require('../controller/apiCtrl.js');
const userCtrl = require('../controller/userCtrl.js');
const router = express.Router();

router.post("/login", userCtrl.login);
router.get("/user/:id", userCtrl.user);
router.post("/user/update", userCtrl.update);

router.post("/save_item", apiCtrl.saveItem);
router.post("/update_item", apiCtrl.updateItem);
router.get("/item", apiCtrl.items);
router.get("/view_item", apiCtrl.viewItem);
router.get("/getTotalCount", apiCtrl.getTotalCount);

router.get("/getFileBuffer", apiCtrl.getFileBuffer);


module.exports = router;