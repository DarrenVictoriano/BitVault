const router = require('express').Router();
const UserRouter = require('./UserRoutes');
// const UserVaultRouter = require('./UserVaultRoutes');

router.use("/user", UserRouter);
// router.use("/vault", UserVaultRouter);

module.exports = router;