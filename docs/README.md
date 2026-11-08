# Tài liệu dự án Trung thu

## Phạm vi hiện hành

- [Định hướng hình ảnh phố cổ và mức chi tiết](art-direction.md)

Hai cảnh: đôi nhân vật thả lồng đèn trên cầu giữa phố cổ Trung Hoa bên sông → camera thu nhỏ cảnh đầu và hướng lên trời nhiều đèn → nhấn đèn nhận lời chúc ngẫu nhiên.

- [Yêu cầu sản phẩm](product-requirements.md)
- [Bối cảnh, storyboard và lời chúc mẫu](scene-design.md)
- [Luồng trải nghiệm](user-flows.md)
- [Đặc tả UI/UX](ui-ux-spec.md)
- [Thiết kế kỹ thuật](technical-design.md)
- [Quy chuẩn code và BEM](coding-standards.md)
- [Cấu trúc thư mục](folder-structure.md)
- [Quy trình dựng mô hình bằng Blender MCP](blender-workflow.md)
- [Quyết định kiến trúc](architecture-decisions.md)
- [Tiêu chuẩn hiệu năng](performance-standards.md)
- [Tiêu chuẩn bảo mật và tài nguyên](security-standards.md)
- [Cổng kiểm tra chất lượng](quality-checks.md)
- [Kế hoạch triển khai](implementation-plan.md)
- [Chiến lược kiểm thử](testing-strategy.md)

## Vận hành và nội dung

- [Đa ngôn ngữ VI/EN](localization.md)
- [Build và deploy](deployment-guide.md)

Nguồn trong art/characters/ là đầu vào script tạo hai nhân vật Trung thu. Bản Blender trung gian nằm trong .qa/characters và không thuộc nguồn cần commit. Đã bỏ tài liệu frame/theme photobooth không còn áp dụng.

Home đã chọn layout **Hai cánh mở**; bố cục, responsive và tương tác xem tại [UI/UX](ui-ux-spec.md).

- [Kết quả kiểm tra bản dựng hiện tại](verification-report.md)
