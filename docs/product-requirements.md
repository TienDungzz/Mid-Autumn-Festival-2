# Yêu cầu sản phẩm — Đêm Trung thu

## 1. Mục tiêu và phạm vi

Trải nghiệm Trung thu gồm hai cảnh nối tiếp: chàng trai và cô gái cùng thả lồng đèn trên cầu, sau đó góc nhìn mở rộng lên bầu trời để người xem khám phá lời chúc.

Đây là phạm vi hiện hành, thay thế định hướng photobooth cũ. Chọn frame, tải/chụp ảnh, chỉnh và xuất ảnh không thuộc phạm vi này. Tài liệu là yêu cầu thiết kế, không xác nhận tính năng đã được triển khai.

## 2. Cảnh 1 — Thả lồng đèn trên cầu

- Đêm Trung thu, dòng sông nằm giữa khung cảnh.
- Hai bên sông là phố cổ phong cách Trung Hoa với mái ngói, kiến trúc gỗ, cửa tiệm, đèn treo và người qua lại tấp nập.
- Cây cầu bắc qua sông, nối hai bờ phố. Chàng trai và cô gái đứng cạnh nhau trên cầu, là điểm nhìn chính.
- Hai người cùng nâng rồi thả một chiếc lồng đèn bay lên bầu trời. Đây là đèn trời, không phải hoa đăng thả trên sông.
- Ánh đèn ấm phản chiếu trên nước; không khí lãng mạn, ấm áp và nhộn nhịp lễ hội.

## 3. Cảnh 2 — Bầu trời lời chúc

- Camera lùi ra, thu nhỏ toàn bộ cảnh 1, đồng thời hướng lên theo chiếc đèn vừa thả.
- Cầu, hai người, sông và phố cổ nhỏ dần phía dưới; giữ liên tục không gian, không cắt sang một bầu trời không liên quan.
- Bầu trời chiếm phần lớn khung hình, có rất nhiều lồng đèn bay lên ở các độ cao, khoảng cách và kích thước khác nhau.
- Nhấn/chạm một lồng đèn để hiển thị một lời chúc được chọn ngẫu nhiên từ danh sách có sẵn.
- Mỗi lượt nhấn hợp lệ chọn ngẫu nhiên lại, kể cả cùng một đèn. Nội dung không gắn cố định theo đèn; cho phép trùng giữa các lượt.
- Chỉ mở một lời chúc mỗi lần. Lời chúc giữ nguyên khi đang đọc, không tự đổi theo chuyển động hoặc render.

## 4. Quy ước tương tác đề xuất

Các chi tiết sau là mặc định để triển khai, có thể tinh chỉnh sau khi xem bản dựng:

- Nút “Thả lồng đèn” bắt đầu hoạt cảnh cảnh 1; thả xong tự chuyển sang cảnh 2.
- Cảnh 2 có hướng dẫn “Chạm vào một chiếc lồng đèn để nhận lời chúc”.
- Lời chúc xuất hiện trong hộp thoại có nút “Đóng”. Đóng trước khi chọn đèn khác.
- Nút “Xem lại” đóng lời chúc và đặt lại đầu cảnh 1.
- Hỗ trợ bàn phím, mobile và giảm chuyển động; có thể giảm đèn trang trí trên thiết bị yếu nhưng vẫn giữ cảm giác nhiều đèn.

## 5. Nghiệm thu

1. Nhìn rõ sông ở giữa, phố cổ Trung Hoa tấp nập hai bờ, cầu và đôi nhân vật trên cầu.
2. Hai người cùng thả đèn bay lên; không dùng hành động tặng/nhận hoa trong kịch bản chính.
3. Camera thu nhỏ cảnh 1 và hướng lên liên tục, mở ra bầu trời nhiều đèn.
4. Mỗi lượt chọn đèn hiển thị đúng một lời chúc thuộc danh sách bằng một lượt chọn ngẫu nhiên mới.
5. Đóng, nhấn lại, xem lại, bàn phím và giảm chuyển động hoạt động theo [kiểm thử](testing-strategy.md).

Chi tiết tại [bối cảnh và storyboard](scene-design.md), [luồng trải nghiệm](user-flows.md), [UI/UX](ui-ux-spec.md).
