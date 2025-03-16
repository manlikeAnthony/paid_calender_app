### Paid calender application
### user model
- []Create a User.js file in the models
- []add the following properties name ,password ,email

- **`controllers/paymentController.js`** → Handles payment logic  
- **`routes/paymentRoutes.js`** → Defines payment-related routes  
- **`middlewares/paidAccess.js`** → Middleware to protect paid routes  
- **`utils/stripe.js`** → Stripe configuration  

---

### **1️⃣ Stripe Configuration (`utils/stripe.js`)**
```javascript
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
```

---

### **2️⃣ Payment Controller (`controllers/paymentController.js`)**
```javascript
const stripe = require("../utils/stripe");
const User = require("../models/User");

const createCheckoutSession = async (req, res) => {
  const { userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: req.user.email, // Ensure user is authenticated
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Calendar Access",
              description: "Unlock full calendar features",
            },
            unit_amount: 500 * 100, // $5.00 subscription fee
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userEmail = session.customer_email;

    // Find user and update isPaid to true
    await User.findOneAndUpdate({ email: userEmail }, { isPaid: true });

    console.log(`User ${userEmail} has paid!`);
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };
```

---

### **3️⃣ Payment Routes (`routes/paymentRoutes.js`)**
```javascript
const express = require("express");
const { createCheckoutSession, handleWebhook } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
```

---

### **4️⃣ Paid Access Middleware (`middlewares/paidAccess.js`)**
```javascript
const CustomError = require("../errors");

const paidAccess = (req, res, next) => {
  if (!req.user.isPaid) {
    throw new CustomError.UnauthorizedError("Payment required to access this feature.");
  }
  next();
};

module.exports = paidAccess;
```

---

### **5️⃣ Apply to Your Main Server (`server.js` or `app.js`)**
```javascript
const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(express.json()); // Required for parsing JSON bodies
app.use("/api/payment", paymentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
```

---

## **🔹 Summary**
✔ **Stripe logic** is inside `controllers/paymentController.js`  
✔ **Routes** are in `routes/paymentRoutes.js`  
✔ **Middleware** protects paid features (`middlewares/paidAccess.js`)  
✔ **Stripe instance** is inside `utils/stripe.js`  

Now, everything is **modularized, clean, and scalable!** 🚀 Let me know if you need more refinements.