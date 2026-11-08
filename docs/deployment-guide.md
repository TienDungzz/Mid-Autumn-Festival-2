# Build và deploy — Trung thu

## Chạy local

Khuyến nghị Node.js 22.13 trở lên trong nhánh 22, hoặc Node.js 24 trở lên để tương thích ESLint 10. Dùng npm.cmd ci với package-lock.json, sau đó npm.cmd run dev. Dev server hiện ở http://127.0.0.1:5177/ và strictPort; nếu cổng bận phải dừng tiến trình đang giữ cổng hoặc thay cấu hình có chủ đích.

## Kiểm tra và build

Chạy npm.cmd run check để kiểm TypeScript, ESLint, Stylelint, Prettier, unit test và build. npm.cmd run build tạo dist; npm.cmd run preview dùng để xem bản build local, không phải máy chủ production.

Artifact phát hành chỉ là nội dung dist. Vite sao chép public vào dist; không upload cả repository, art, scripts, tests, .qa, .cache hoặc node_modules. Nguồn Blender không nằm trong public và không làm tăng dung lượng tải web.

## Hosting

Chưa chọn nhà cung cấp hoặc cấu hình CI/deploy. Ứng dụng là site tĩnh, không có backend hoặc secret runtime. URL asset hiện bắt đầu bằng /branding và /models, phù hợp phục vụ ở gốc domain; cần sửa và kiểm lại đường dẫn nếu deploy dưới subpath. Kiểm HTTPS, MIME GLB, cache và hành trình hai cảnh sau deploy.

Build còn cảnh báo JS bundle lớn; hai GLB là phần tải chính. Cần đo tải và frame time trên thiết bị tham chiếu trước phát hành. Xem performance-standards.md và verification-report.md; build thành công không thay thế QA trên mobile thật.
