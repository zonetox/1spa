# TỪ ĐIỂN DỮ LIỆU HỆ THỐNG 1SPA (DATABASE DICTIONARY)

Tài liệu này là **Nguồn Chân Lý Duy Nhất** về cấu trúc dữ liệu. AI và Lập trình viên phải tuân thủ 100%.

## 1. Các bảng vận hành (Relational Tables)
Các bảng này dùng để Admin quản trị và hệ thống chạy logic:

| Tên bảng | Mục đích | Cột quan trọng |
| :--- | :--- | :--- |
| `profiles` | User Metadata | `id`, `email`, `role` (admin/business), `subscription_status` (trial/active) |
| `business_profiles` | Doanh nghiệp | `id`, `account_id`, `business_name`, `slug`, `category` |
| `landing_pages` | Nội dung Page | `id`, `business_id`, `template_id`, `content_json` (DỮ LIỆU CHÍNH) |
| `bookings` | Lịch hẹn | `business_id`, `customer_info` (JSON), `status` |
| `subscriptions` | Thanh toán | `business_id`, `package_id`, `status`, `expiry_date` |

## 2. Quy chuẩn JSON (JSONB Content Standards)
Dữ liệu nội dung của Landing Page phải nằm trong `landing_pages.content_json`. 
**CẤM TỰ SÁNG TẠO TÊN TRƯỜNG.** Sử dụng đúng danh sách sau:

### Section: Dịch vụ (Services)
- Tên trường: `services_menu`
- Cấu trúc: `Array<{ service_name, description, price, image_url }>`

### Section: Chuyên gia (Experts)
- Tên trường: `experts_list`
- Cấu trúc: `Array<{ name, role, bio, image_url }>`

### Section: Đánh giá (Reviews)
- Tên trường: `testimonials`
- Cấu trúc: `Array<{ customer_name, comment, rating, avatar_url }>`

### Section: Hình ảnh (Gallery)
- Tên trường: `gallery_images`
- Cấu trúc: `Array<{ url, caption }>`

## 3. Quy tắc đặt tên (Naming Rules)
1. **Lowercase Only**: Tất cả Role (`admin`, `business`) và Status (`active`, `trial`) phải viết THƯỜNG.
2. **Snake Case**: Tên cột và trường JSON dùng `snake_case` (ví dụ: `business_name`, không dùng `businessName`).
3. **No Plurals for Tables**: Tên bảng dùng số nhiều (ví dụ: `profiles`, `bookings`), trừ bảng metadata.

---
*Mọi hành vi tự ý đổi tên bảng/cột trong code mà không cập nhật Dictionary này sẽ bị coi là lỗi nghiêm trọng.*
