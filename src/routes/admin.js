
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/AdminController');

router.get('/create', adminController.create);
router.get('/usermanagement', adminController.manageUser);
router.post('/store', adminController.store);
router.get('/manage', adminController.manage);
router.get('/update/:id', adminController.update);
router.put('/:id', adminController.save);
router.delete('/:id', adminController.delete);
router.put('/updateStatus/reject/:id', adminController.rejectOrder);
router.put('/updateStatus/:id', adminController.confirmOrder);



module.exports = router;