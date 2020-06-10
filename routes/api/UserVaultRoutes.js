const router = require('express').Router();
const privateRoute = require('../../middleware/ValidateToken');
const UserVaultController = require('../../controllers/UserVaultController');

//  @Route      api/vault/:id
router.route("/:id")
    // @desc-POST       add new item in the vault
    .post(UserVaultController.addItem)
    // @desc-PUT        update item from the vault
    .put(UserVaultController.updateItem);

module.exports = router;