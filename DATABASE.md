# Beauty & Dental Directory - DATABASE SCHEMA (SQL)
**Source of Truth for Supabase/PostgreSQL**

---

## 1. EXTENSIONS & TYPES
```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types
CREATE TYPE user_role AS ENUM ('Admin', 'Business');
CREATE TYPE business_category AS ENUM ('Spa', 'Dental', 'Clinic');
CREATE TYPE page_status AS ENUM ('Draft', 'Published');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled');
```

## 2. TABLES STRUCTURE

### accounts
Lưu trữ thông tin tài khoản và gói thành viên.
- `id`: UUID (Primary Key, refs auth.users)
- `email`: TEXT
- `role`: user_role
- `subscription_plan`: TEXT (Trial, Basic, Pro)
- `expiry_date`: TIMESTAMP (Mặc định +30 ngày)

### business_profiles
Thông tin chi tiết của doanh nghiệp.
- `id`: UUID (Primary Key)
- `account_id`: UUID (FK to accounts)
- `business_name`: TEXT
- `slug`: TEXT (Unique, SEO)
- `category`: business_category
- `location_city`: TEXT
- `location_district`: TEXT
- `zalo_phone`: TEXT
- `hotline`: TEXT
- `logo_url`: TEXT
- `is_verified`: BOOLEAN

### landing_pages
Cấu hình trang đích của doanh nghiệp.
- `id`: UUID
- `business_id`: UUID (FK to business_profiles)
- `template_id`: TEXT
- `status`: page_status
- `content_json`: JSONB (Lưu nội dung Visual Editor)

### bookings
Dữ liệu đặt lịch từ khách hàng.
- `id`: UUID
- `business_id`: UUID (FK)
- `customer_name`: TEXT
- `customer_phone`: TEXT
- `service_requested`: TEXT
- `status`: booking_status

---
## 3. VIEWS
- `active_landing_pages`: View chính để fetch dữ liệu ra trang chủ, tự động lọc theo ngày hết hạn (expiry_date).
