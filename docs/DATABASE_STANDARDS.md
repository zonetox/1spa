# QUY CHUẨN ĐỒNG NHẤT DỮ LIỆU (DATABASE STANDARDS) - 1SPA

Để tránh việc đặt tên bảng/cột lung tung và đảm bảo hệ thống vận hành ổn định, mọi thay đổi về sau PHẢI tuân thủ các quy tắc vàng này:

## 1. Nguồn chân lý cho User (User Metadata)
- **Bảng duy nhất**: Luôn luôn là `profiles`. 
- **CẤM SỬ DỤNG**: Tuyệt đối không dùng bảng `accounts`.
- **Cột trạng thái VIP**: Phải là `subscription_status` (Các giá trị: 'trial', 'active', 'blocked').
- **Cột hết hạn**: Phải là `expiry_date`.

## 2. Quy tắc liên kết (Relationships)
- **Doanh nghiệp**: Bảng `business_profiles` phải có cột `account_id` trỏ trực tiếp về `profiles.id`.
- **Landing Page**: Luôn tham chiếu qua `business_id` trỏ về `business_profiles.id`.

## 3. Danh sách bảng chuẩn (Core Tables)
Mọi chức năng mới phải sử dụng đúng tên bảng đã được Audit:
- `profiles`: Thông tin tài khoản & gói cước.
- `business_profiles`: Thông tin doanh nghiệp/cơ sở.
- `landing_pages`: Nội dung trang đích (JSON).
- `bookings`: Lịch hẹn từ khách hàng.
- `subscriptions`: Lịch sử giao dịch thanh toán.
- `packages`: Danh sách gói dịch vụ.
- `blogs`: Bài viết tin tức.
- `experts`: Danh sách chuyên gia/nhân viên.
- `services`: Danh sách dịch vụ/sản phẩm.

## 4. Quy trình thay đổi (Change Workflow)
1. **Kiểm tra Audit**: Trước khi thêm code mới, chạy script `node scratch/full_db_dump.js` để xem cấu trúc DB thực tế.
2. **Migration First**: Mọi thay đổi cấu trúc DB phải được viết vào file `.sql` trong thư mục `supabase/migrations/` trước khi viết code.
3. **Refactor Code**: Nếu đổi tên bảng trong DB, phải dùng script quét toàn bộ `src/` để cập nhật đồng loạt.

---
*Tài liệu này là "Chân lý duy nhất" của dự án 1SPA.*
