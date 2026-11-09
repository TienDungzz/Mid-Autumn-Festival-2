# Kiểm tra chất lượng — Trung thu

## 1. Trạng thái

Workspace đã có ứng dụng TypeScript/Vite/Three.js và bộ kiểm tra ESLint, Stylelint, Prettier. Chạy npm.cmd run check để kiểm type, lint TS/JS, lint CSS, định dạng, test và build. Chưa có CI; các cổng dưới đây vẫn là yêu cầu nghiệm thu, không phải tuyên bố đã đạt đầy đủ. Kết quả tại [báo cáo kiểm tra](verification-report.md), theo [quy chuẩn code](coding-standards.md) và [kiểm thử](testing-strategy.md).

## 2. Cổng kiểm tra

| Phạm vi thay đổi | Kiểm tra phù hợp                                                                  |
| ---------------- | --------------------------------------------------------------------------------- |
| Docs             | UTF-8, liên kết nội bộ, nhất quán yêu cầu và trạng thái triển khai                |
| Logic lời chúc   | Chỉ số random biên, rỗng/một phần tử, mỗi lượt một lần, không random trong render |
| Điều phối cảnh   | Chặn chạy trùng, chuyển trạng thái, reset, callback đến muộn, ẩn/hiện tab         |
| UI               | Responsive, chạm/bàn phím, focus, hộp thoại, giảm chuyển động                     |
| Asset Blender    | Nguồn/giấy phép, scale/pivot, node/clip, vật liệu/rig, preview và kiểm loader web |
| Engine           | Cleanup, dùng chung tài nguyên, vòng lặp render, số đèn ổn định sau reset         |
| Phát hành        | Build/typecheck/lint, hành trình hai cảnh, tải lỗi, đo mobile, artifact/cache     |

## 3. Công cụ hiện hành

Entry point scripts/check-code.mjs chạy typecheck, lint, BEM HTML/CSS, format, test, build, performance budget và security tĩnh. Dừng ở lỗi đầu tiên, không dùng shell. Phạm vi và ngoại lệ tại [automated-checks.md](automated-checks.md). Python Blender và CI chưa được kiểm bởi script này.

Các lệnh riêng check:bem, check:performance và check:security đã có trong package.json. Hai lệnh sau cần build mới nhất; audit:security online chạy riêng. Chưa có kiểm manifest hoặc xác định đầy đủ asset thừa.

Báo cáo ghi thiết bị, cấu hình render, kết quả và phần chưa kiểm tra. Không ghi “đạt” cho bước chưa chạy hoặc dùng preview Blender thay kiểm runtime. Không thêm test lặp lại implementation cho chỉnh sửa docs đơn giản.
