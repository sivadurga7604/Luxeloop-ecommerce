# Technical Project Guide: Luxeloop E-Commerce

Feed this guide into ChatGPT to study the codebase architecture, data flow, APIs, database models, and technical highlights of **Luxeloop** for interviews or presentations.

---

## 1. Project Overview
**Luxeloop** is a full-stack, boutique e-commerce web application featuring a premium, luxury-themed design system. It allows customers to browse, search, filter, wishlist, add to cart, and checkout products. It also provides admins with real-time business analytics and catalog inventory control.

---

## 2. Technical Stack
- **Frontend:** React.js (Single Page Application), HTML5, Vanilla CSS (custom variables, glassmorphism, keyframe animations, Google Fonts: *Playfair Display* & *Plus Jakarta Sans*).
- **Backend:** Java 21, Spring Boot 3.2.x following a REST API architecture.
- **Database:** PostgreSQL (Production on Render), MySQL (Local development).
- **ORM:** Spring Data JPA / Hibernate.
- **Third-Party Integrations:** Cloudinary API (multipart uploads for product images).

---

## 3. System Architecture & Directory Structure
The backend follows a standard **layered architecture**:
1. **Controllers (`com.ecommerce.controller`):** Expose REST API endpoints, handle HTTP requests, and format JSON responses.
2. **Services (`com.ecommerce.service`):** Define business logic. Divided into interfaces and implementations (`impl/`) for separation of concerns.
3. **Repositories (`com.ecommerce.repository`):** Extend `JpaRepository` to perform CRUD operations on the database.
4. **Entities (`com.ecommerce.entity`):** Map Java classes to database tables using Jakarta Persistence (`@Entity`, `@Table`, `@Id`, etc.).

---

## 4. Database Schema & Relationships

### Entities
- **User (`users`):** `id` (PK), `name`, `email`, `password`.
- **Product (`products`):** `id` (PK), `name`, `price`, `imageUrl`.
- **Category (`categories`):** `id` (PK), `name`, `description`.
- **CartItem (`cart_items`):** `id` (PK), `userId`, `productId`, `productName`, `price`, `imageUrl`, `quantity`.
- **Wishlist (`wishlist`):** `id` (PK), `userId`, `productId`, `productName`, `price`, `imageUrl`.
- **Order (`orders`):** `id` (PK), `userId`, `totalAmount`, `paymentId`, `status`, `orderDate`.

### Relationship Highlight: Product ↔ Category (Many-to-Many)
- A product can belong to multiple categories (e.g., "Men" and "Accessories").
- Managed via a join table `product_categories` containing `product_id` and `category_id` columns.
- **Entity mapping in `Product.java`:**
  ```java
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "product_categories",
      joinColumns = @JoinColumn(name = "product_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id")
  )
  @JsonIgnoreProperties("products")
  private List<Category> categories;
  ```

---

## 5. REST API Endpoints & Workflows

### Authentication Flow (`/auth`)
- `POST /auth/register`: Saves a new user record.
- `POST /auth/login`: Validates credentials. If the email is `sivadurgas7604@gmail.com`, it assigns the `ADMIN` role; otherwise, `CUSTOMER`. Returns user ID, name, token, and role.

### Product Catalog (`/products` & `/categories`)
- `GET /products`: Fetches all products.
- `GET /products/search?name={name}`: Queries products by matching names (case-insensitive).
- `GET /products/category/{categoryId}`: Returns products under a specific category using a join query.
- `GET /categories`: Lists all available categories.
- `GET /categories/seed`: Populates default categories (Men, Women, Accessories, Electronics) if the database is empty.

### Wishlist Flow (`/wishlist`)
- `POST /wishlist/add`: Adds a product to the user's wishlist.
- `GET /wishlist/{userId}`: Lists wishlist items for a specific user.
- `DELETE /wishlist/{userId}/{productId}`: Removes an item from the wishlist.

### Cart Flow (`/cart`)
- `POST /cart/add`: Saves or updates an item in the cart.
- `GET /cart/{userId}`: Retrieves the user's cart.
- `PUT /cart/{id}?quantity={quantity}`: Updates the quantity of a cart item.
- `DELETE /cart/{id}`: Deletes a specific cart item.
- `DELETE /cart/clear/{userId}`: Empties the user's cart.

### Checkout & Order Placement (`/order` & `/checkout`)
- `POST /order`: Places an order with total amount, order date, and payment status.
- `GET /order/{userId}`: Retrieves purchase history for a user.
- `@Transactional` ensures atomic checkout: saving the order record and clearing the user's cart are treated as a single, rollback-safe transaction.

### Admin Operations (`/admin` & `/upload`)
- `GET /admin/analytics`: Retrieves summary statistics (Total Orders, Total Revenue).
- `POST /upload`: Custom multipart handler that forwards uploaded files to **Cloudinary** using raw HttpURLConnection, extracts the secure URL, and returns it.

---

## 6. Key Technical Challenges Solved

### A. CORS Wildcard & Credentials Conflict
- **Symptom:** Live site threw `TypeError: Failed to fetch` on page load.
- **Cause:** `WebConfig.java` had credentials enabled (`allowCredentials(true)`), but controllers had `@CrossOrigin(origins = "*")`. The browser blocks requests when a wildcard `*` is merged with credentialed requests.
- **Fix:** Removed all controller-level `@CrossOrigin` annotations and created an explicit allowed origin whitelist in `WebConfig.java` matching local and live URLs.

### B. Production `LazyInitializationException`
- **Symptom:** `/products` worked locally but crashed with a `500 Internal Server Error` on Render.
- **Cause:** Render has `spring.jpa.open-in-view=false` (OSIV disabled). Jackson accessed the lazy-loaded categories list during serialization after the database transaction closed.
- **Fix:** Configured the category association in `Product.java` to fetch eagerly: `fetch = FetchType.EAGER`.

### C. Hardcoded Endpoints & Environment Auto-Detection
- **Symptom:** Changing API endpoints between local dev and live server required manual code changes.
- **Fix:** Built `config.js` to automatically inspect `window.location.hostname`. It switches the base URL to `http://localhost:8084` for localhost and `https://luxeloop-backend.onrender.com` for production.

### D. Single Page Application (SPA) Performance
- **Symptom:** UI refreshed the entire browser window (`window.location.reload()`) upon cart adjustments or wishlist removal.
- **Fix:** Redesigned React hooks to update UI states optimistically in-memory, improving speed and removing page-flickers.
