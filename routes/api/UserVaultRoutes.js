const router = require('express').Router();
const privateRoute = require('../../middleware/ValidateToken');
const UserVaultController = require('../../controllers/UserVaultController');

//  @Route      api/vault/:id
router.route("/:id")
    // @desc-POST       add new item in the vault
    .post(privateRoute, UserVaultController.addItem)
    // @desc-PUT        update item from the vault
    .put(privateRoute, UserVaultController.updateItem)
    // @desc-DELETE     delete item from the vault
    .delete(privateRoute, UserVaultController.deleteItem);

module.exports = router;