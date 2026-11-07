# Chiến lược kiểm thử Trung thu

Đây là kế hoạch kiểm chứng khi có bản dựng, chưa phải báo cáo test đã chạy.

## 1. Hình ảnh

1. Có sông giữa khung cảnh, phố cổ Trung Hoa tấp nập hai bờ, hai người đứng trên cầu.
2. Cùng nâng/thả đèn lên trời; tay không xuyên đèn, đèn không nhảy lúc rời tay.
3. Camera lùi khiến toàn cảnh 1 nhỏ lại và hướng lên theo đèn; cảnh 2 nối cùng không gian, rất nhiều đèn bay lên.
4. Mobile nhận ra cả hai bờ, sông và cầu; hộp thoại không bị che/cắt.

## 2. Random và tương tác

- Random kiểm soát: 0 chọn đầu, giá trị sát 1 chọn cuối, các khoảng giữa chọn đúng chỉ số.
- Mỗi lượt kích hoạt gọi selector đúng một lần. Cùng đèn qua nhiều lượt với random khác nhau trả lời chúc tương ứng, không gắn cố định.
- Hai lượt ra cùng chỉ số được phép trùng; không yêu cầu mọi lần phải khác nhau.
- Render lại, resize và đèn bay tiếp không đổi lời chúc đang đọc.
- Danh sách rỗng có thông báo/thử lại; một phần tử luôn trả đúng phần tử đó; dữ liệu có ID trùng hoặc text trống bị phát hiện.
- Nhấn nhanh không mở chồng hộp thoại hoặc chạy trùng hoạt cảnh. Không chọn đèn lúc chuyển camera.
- Đóng/chọn lại và “Xem lại” đúng trạng thái, không giữ hộp thoại cũ.

## 3. Thiết bị và truy cập

Chrome/Edge desktop, Safari iOS, Chrome Android; chuột, chạm, bàn phím. Kiểm tra 320, 390, 768, 1440 CSS px, zoom 200%, xoay ngang và safe area.

Kiểm tra tên nút đèn, Enter/Space, thứ tự Tab, focus trong hộp thoại và trả focus khi đóng. Đèn bay khỏi màn hình không làm mất focus. Giảm chuyển động vẫn tiếp cận cả hai cảnh và lời chúc.

## 4. Độ ổn định

Thử asset lỗi/retry, ẩn tab giữa lúc thả/chuyển camera và resize khi mở lời chúc. Lặp xem lại/mở đóng để phát hiện listener, đèn và tài nguyên tích lũy. Đo tải và độ mượt trên thiết bị tham chiếu trước khi chốt mật độ. Ghi kết quả thật và giới hạn trước phát hành.
