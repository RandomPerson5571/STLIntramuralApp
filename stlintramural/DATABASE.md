## 2. Table Specifications

### `users`
Represents all system actors (Students, Teachers, Admins). It stores authentication mappings, cached points, and QR tokens.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `gen_random_uuid()` | Unique internal identifier. |
| `auth_id` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | External auth provider ID (e.g., Supabase Auth, Firebase). |
| `first_name` | `VARCHAR(100)` | `NOT NULL` | User's given name. |
| `last_name` | `VARCHAR(100)` | `NOT NULL` | User's family name. |
| `role` | `user_role` (ENUM) | `NOT NULL`, `DEFAULT 'student'` | Access level permissions: `student`, `teacher`, `admin`. |
| `points_balance` | `INT` | `NOT NULL`, `DEFAULT 0` | Cached running balance of total student points. |
| `qr_code_token` | `UUID` | `UNIQUE`, `NOT NULL`, `gen_random_uuid()` | Unique string encoded into the student's QR code. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Record creation timestamp with timezone. |

### `events`
Stores information about activities organized by teachers or admins.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `gen_random_uuid()` | Unique event identifier. |
| `host_id` | `UUID` | `NOT NULL`, `REFERENCES users(id) ON DELETE RESTRICT` | The teacher or admin managing the event. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Name of the event. |
| `description` | `TEXT` | None | Detailed information about the event. |
| `start_date` | `TIMESTAMPTZ` | `NOT NULL` | Event start time. |
| `end_date` | `TIMESTAMPTZ` | `NOT NULL` | Event end time. Must be $\ge$ `start_date`. |
| `points_awarded` | `INT` | `NOT NULL`, `DEFAULT 0`, `CHECK (>= 0)` | Number of points granted upon scanning. |
| `max_attendees` | `INT` | `CHECK (> 0)` | Optional cap on maximum registrations. |
| `external_links` | `TEXT[]` | None | Array of URLs for external materials or flyers. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Record creation timestamp. |

### `event_attendances`
A many-to-many bridge table connecting `users` (students) to `events`. It manages registration and acts as the point-of-scan recorder.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `gen_random_uuid()` | Unique attendance record identifier. |
| `user_id` | `UUID` | `NOT NULL`, `REFERENCES users(id) ON DELETE CASCADE` | The participating student. |
| `event_id` | `UUID` | `NOT NULL`, `REFERENCES events(id) ON DELETE CASCADE` | The event being attended. |
| `scanned_by` | `UUID` | `REFERENCES users(id) ON DELETE SET NULL` | The teacher who scanned the student's QR code. |
| `attended_at` | `TIMESTAMPTZ` | `NULL` | Timestamp when checked-in. Left `NULL` during pre-registration. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Registration timestamp. |

* **Composite Constraint:** `UNIQUE (user_id, event_id)` ensures a student cannot register for the same event multiple times.

### `point_transactions`
The general ledger/audit trail tracking all modifications to user point totals. This handles event reward calculations and general balance tracking.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `gen_random_uuid()` | Unique transaction line-item ID. |
| `user_id` | `UUID` | `NOT NULL`, `REFERENCES users(id) ON DELETE CASCADE` | Student gaining/losing points. |
| `event_id` | `UUID` | `REFERENCES events(id) ON DELETE SET NULL` | Linked event context (nullable for manual/shop adjustments). |
| `attendance_id` | `UUID` | `REFERENCES event_attendances(id) ON DELETE SET NULL` | Specific attendance instance identifier. |
| `points` | `INT` | `NOT NULL` | Value delta. Positive for rewards, negative for deductions. |
| `description` | `VARCHAR(255)` | `NOT NULL` | Contextual string (e.g., "Attended Robotics Club Kickoff"). |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp of the change. |

### `shop_items`
Stores reward items available for purchase by students using accumulated points.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `gen_random_uuid()` | Unique inventory item identifier. |
| `seller_id` | `UUID` | `NOT NULL`, `REFERENCES users(id) ON DELETE RESTRICT` | The teacher or admin who listed the item. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Name of the reward item. |
| `description` | `TEXT` | None | Description of the item. |
| `stock` | `INT` | `NOT NULL`, `DEFAULT 0`, `CHECK (>= 0)` | Available inventory. Cannot drop below zero. |
| `cost` | `INT` | `NOT NULL`, `CHECK (> 0)` | Point cost per item unit. Must be greater than zero. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp when the item was listed. |

### `shop_transactions`
The dedicated ledger recording all reward item purchases made by students.

| Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `gen_random_uuid()` | Unique shop transaction ID. |
| `shop_item_id` | `UUID` | `REFERENCES shop_items(id) ON DELETE SET NULL` | Linked reward item. Retains invoice if item is deleted. |
| `user_id` | `UUID` | `NOT NULL`, `REFERENCES users(id) ON DELETE CASCADE` | The purchasing student. |
| `quantity` | `INT` | `NOT NULL`, `DEFAULT 1`, `CHECK (> 0)` | Number of units purchased. Must be positive. |
| `points_spent` | `INT` | `NOT NULL` | Total cost snapshot at time of purchase (`cost` $\times$ `quantity`). |
| `purchased_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Purchase completion timestamp. |

---

## 3. Data Integrity & Constraints

1. **Date Validation:** `events.end_date` must be chronologically equal to or after `events.start_date`.
2. **Strict Value Bounds:** * `events.points_awarded` accepts values $\ge 0$.
   * `events.max_attendees` accepts values $> 0$.
   * `shop_items.stock` prevents negative inventory values through an explicit `CHECK (stock >= 0)`.
   * `shop_items.cost` and `shop_transactions.quantity` are enforced to be strictly greater than zero.
3. **Cascading Strategies:**
   * `ON DELETE CASCADE` removes dependent attendance records, point histories, and shop transactions if a student profile is deleted.
   * `ON DELETE RESTRICT` blocks deletion of a user if they are the designated organizer for active events or active shop items.
   * `ON DELETE SET NULL` preserves transaction audits and item sales history even if associated events, shop items, or verifying teachers are removed from active lookups.

---

## 4. Query Performance Optimization

The schema sets performance-critical indexes on foreign keys and heavy lookup parameters:

* `idx_users_auth_id`: Speeds up authentication mapping checks during sign-in.
* `idx_users_qr_code`: Optimizes the quick lookups required when a teacher scans a student's QR code.
* `idx_attendance_user_event`: Composite index optimizing lookup validation on registration views.
* `idx_transactions_user_id`: Optimizes ledger calculation queries for rendering user profile histories.
* `idx_shop_items_seller`: Accelerates teacher dashboard queries filtering items by vendor.
* `idx_shop_transactions_user`: Optimizes transaction history loading screens on student applications.
* `idx_shop_transactions_item`: Speeds up item-specific analytics dashboards for admins.