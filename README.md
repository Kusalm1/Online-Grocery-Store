# Online Grocery Store

A web-based grocery store application built with AngularJS and Firebase Realtime Database. Supports two user roles — customers and store owners — with product browsing, cart management, order tracking, and a customer–store communication system.

## Features

- User registration and login
- Browse and search products across stores
- Add items to cart and place orders with delivery location
- Order history and payment status tracking
- Store owner dashboard to add and edit products
- Customer–store messaging and Q&A
- Feedback system for customers to rate stores

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | AngularJS 1.6.9 |
| UI | Bootstrap 4.5.2 |
| JavaScript Library | jQuery 3.5.1 |
| Backend / Database | Firebase Realtime Database |
| Icons | Font Awesome 4.7.0 |

## Project Structure

```
Online-Grocery-Store/
├── src/
│   ├── groceryStoreLogReg.html   # Login & registration page
│   ├── groceryStoreLogReg.js     # Authentication logic
│   ├── groceryStore.html         # Main application UI
│   ├── groceryStore.js           # Core application logic
│   ├── logo.jpg                  # Store logo
│   └── bgWall.jpeg               # Background image
└── bin/                          # Compiled output (mirrors src)
```

## Getting Started

No build process is required. The app runs directly in the browser.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Online-Grocery-Store.git
   ```
2. Open `src/groceryStoreLogReg.html` in a web browser
3. Register an account as either a **Customer** or **Store Owner**
4. Log in to access the application

> **Note:** Requires an active internet connection to load CDN dependencies and connect to Firebase.

## Usage

### As a Customer
- Browse all available products or filter by store
- Search for products using the search bar
- Add items to your cart and place an order with a delivery address
- View order history and pay for pending orders
- Send queries to store owners via the Communication tab
- Leave feedback for stores

### As a Store Owner
- Add new products and edit existing ones
- View all orders placed at your store
- Respond to customer queries in the Communication tab

## Firebase Configuration

The app connects to a Firebase Realtime Database. The database URL is set in both JS files:

```javascript
var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/groceryStory";
```

To use your own Firebase project, replace this URL with your own Realtime Database URL in both `groceryStore.js` and `groceryStoreLogReg.js`.
