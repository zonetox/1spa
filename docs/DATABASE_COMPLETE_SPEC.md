# SỔ CÁI KỸ THUẬT DỮ LIỆU 1SPA (DATABASE COMPLETE SPEC)

Trạng thái: **SẠCH 100% (Phê duyệt bởi CTO V8)**

## 1. Danh sách các bảng (Table Registry)

### [A] Tài khoản & Phân quyền
- **profiles**: Thông tin người dùng đồng bộ từ Auth.
  - `id` (UUID): Primary Key (Auth UID).
  - `email` (TEXT): Email liên hệ.
  - `role` (TEXT): `admin`, `business`, `user`.
  - `subscription_status` (TEXT): `trial`, `active`, `blocked`.
  - `expiry_date` (TIMESTAMP): Ngày hết hạn gói.

### [B] Doanh nghiệp & Nội dung
- **business_profiles**: Hồ sơ doanh nghiệp đối tác.
  - `account_id` (UUID): FK -> profiles.id.
  - `business_name`, `slug`, `category`, `zalo_phone`, `hotline`, `logo_url`.
- **landing_pages**: Nội dung trang đích.
  - `business_id` (UUID): FK -> business_profiles.id.
  - `template_id` (TEXT): ID của Template React.
  - `content_json` (JSONB): Chứa toàn bộ nội dung động.

### [C] Vận hành & Giao dịch
- **bookings**: Lịch hẹn từ khách hàng.
  - `business_id` (UUID): FK.
  - `customer_info` (JSONB): {name, phone, email}.
  - `status` (TEXT): `new`, `contacted`, `completed`.
- **subscriptions**: Giao dịch nâng cấp gói.
  - `business_id` (UUID): FK.
  - `status` (TEXT): `pending`, `active`.
  - `verified` (BOOLEAN): Admin đã đối soát hay chưa.

### [D] Tracking & Thông báo
- **analytics_events**: Theo dõi lượt xem/click.
  - `business_id` (UUID): FK.
  - `event_type` (TEXT): `view`, `click`.
- **notifications**: Thông báo hệ thống.
  - `recipient_id` (UUID): FK -> profiles.id.

### [E] Blog & Kiến thức
- **blog_categories**: Phân loại bài viết.
  - `id`, `name`, `slug`, `description`.
- **blogs**: Bài viết chuyên sâu.
  - `id`, `business_id` (FK), `title`, `slug`, `content`, `excerpt`, `image_url`, `category_id` (FK), `status`, `read_time`.

---

## 2. Quy chuẩn thiết kế (Design Standards)
1. **Liên kết**: Luôn sử dụng UUID và Foreign Key có `ON DELETE CASCADE`.
2. **Thời gian**: Mọi bảng phải có `created_at` (default now()).
3. **Mở rộng**: Sử dụng JSONB cho các dữ liệu biến thiên cao để tránh đổi Schema liên tục.
