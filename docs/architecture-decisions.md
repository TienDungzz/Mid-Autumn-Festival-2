# Quyết định kiến trúc — Trung thu

## 1. Trạng thái

Các quyết định photobooth trước đây đã được thay thế về phạm vi. Tài liệu này ghi định hướng hiện hành; không xác nhận ứng dụng hoặc toolchain đã có.

| ID | Quyết định | Trạng thái |
| --- | --- | --- |
| ADR-001 | Hai cảnh nối tiếp trong cùng không gian, camera lùi rồi hướng lên | Chấp nhận về thiết kế |
| ADR-002 | Blender MCP hỗ trợ sản xuất model/animation, không dùng trong runtime web | Chấp nhận về quy trình |
| ADR-003 | Tách app, features, domain và engine theo folder-structure | Chấp nhận về thiết kế |
| ADR-004 | TypeScript; React/Vite và Three.js là phương án xem xét | Đề xuất, chưa chốt |
| ADR-005 | Nguồn .blend trong art; GLB đã QA trong public; staging trong .qa | Chấp nhận về quy trình |
| ADR-006 | Mỗi lượt chọn đèn lấy random mới từ danh sách, có thể trùng | Chấp nhận về hành vi |

## 2. Lý do và hệ quả

Giữ cùng không gian tránh đứt chuyển động đèn/camera và giảm asset trùng. UI điều phối qua adapter engine để domain random/state có thể kiểm thử độc lập thư viện 3D.

Blender phù hợp tạo cầu, module phố cổ, đèn và hoạt cảnh nhân vật. MCP cho phép thao tác live scene qua bpy và xem kết quả; kết nối phải kiểm tra khi bắt đầu phiên. Nguồn biên tập tách khỏi file web để giữ chất lượng và khả năng chỉnh sửa.

Chọn stack sau prototype thả đèn, rig và camera trên mobile. Nếu dùng compression hoặc custom shader, cần xác nhận loader/thiết bị hỗ trợ và có QA tương ứng. Website hoạt động từ asset đã xuất mà không cần Blender mở.

## 3. Ghi quyết định mới

Mỗi thay đổi kiến trúc ghi: vấn đề, phương án, lựa chọn, trạng thái, hệ quả, bằng chứng thử nghiệm và tài liệu cần cập nhật. Phân biệt đề xuất với triển khai thực tế; không nâng trạng thái chỉ vì đã thêm vào docs.

Xem [thiết kế kỹ thuật](technical-design.md) và [Blender MCP](blender-workflow.md).
