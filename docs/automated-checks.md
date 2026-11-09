# Phạm vi kiểm tra tự động

Chạy `npm.cmd run check` hoặc `node scripts/check-code.mjs`: TypeScript → ESLint → Stylelint → BEM → Prettier → unit tests → build → performance budget → security tĩnh. Dừng ở lỗi đầu tiên. Python/Blender, trình duyệt và host production nằm ngoài phạm vi.

## BEM HTML/CSS

`check:bem` dùng TypeScript AST để đọc các phép gán HTML/className tĩnh, parse5 để đọc HTML và PostCSS/selector parser để đọc CSS. Có kiểm cú pháp tên BEM, modifier đi cùng base trên cùng phần tử, ID HTML trùng trong mỗi fragment, cấm selector ID trong CSS và CSS class có khai báo HTML/className. Hai class thêm bằng classList là home--opening và reduced-motion được khai báo ngoại lệ rõ trong checker. ID HTML vẫn dùng cho ARIA và điều phối.

Template helper chỉ được phân tích khi có thể giải bằng literal; không thực thi ứng dụng. Không xác minh mọi đường chạy, element/block ownership, toàn bộ cú pháp HTML hoặc mọi class động. Stylelint tiếp tục kiểm CSS và selector specificity.

## Performance

`check:performance` cần dist mới nhất, đọc scripts/performance-budgets.json. Trần hồi quy tạm: JS mỗi file 700 KiB, JS gzip 200 KiB, CSS 50 KiB, GLB 8 MiB, PNG 256 KiB, SVG 32 KiB, tổng artifact 18 MiB. Vượt trần trả mã lỗi. Đây là mức chặn tăng thêm theo bản hiện tại, không phải chứng nhận tối ưu hoặc mục tiêu phát hành. Không tăng trần chỉ để bỏ lỗi.

Không đo thời gian tải, frame time, FPS, draw calls, bộ nhớ, long task, rò rỉ hoặc mobile thật. Các tiêu chí đó vẫn theo performance-standards.md.

## Security

`check:security` cần dist mới nhất. Kiểm source TS để phát hiện eval/Function, các sink HTML/code được nhận diện, innerHTML/outerHTML không giải tĩnh được. HTML được kiểm inline event handler, URL javascript/vbscript, liên kết target=_blank thiếu noopener. Kiểm public/dist để chặn file nguồn, cache, cấu hình nhạy cảm và một số mẫu credential trong file text; không in giá trị credential.

Đây là kiểm tĩnh có giới hạn, không phải quét secret đầy đủ hoặc pentest. Không phát hiện mọi sink qua alias/computed property, không phân tích tất cả file nhị phân, không kiểm CSP/HTTPS, dependency hoặc giấy phép.

`audit:security` chạy npm audit online riêng với audit-level=high. Moderate vẫn được báo nhưng không làm lệnh thất bại; high/critical làm thất bại. Không tự gọi trong check offline. Audit gần nhất còn 10 moderate trong dependency dev, chưa xử lý.

## Kiểm chứng checker

tests/project-audit.test.mjs có fixture hợp lệ/không hợp lệ cho BEM, modifier/base, ID trùng, URL/event handler, CSS selector, static template, dynamic HTML, file cấm và budget. Tổng hiện có 17 test case cùng các test logic dự án. Các checker qua không có nghĩa đã hoàn thành mọi quy chuẩn kiến trúc hoặc nghiệm thu UI.
