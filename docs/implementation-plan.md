# Kế hoạch triển khai Trung thu

Đây là kế hoạch, chưa đánh dấu tính năng hoàn thành. Phạm vi theo [yêu cầu sản phẩm](product-requirements.md), hình ảnh theo [storyboard](scene-design.md).

| Mốc | Đầu ra | Điều kiện hoàn thành |
| --- | --- | --- |
| 1. Chốt hình ảnh/nền tảng | Phác sông, cầu, hai bờ phố; camera; rà soát asset và chọn công nghệ | Bố cục rõ trên desktop/mobile; biết asset cần dựng mới |
| 2. Cảnh 1 | Sông giữa phố cổ Trung Hoa tấp nập hai bờ, đôi nhân vật trên cầu | Đọc rõ bối cảnh và chủ thể, ánh sáng lễ hội |
| 3. Thả đèn/chuyển cảnh | Cùng nâng/thả đèn; camera lùi và hướng lên | Tay/đèn đồng bộ, cảnh 1 nhỏ dần liên tục |
| 4. Cảnh 2/lời chúc | Nhiều đèn bay, danh sách lời chúc, random và hộp thoại | Mỗi lượt chọn random một lần; đóng/chọn lại được, cho phép trùng |
| 5. Hoàn thiện | Responsive, bàn phím, giảm chuyển động, tải lỗi, reset, tối ưu | Đạt [kiểm thử](testing-strategy.md), không tích lũy tài nguyên khi xem lại |

Kiểm chứng sớm động tác thả đèn và camera trên mobile. Chốt mật độ phố/đám đông/đèn sau đo bản dựng. Không triển khai luồng photobooth từ tài liệu cũ trong các mốc này.

## Quy trình tài nguyên Blender MCP

Ở mốc 1 kiểm kết nối/scene và lập danh sách model; mốc 2 dựng cầu, phố, đèn và rà soát nhân vật; mốc 3 tạo/kiểm animation nâng-thả đèn. Mỗi lần xuất đi qua .qa rồi kiểm loader web trước khi đưa vào public. Theo [Blender MCP](blender-workflow.md), [cấu trúc thư mục](folder-structure.md) và [quality checks](quality-checks.md). Chưa coi kết nối MCP, model hoặc script là đã được kiểm chứng chỉ vì có trong kế hoạch.
