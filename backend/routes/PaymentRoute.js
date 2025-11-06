const { createCheckoutSession, confirmPayment, getPaymentHistory } = require("../controllers/PaymentController");
const verifyToken = require("../middlewares/VerifyToken");

const router=require("express").Router();

router.post('/create-checkout-session',verifyToken,createCheckoutSession)
router.post('/confirm-payment',verifyToken,confirmPayment)
router.get('/payment-history',verifyToken,getPaymentHistory)

module.exports=router