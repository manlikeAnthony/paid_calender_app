## 📅 Paid Calendar App

A premium calendar application built with **Node.js** that supports **authentication**, **subscription plans**, and integrates **Stripe payments** to unlock premium features.  
Users can register, log in, manage tasks/events, and subscribe to access premium features.

---

## 🚀 Features

- 🔐 **User Authentication (JWT + Refresh Tokens + Cookies)**
- 💳 **Stripe Payment Integration**
- 🗓️ **Task Management System**
- 🏆 **Premium Subscription Handling**
- 📨 **Webhook Listener for Stripe Events**
- 🔄 **Token Refresh System**
- 🛡️ **Middleware for Auth, Subscription Check & Error Handling**

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT, Cookies, Bcrypt
- **Payments:** Stripe API Integration
- **Task Scheduling:** Node Cron (for future subscription handling, optional)
- **Environment Variables:** dotenv

---

## 📁 Folder Structure

```
├── controllers
│   ├── authController.js
│   ├── paymentController.js
│   └── taskController.js
├── middleware
│   ├── authentication.js
│   ├── error-handler.js
│   └── not-found.js
├── models
│   ├── User.js
│   ├── Token.js
│   └── Task.js
├── routes
│   ├── authRoutes.js
│   ├── paymentRoutes.js
│   └── taskRoutes.js
├── utils
│   ├── scheduleTasks.js
│   ├── createTokenUser.js
│   ├── jwt.js
│   └── stripe.js
├── .env
├── .gitignore
├── server.js
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Clone Repository**

```bash
git clone https://github.com/YOUR_USERNAME/paid-calendar-app.git
cd paid-calendar-app
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Variables**

Create a `.env` file and add:

```
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=1d
REFRESH_TOKEN_LIFETIME=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
```

4. **Run Server**

```bash
npm start
```

---

## 🧑‍💻 API Endpoints

### Auth Routes

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/api/v1/auth/register` | Register new user            |
| POST   | `/api/v1/auth/login`    | Login user                   |
| GET    | `/api/v1/auth/logout`   | Logout user (clears cookies) |

---

### Task Routes

| Method | Endpoint                     | Description     |
| ------ | ---------------------------- | --------------- |
| GET    | `/api/v1/task`               | Get all tasks   |
| POST   | `/api/v1/task/schedule-task` | Create new task |
| GET    | `/api/v1/task/:id`           | Get Single Task |
| PATCH  | `/api/v1/task/:id`           | Update task     |
| DELETE | `/api/v1/task/:id`           | Delete task     |

> **Note:** Only accessible by authenticated & subscribed users.

---

### Payment Routes

| Method | Endpoint                          | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| POST   | `/api/v1/payment/create-checkout` | Create Stripe checkout session  |
| POST   | `/api/v1/payment/webhook`         | Stripe webhook for subscription |
| GET    | `/api/v1/payment/success`         | Success page after payment      |
| GET    | `/api/v1/payment/cancel`          | Cancel page if payment fails    |

---

## 🔑 Premium Feature Access Logic

Middleware checks if:

1. User is authenticated.
2. User has an active subscription (`isPaid` flag).

If not, it returns:

```
401 Unauthorized: user must be subscribed to access this feature as it is a premium feature
```

---

## 🌐 Stripe Integration

- Handles one-time or recurring subscriptions.
- Stripe webhook listens to successful payments and updates the user’s subscription status in MongoDB.
- Includes success & cancel pages after checkout.

---

## 🛠️ Future Improvements

- Add **Admin Dashboard** to manage users & subscriptions.
- Integrate **email notifications**.
- Add **free trial** option for users.
- Add **frontend client (React/Next.js)** for better UI/UX.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributions

PRs & Suggestions are welcome!

---
