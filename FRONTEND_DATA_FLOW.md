# Frontend Data Flow & Component Architecture

## 📊 Component Hierarchy

```
main.jsx (Entry Point)
    └── App.jsx
        └── CartProvider (Context Provider)
            └── Home.jsx (Main Container)
                ├── Navbar.jsx
                │   └── CartModal.jsx
                ├── AddProductModal.jsx
                └── Card.jsx (rendered multiple times)
```

---

## 🔄 Data Flow Overview

### **1. Application Entry Point**

**`main.jsx`**
- **Purpose**: Renders the React app into the DOM
- **What it does**: 
  - Imports `App` component
  - Renders it inside `<div id="root">` in `index.html`
- **Data flow**: No data, just initialization

---

### **2. Root Component**

**`App.jsx`**
- **Purpose**: Wraps the entire app with Cart Context
- **What it renders**: 
  - `CartProvider` (provides cart state globally)
  - `Home` component (main page)
- **Data flow**: 
  - No props passed
  - Provides Cart Context to all children

---

### **3. Global State Management**

**`CartContext.jsx`** (Context Provider)
- **Purpose**: Manages cart state globally (React Context API)
- **State it holds**:
  ```javascript
  cart = [
    { _id, name, price, image, quantity },
    ...
  ]
  ```
- **Functions it provides**:
  - `addToCart(product)` - Adds product to cart or increments quantity
  - `removeFromCart(productId)` - Removes product from cart
  - `getCartCount()` - Returns total number of items
  - `getCartTotal()` - Returns total price
- **Who uses it**: 
  - `Navbar` (reads cart count)
  - `Card` (adds to cart)
  - `CartModal` (reads cart, removes items, calculates total)

---

### **4. Main Container Component**

**`Home.jsx`** (Main Page Component)
- **Purpose**: Main container that manages products and modals
- **Local State**:
  ```javascript
  products = []           // Array of products from API
  showAddModal = false   // Controls AddProductModal visibility
  ```
- **What it does**:
  1. **Fetches products** on mount (useEffect)
     - Calls: `GET http://localhost:5000/api/products`
     - Updates: `products` state
  2. **Renders**:
     - `Navbar` (passes `onSellClick` callback)
     - `AddProductModal` (controlled by `showAddModal`)
     - Multiple `Card` components (one per product)
- **Functions**:
  - `fetchProducts()` - Fetches all products from backend
  - `handleAddProduct()` - Refreshes product list after adding
  - `handleDeleteProduct(productId)` - Deletes product via API, then refreshes list
- **Data Flow**:
  ```
  Backend API → fetchProducts() → products state → Card components
  ```

---

### **5. Navigation Bar**

**`Navbar.jsx`**
- **Purpose**: Top navigation bar with Sell button and Cart button
- **Local State**:
  ```javascript
  showCart = false  // Controls CartModal visibility
  ```
- **Props received**:
  - `onSellClick` (function) - Called when "Sell" button clicked
- **Uses Context**:
  - `getCartCount()` - Gets cart item count for display
- **What it renders**:
  - "Sell" button → calls `onSellClick()` (opens AddProductModal)
  - "Cart (X)" button → opens CartModal
  - `CartModal` component
- **Data Flow**:
  ```
  Cart Context → getCartCount() → displays count
  User clicks "Sell" → calls onSellClick() → Home opens modal
  User clicks "Cart" → setShowCart(true) → CartModal opens
  ```

---

### **6. Product Card**

**`Card.jsx`**
- **Purpose**: Displays a single product with Add to Cart and Delete buttons
- **Props received**:
  ```javascript
  product = {
    _id: "...",
    name: "...",
    price: 99.99,
    image: "url"
  }
  onDelete = (productId) => {}  // Function to delete product
  ```
- **Uses Context**:
  - `addToCart(product)` - Adds product to cart when button clicked
- **What it renders**:
  - Product image
  - Product name
  - Product price
  - "Add to Cart" button → calls `addToCart(product)`
  - "Delete" button → calls `onDelete(product._id)`
- **Data Flow**:
  ```
  Home passes product → Card displays it
  User clicks "Add to Cart" → addToCart() → Cart Context updates
  User clicks "Delete" → onDelete(productId) → Home deletes via API → refreshes list
  ```

---

### **7. Add Product Modal**

**`AddProductModal.jsx`**
- **Purpose**: Modal form to add new products
- **Props received**:
  ```javascript
  isOpen = true/false        // Controls visibility
  onClose = () => {}         // Function to close modal
  onAddProduct = () => {}    // Function called after successful add
  ```
- **Local State**:
  ```javascript
  formData = {
    name: "",
    price: "",
    image: ""
  }
  loading = false
  ```
- **What it does**:
  1. User fills form → updates `formData` state
  2. User submits → `handleSubmit()`:
     - Validates form
     - Calls: `POST http://localhost:5000/api/products`
     - On success: calls `onAddProduct()`, closes modal
     - On error: shows alert
- **Data Flow**:
  ```
  User input → formData state
  Form submit → POST to backend → onAddProduct() → Home refreshes products
  ```

---

### **8. Cart Modal**

**`CartModal.jsx`**
- **Purpose**: Modal window showing cart items and total
- **Props received**:
  ```javascript
  isOpen = true/false    // Controls visibility
  onClose = () => {}     // Function to close modal
  ```
- **Uses Context**:
  - `cart` - Array of cart items
  - `removeFromCart(productId)` - Removes item from cart
  - `getCartTotal()` - Calculates total price
- **What it renders**:
  - List of cart items (name, price, quantity, subtotal)
  - "Remove" button for each item
  - Total price
  - "Proceed to Buy" button (placeholder)
- **Data Flow**:
  ```
  Cart Context → cart array → displays items
  User clicks "Remove" → removeFromCart() → Cart Context updates → re-renders
  ```

---

## 🔀 Complete Data Flow Examples

### **Example 1: Adding Product to Cart**

```
1. User clicks "Add to Cart" on Card
   ↓
2. Card calls: addToCart(product)
   ↓
3. CartContext.addToCart() updates cart state
   ↓
4. CartContext re-renders all components using cart
   ↓
5. Navbar.getCartCount() recalculates → Cart count updates
   ↓
6. CartModal (if open) shows new item
```

### **Example 2: Adding New Product**

```
1. User clicks "Sell" button in Navbar
   ↓
2. Navbar calls: onSellClick()
   ↓
3. Home sets: showAddModal = true
   ↓
4. AddProductModal opens
   ↓
5. User fills form and submits
   ↓
6. AddProductModal calls: POST /api/products
   ↓
7. Backend saves to MongoDB
   ↓
8. AddProductModal calls: onAddProduct()
   ↓
9. Home calls: fetchProducts()
   ↓
10. Home updates products state
    ↓
11. New Card component renders with new product
```

### **Example 3: Deleting Product**

```
1. User clicks "Delete" on Card
   ↓
2. Card calls: onDelete(product._id)
   ↓
3. Home.handleDeleteProduct() confirms, then calls: DELETE /api/products/:id
   ↓
4. Backend deletes from MongoDB
   ↓
5. Home calls: fetchProducts()
   ↓
6. Home updates products state
   ↓
7. Card component removed from DOM
```

### **Example 4: Viewing Cart**

```
1. User clicks "Cart (X)" in Navbar
   ↓
2. Navbar sets: showCart = true
   ↓
3. CartModal renders
   ↓
4. CartModal reads: cart from CartContext
   ↓
5. CartModal displays all items and total
```

---

## 📦 State Management Summary

### **Global State (CartContext)**
- **Location**: `CartContext.jsx`
- **State**: `cart` array
- **Access**: Any component via `useCart()` hook
- **Used by**: Navbar, Card, CartModal

### **Local State (Home)**
- **Location**: `Home.jsx`
- **State**: `products`, `showAddModal`
- **Access**: Only within Home component
- **Used by**: Home renders products, controls modal

### **Local State (Navbar)**
- **Location**: `Navbar.jsx`
- **State**: `showCart`
- **Access**: Only within Navbar
- **Used by**: Controls CartModal visibility

### **Local State (AddProductModal)**
- **Location**: `AddProductModal.jsx`
- **State**: `formData`, `loading`
- **Access**: Only within AddProductModal
- **Used by**: Form inputs and submission

---

## 🎯 Key Concepts

1. **Props Down**: Data flows from parent to child via props
   - Home → Card (product, onDelete)
   - Home → Navbar (onSellClick)
   - Home → AddProductModal (isOpen, onClose, onAddProduct)

2. **Events Up**: Child components call parent functions via props
   - Card → Home (onDelete)
   - Navbar → Home (onSellClick)
   - AddProductModal → Home (onAddProduct)

3. **Context Across**: Cart state shared globally via Context
   - Any component can read/write cart via `useCart()` hook

4. **API Calls**: Only Home and AddProductModal make API calls
   - Home: GET (fetch products), DELETE (delete product)
   - AddProductModal: POST (add product)

---

## 🔍 Component Responsibilities

| Component | Manages | Reads | Writes |
|-----------|---------|-------|--------|
| **App** | CartProvider wrapper | - | - |
| **CartContext** | Cart state | - | cart state |
| **Home** | Products list, modals | API, products state | products state |
| **Navbar** | Cart modal visibility | Cart count | - |
| **Card** | Product display | - | Cart (via context) |
| **AddProductModal** | Form state | - | API (POST) |
| **CartModal** | Cart display | Cart items | Cart (remove items) |
