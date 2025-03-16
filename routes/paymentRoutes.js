const express = require("express");
const router = express.Router();

const { createCheckout, webhook } = require("../controllers/paymentController");


router.post("/create-checkout", createCheckout);

router.get('/success' , (req,res)=>{
    res.send('<h1>You were successful in paying</h1>')
})
router.get('/cancel' , (req,res)=>{
    res.send('<h1>You were not successful in paying</h1>')
})

module.exports = router;
