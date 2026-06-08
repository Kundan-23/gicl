const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/referralController');
const { protect } = require('../middlewares/auth');

// Public route — validate referral code during registration
router.post('/validate-code', ctrl.validateCode);

// Protected routes
router.use(protect);
router.get('/stats',            ctrl.getStats);
router.get('/cashouts',         ctrl.getCashouts);
router.post('/cashout',         ctrl.requestCashout);

module.exports = router;
