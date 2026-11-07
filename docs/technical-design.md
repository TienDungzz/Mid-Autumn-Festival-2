# Thiết kế kỹ thuật — Trung thu

## 1. Trạng thái đề xuất

Thiết kế này chưa xác nhận runtime hoặc stack đã tồn tại. Phạm vi theo [yêu cầu sản phẩm](product-requirements.md).

Luồng trạng thái: loading → scene1Ready → releasing → transitioning → scene2Ready. Tải lỗi chuyển loadError, thử lại quay về loading. Hộp thoại lời chúc là trạng thái con của scene2Ready. “Xem lại” hủy chuyển động, đóng lời chúc và đặt lại đầu cảnh 1.

## 2. Trách nhiệm

- Scene controller: điều phối trạng thái, chặn kích hoạt trùng, reset.
- Renderer: sông, phố hai bờ, cầu, nhân vật, đèn và ánh sáng; chọn công nghệ sau thử nghiệm.
- Camera timeline: lùi camera, thu nhỏ toàn cảnh và hướng lên theo đèn, không nhảy vị trí.
- Lantern system: đèn gần/xa, vòng đời bay, vùng chọn, phân biệt đèn trang trí và tương tác.
- Wish selector: danh sách và phép chọn random độc lập renderer.
- UI overlay: hướng dẫn, nút, hộp thoại, bàn phím tương đương cảnh đồ họa.

## 3. Dữ liệu và random

Mỗi lời chúc có id duy nhất và text không rỗng. Mỗi đèn có id và cờ interactive. Trạng thái lời chúc mở lưu lanternId và wishId.

Với N lời chúc, chọn chỉ số Math.floor(random() * N), random trả giá trị trong [0, 1). Mỗi phần tử có xác suất bằng nhau. Cho phép tiêm hàm random để kiểm thử, không cần random bảo mật.

Mỗi sự kiện kích hoạt hợp lệ khi cảnh 2 sẵn sàng và hộp thoại đóng gọi random đúng một lần, lưu kết quả rồi mở hộp thoại. Không gọi random trong render hay mỗi frame, không gắn cố định lời chúc cho đèn. Cho phép trùng giữa các lượt. N = 0 báo lỗi/thử lại, N = 1 luôn trả phần tử duy nhất.

## 4. Hoạt cảnh và vòng đời

- Đồng bộ đèn với tay khi nâng. Tại mốc buông, giữ nguyên vị trí thế giới rồi chuyển đèn sang chuyển động bay độc lập.
- Giữ cùng không gian cảnh khi camera lùi/hướng lên. Chỉ bật chọn đèn khi chuyển cảnh hoàn tất.
- Reset hủy timeline/listener cũ, đặt lại đèn, nhân vật, camera và hộp thoại; không nhân đôi tài nguyên.
- Tạm dừng khi tab ẩn; resize cập nhật camera và vùng nhấn. Giảm chuyển động vẫn dùng cùng luồng trạng thái.
- Giới hạn số đèn hoạt động, tái sử dụng đèn ra khỏi vùng nhìn, giảm chi tiết đèn xa và cleanup khi tháo cảnh.
- Giữ các đèn tương tác đang focus khả dụng; nếu đèn đã chọn không còn sau đóng hộp thoại, trả focus về điều khiển chọn đèn tiếp theo.

## 5. Dữ liệu và kiểm chứng

Lời chúc là nội dung có sẵn, không cần tài khoản, camera hoặc backend. Render như text, không chèn HTML từ dữ liệu. Tải lỗi có thử lại, rà soát bản quyền asset.

Đo bản dựng thật để chốt mật độ đèn, đám đông và phản chiếu. Rà soát rig/animation nhân vật cũ trước khi tái sử dụng. Kiểm chứng theo [chiến lược kiểm thử](testing-strategy.md).

## 6. Quy chuẩn và sản xuất mô hình

Triển khai theo [quy chuẩn code](coding-standards.md) và [cấu trúc thư mục](folder-structure.md). Có thể dùng Blender MCP để dựng/chỉnh mô hình và animation theo [quy trình Blender](blender-workflow.md). MCP chỉ dùng lúc sản xuất; web tải GLB đã xuất và không cần kết nối Blender.

Nguồn .blend thuộc art, script bpy thuộc scripts/blender, bản xuất thử thuộc .qa và tài nguyên runtime đã QA thuộc public. Quyết định stack theo [ADR](architecture-decisions.md); chất lượng theo [quality checks](quality-checks.md), [hiệu năng](performance-standards.md) và [bảo mật](security-standards.md).
