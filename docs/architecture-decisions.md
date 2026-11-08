# Quyết định kiến trúc — Trung thu

## 1. Trạng thái

Các quyết định photobooth trước đây đã được thay thế về phạm vi. Ứng dụng hiện có TypeScript strict, Vite, Three.js và UI DOM/CSS. Các phần cấu trúc chưa triển khai được ghi riêng trong folder-structure.md.

| ID      | Quyết định                                                                | Trạng thái                      |
| ------- | ------------------------------------------------------------------------- | ------------------------------- |
| ADR-001 | Hai cảnh nối tiếp trong cùng không gian, camera lùi rồi hướng lên         | Chấp nhận về thiết kế           |
| ADR-002 | Blender MCP hỗ trợ sản xuất model/animation, không dùng trong runtime web | Chấp nhận về quy trình          |
| ADR-003 | Tách app, features, domain và engine theo folder-structure                | Chấp nhận về thiết kế           |
| ADR-004 | TypeScript strict, Vite, Three.js và UI DOM/CSS                           | Đã triển khai, không dùng React |
| ADR-005 | Nguồn .blend trong art; GLB đã QA trong public; staging trong .qa         | Chấp nhận về quy trình          |
| ADR-006 | Mỗi lượt chọn đèn lấy random mới từ danh sách, có thể trùng               | Chấp nhận về hành vi            |

## 2. Lý do và hệ quả

Giữ cùng không gian tránh đứt chuyển động đèn/camera và giảm asset trùng. UI điều phối qua adapter engine để domain random/state có thể kiểm thử độc lập thư viện 3D.

Blender phù hợp tạo cầu, module phố cổ, đèn và hoạt cảnh nhân vật. MCP cho phép thao tác live scene qua bpy và xem kết quả; kết nối phải kiểm tra khi bắt đầu phiên. Nguồn biên tập tách khỏi file web để giữ chất lượng và khả năng chỉnh sửa.

Stack hiện hành đã có prototype thả đèn, rig và camera; vẫn cần đo trên mobile thật. Nếu dùng compression hoặc custom shader, cần xác nhận loader/thiết bị hỗ trợ và có QA tương ứng. Website hoạt động từ asset đã xuất mà không cần Blender mở.

## 3. Ghi quyết định mới

Mỗi thay đổi kiến trúc ghi: vấn đề, phương án, lựa chọn, trạng thái, hệ quả, bằng chứng thử nghiệm và tài liệu cần cập nhật. Phân biệt đề xuất với triển khai thực tế; không nâng trạng thái chỉ vì đã thêm vào docs.

Xem [thiết kế kỹ thuật](technical-design.md) và [Blender MCP](blender-workflow.md).

## 4. ADR-007 — Home Hai cánh mở

Trạng thái: chấp nhận theo lựa chọn người dùng. Home dùng hai cánh cửa DOM/CSS, nội dung giữa và CTA mở vào cảnh 1. Tách bước mở cửa khỏi bước thả đèn; tải cảnh dưới cửa trước khi cho mở. Cả desktop/mobile mở ngang; giảm chuyển động dùng chuyển nhẹ. “Xem lại” không quay lại home. Không bắt buộc thêm model Blender cho giao diện cửa.
