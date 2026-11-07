# Đặc tả UI/UX Trung thu

## 1. Bố cục

Ưu tiên toàn cảnh, điều khiển gọn không che đôi nhân vật hay lồng đèn chính. Hình ảnh theo [storyboard](scene-design.md), hành vi theo [luồng trải nghiệm](user-flows.md).

| Trạng thái | Nội dung và điều khiển |
| --- | --- |
| Tải | Trạng thái tải thật; thử lại khi lỗi |
| Cảnh 1 | Sông, hai bờ phố cổ, đôi nhân vật trên cầu; “Thả lồng đèn” |
| Đang thả/chuyển cảnh | Ưu tiên hoạt cảnh, chưa nhận thêm lượt bắt đầu hoặc chọn đèn |
| Cảnh 2 | Bầu trời nhiều đèn, hướng dẫn chọn đèn, “Xem lại” |
| Lời chúc | Hộp thoại “Lời chúc đêm trăng”, một lời chúc, “Đóng” |

## 2. Hình ảnh và responsive

- Giữ phong cảnh đêm và ánh đèn ấm xuyên suốt; không đổi thành ban ngày theo theme hệ thống.
- Desktop ưu tiên chiều rộng đọc rõ sông và hai bờ. Mobile chỉnh góc camera để vẫn nhận ra hai bờ, cây cầu và đôi nhân vật.
- Đèn tương tác nằm ở vùng dễ chọn. Đèn quá xa chỉ trang trí.
- Hộp thoại có nền đủ tương phản, chữ xuống dòng dễ đọc. Chừa safe area, không che nút điều khiển.
- Kiểm tra chiều rộng 320, 390, 768, 1440 CSS px, xoay ngang và zoom 200%.

## 3. Tương tác và truy cập

- Vùng nhấn tối thiểu 44 × 44 CSS px. Hover/focus gợi sáng nhẹ; mobile không phụ thuộc hover.
- Nếu dùng canvas/WebGL, cung cấp nút DOM tương đương, có tên như “Mở lời chúc từ lồng đèn 1” và hỗ trợ Enter/Space.
- Giữ thứ tự focus ổn định; đèn đang focus giữ khả dụng đến khi focus chuyển đi. Không đưa mọi đèn trang trí vào vòng Tab.
- Hộp thoại giữ focus, Escape/“Đóng” trả focus về đèn đã chọn hoặc điều khiển khả dụng tiếp theo. Trình đọc màn hình đọc lời chúc mới một lần.
- Tôn trọng giảm chuyển động, tránh nhấp nháy. Lời chúc không tự đóng theo bộ đếm.

## 4. Nội dung giao diện

“Thả lồng đèn” · “Chạm vào một chiếc lồng đèn để nhận lời chúc” · “Lời chúc đêm trăng” · “Đóng” · “Xem lại” · “Đang tải khung cảnh…” · “Chưa thể tải lời chúc” · “Thử lại”.
