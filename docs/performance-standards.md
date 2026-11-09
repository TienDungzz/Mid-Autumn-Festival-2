# Tiêu chuẩn hiệu năng — Trung thu

## 1. Mục tiêu và đo lường

Đã có check:performance áp budget dung lượng dist trong scripts/performance-budgets.json. Đây là trần hồi quy tạm theo bản hiện tại, không thay thế đo runtime. Xem ngưỡng và giới hạn tại [kiểm tra tự động](automated-checks.md).

Ưu tiên hoạt cảnh mượt, chọn đèn phản hồi ngay và đọc lời chúc ổn định trên mobile. Chưa có baseline hoặc thiết bị tham chiếu nên chưa xem bất kỳ budget nào là đã đạt. Khi có bản dựng, ghi thiết bị/trình duyệt, viewport, DPR, preset và số đèn/đám đông để so sánh.

Đo thời gian tới cảnh 1 dùng được, dung lượng tải, frame time p50/p95, draw calls, triangles và bộ nhớ tài nguyên. Mục tiêu thử nghiệm: khoảng 30 fps trở lên trên mobile tham chiếu và 60 fps trên desktop tham chiếu; chốt sau prototype. Không lấy FPS trung bình làm bằng chứng duy nhất.

## 2. Tài nguyên và cảnh

- Tải trước tài nguyên bắt buộc cảnh 1 và chuyển cảnh; trì hoãn chi tiết chưa cần, không để camera hướng lên cảnh chưa sẵn sàng.
- Public chỉ chứa GLB/texture đã tối ưu, không chứa .blend, texture nguồn hoặc preview QA.
- Tái sử dụng mesh/material; dùng instancing hoặc pooling cho đèn và kiến trúc lặp nếu phù hợp.
- Giới hạn DPR, đèn động, bóng, độ phân giải phản chiếu và post-processing theo preset đo thật. Không tạo point light/bóng riêng cho mọi đèn trời.
- Đèn xa, phố xa và đám đông giảm mức chi tiết; giữ đôi nhân vật và đèn chính đủ chất lượng.
- Texture lớn và compression phải có lý do, loader tương thích, QA sau nén.

## 3. Vòng lặp và tương tác

Một render loop, không tạo object/geometry/material mỗi frame. Không cập nhật UI state theo từng đèn mỗi frame. Chỉ hit-test lớp đèn tương tác, giữ vùng nhấn và focus ổn định.

Pause khi tab ẩn, giới hạn delta sau resume; reset và mở/đóng hộp thoại không nhân tài nguyên. Thử lặp toàn luồng để phát hiện rò rỉ; geometry/texture đang dùng chung chỉ dispose khi hết chủ sử dụng.

## 4. Giảm chất lượng và nghiệm thu

Preset thấp giảm đèn trang trí, đám đông, shadow/reflection và hiệu ứng trước khi giảm khả năng chọn đèn/đọc lời chúc. Vẫn giữ sông, hai bờ, cầu và cảm giác bầu trời nhiều đèn.

Đo trước/sau thay đổi lớn trong cùng điều kiện; ghi giới hạn còn lại. Giảm chuyển động là lựa chọn truy cập riêng, không đồng nhất với preset hiệu năng thấp.
