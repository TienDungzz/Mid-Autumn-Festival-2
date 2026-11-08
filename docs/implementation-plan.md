# Trạng thái triển khai và việc còn lại

Cập nhật 09/11/2026. Phân biệt tính năng đã có với nghiệm thu phát hành; build/test qua không chứng minh đã đạt hiệu năng hoặc QA mọi thiết bị.

## Đã triển khai

| Phần       | Trạng thái code                                                                               |
| ---------- | --------------------------------------------------------------------------------------------- |
| Nền tảng   | TypeScript strict, Vite, Three.js, UI DOM/CSS                                                 |
| Home       | Hai cánh mở, tải cảnh, thử lại, CTA, focus/inert                                              |
| Cảnh 1     | Phố cổ hai bờ, sông, cầu, đôi nhân vật đối mặt, thuyền, đám đông, đèn trang trí               |
| Hoạt cảnh  | Cùng nâng/thả đèn, IK sau mixer, camera lùi và hướng lên                                      |
| Cảnh 2     | Đèn lớn bay, chọn lời chúc random, hộp thoại, tiếp tục bay khi đóng                           |
| Trang trí  | Trăng có mảng tối, sao nền, logo thỏ/trăng, đèn ông sao; đã bỏ hình sao nhân vật              |
| Điều khiển | Custom VI/EN dropdown, âm thanh tổng hợp mặc định tắt, quay lại, reduced motion theo thiết bị |
| Công cụ    | ESLint, Stylelint, Prettier, EditorConfig, typecheck, 10 unit test và build                   |
| Nguồn 3D   | Hai master đã đổi tên; script xuất GLB runtime và Blender trung gian vào .qa                  |

## Ưu tiên tiếp theo

1. Sửa và kiểm chứng camera khi resize/xoay màn hình trong sky/transition; xử lý pagehide/pageshow với bfcache.
2. Làm rõ vòng đời cache glow texture, kiểm retry/reset/cleanup bằng integration test.
3. Đo tải, frame time, draw calls và bộ nhớ trên mobile/desktop tham chiếu; tối ưu GLB và bundle theo kết quả đo.
4. QA bàn phím, screen reader, zoom 200%, Safari/iOS, Android, tab ẩn, tải lỗi/retry và rig cận cảnh.
5. Tách UI feature, tập trung config/nhãn, giảm selector ID; bổ sung manifest/license asset và CI.
6. Xử lý cảnh báo dependency, chọn hosting rồi kiểm artifact và toàn hành trình sau deploy.

## Quy trình Blender

Script hiện tại đọc art/characters/mid-autumn-male-source.blend và mid-autumn-female-source.blend. GLB xuất trực tiếp vào public/models/characters; Blender trung gian vào .qa/characters. Chưa chạy lại script sau khi đổi tên/đổi thư mục output. Quy trình mục tiêu là kiểm staging trước khi thay runtime; cần sửa script nếu muốn bắt buộc cổng này tự động. Không mặc định coi source hoặc animation đạt QA chỉ vì export thành công.

Kết quả thực chạy tại verification-report.md; tiêu chí nghiệm thu tại testing-strategy.md và quality-checks.md.
