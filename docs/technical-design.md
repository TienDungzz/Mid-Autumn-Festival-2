# Thiết kế kỹ thuật — Trung thu

Hoạt cảnh đối diện: `engine/release-motion.ts` cung cấp chung vị trí đèn và độ cao bốn bàn tay. Nâng trong 55% đầu, giữ tới 68%, rồi đèn bay lên và tay hạ dần. Xoay hai nhân vật đối mặt, IK cả bốn tay cập nhật sau mixer; khôi phục pose cơ sở mỗi lượt để không tích lũy sai lệch. Không sửa rest rig hoặc ghi đè GLB.

## 1. Trạng thái hiện hành

Runtime dùng TypeScript strict, Vite và Three.js với UI DOM/CSS trong src/main.ts. Phạm vi theo [yêu cầu sản phẩm](product-requirements.md).

Luồng trạng thái: homeLoading → homeReady → openingDoors → scene1Ready → releasing → transitioning → scene2Ready. Home hiển thị trong homeLoading; tải tài nguyên bắt buộc lỗi chuyển homeError, thử lại quay về homeLoading. Chỉ cho mở cửa khi cảnh 1 sẵn sàng. Hộp thoại lời chúc là trạng thái con của scene2Ready. “Xem lại” hủy chuyển động, đóng lời chúc và đặt lại đầu cảnh 1.

## 2. Trách nhiệm

- Scene controller: điều phối trạng thái, chặn kích hoạt trùng, reset.
- Renderer Three.js: sông, phố hai bờ, cầu, nhân vật, đèn và ánh sáng.
- Camera timeline: lùi camera, thu nhỏ toàn cảnh và hướng lên theo đèn, không nhảy vị trí.
- Lantern system: đèn gần/xa, vòng đời bay, vùng chọn, phân biệt đèn trang trí và tương tác.
- Wish selector: danh sách và phép chọn random độc lập renderer.
- UI overlay: hướng dẫn, nút, hộp thoại, bàn phím tương đương cảnh đồ họa.

## 3. Dữ liệu và random

Lời chúc hiện là mảng readonly các chuỗi trong content/wishes.ts. Mỗi đèn có ID và cờ interactive. UI lưu lastLantern và nội dung đã chọn trong hộp thoại; chưa dùng wishId hoặc schema validate nội dung.

Với N lời chúc, chọn chỉ số Math.floor(random() * N), random trả giá trị trong [0, 1). Mỗi phần tử có xác suất bằng nhau. Cho phép tiêm hàm random để kiểm thử, không cần random bảo mật.

Mỗi sự kiện kích hoạt hợp lệ khi cảnh 2 sẵn sàng và hộp thoại đóng gọi random đúng một lần, lưu kết quả rồi mở hộp thoại. Không gọi random trong render hay mỗi frame, không gắn cố định lời chúc cho đèn. Cho phép trùng giữa các lượt. N = 0 báo lỗi/thử lại, N = 1 luôn trả phần tử duy nhất.

## 4. Hoạt cảnh và vòng đời

- Đèn chính luôn là object của scene, không parent vào tay. releasePose đồng bộ vị trí đèn/bàn tay và nối sang đường bay; không có bước detach/reparent ở runtime hiện tại.
- Giữ cùng không gian cảnh khi camera lùi/hướng lên. Chỉ bật chọn đèn khi chuyển cảnh hoàn tất.
- Reset đặt phase/timeline, đèn chính, độ cao đèn tương tác, nhân vật và camera về đầu; UI đóng hộp thoại. Reset dùng lại scene/listener hiện có; dispose mới hủy RAF/listener và tài nguyên.
- Tạm dừng khi tab ẩn; resize cập nhật aspect và cấu hình camera. Camera thực khi đang sky/transition còn vấn đề cần xử lý theo verification-report.md. Giảm chuyển động vẫn dùng cùng luồng trạng thái.
- Giới hạn số đèn hoạt động, tái sử dụng đèn ra khỏi vùng nhìn, giảm chi tiết đèn xa và cleanup khi tháo cảnh.
- Focus mới hoặc mở lời chúc tạm giữ đèn. Khi đóng, UI trả focus về đèn cũ hoặc đèn đang hiện rồi xóa trạng thái giữ để đèn tiếp tục bay dù vừa nhận lại focus.

## 5. Dữ liệu và kiểm chứng

Lời chúc là nội dung có sẵn, không cần tài khoản, camera hoặc backend. Render như text, không chèn HTML từ dữ liệu. Tải lỗi có thử lại, rà soát bản quyền asset.

Đo bản dựng thật để chốt mật độ đèn, đám đông và phản chiếu. Rà soát rig/animation nhân vật cũ trước khi tái sử dụng. Kiểm chứng theo [chiến lược kiểm thử](testing-strategy.md).

## 6. Quy chuẩn và sản xuất mô hình

Triển khai theo [quy chuẩn code](coding-standards.md) và [cấu trúc thư mục](folder-structure.md). Có thể dùng Blender MCP để dựng/chỉnh mô hình và animation theo [quy trình Blender](blender-workflow.md). MCP chỉ dùng lúc sản xuất; web tải GLB đã xuất và không cần kết nối Blender.

Nguồn .blend thuộc art, script bpy thuộc scripts/blender, bản xuất thử thuộc .qa và tài nguyên runtime đã QA thuộc public. Quyết định stack theo [ADR](architecture-decisions.md); chất lượng theo [quality checks](quality-checks.md), [hiệu năng](performance-standards.md) và [bảo mật](security-standards.md).

## 7. Lớp home và chuyển động hai cánh

Lớp cửa DOM/CSS hiện nằm trong main.ts và shared/styles/main.css; app quản lý homeLoading/homeReady/openingDoors và điều kiện sceneReady. Engine tải tài nguyên bên dưới nhưng chưa chạy timeline thả đèn và chưa nhận thao tác người dùng.

Hai cánh và nội dung giữa là các lớp riêng; dùng transform/opacity cho hiệu ứng, tránh tính lại bố cục mỗi frame. Một callback hoàn tất chuyển trạng thái sang scene1Ready; có đường hoàn tất khi giảm chuyển động không phát transitionend. Khóa CTA cả ở UI và controller trong openingDoors.

Ẩn tương tác/focus của scene dưới home. Mở xong gỡ lớp che, chuyển focus sang nút thả đèn. Hủy listener/timeline khi unmount; kết quả tải đến muộn sau reset không được tự mở cửa. “Xem lại” chỉ reset cảnh 1, không dựng lại home. Khi đổi kích thước hoặc tùy chọn giảm chuyển động giữa lúc mở, phải kết thúc hợp lệ, không kẹt lớp che.

Home không cần mô hình Blender riêng: dùng CSS/SVG cho cánh cửa và họa tiết; Blender MCP tiếp tục phục vụ model/animation cảnh bên dưới.

## 8. Phố mở rộng, thuyền và đèn bay

engine/boats.ts tạo thuyền mái vòm thấp, tuyến dọc sông hai chiều và vệt nước; vòng render dùng delta time chung, tạm dừng theo tab/giảm chuyển động. Kiểm tra chiều cao mái với mặt dưới cầu trên tuyến, không tăng point light cho mỗi đèn.

engine/glow.ts chia sẻ texture quầng sáng cho sprite cộng sáng, depthWrite tắt. Nhà có đèn treo tầng trên và dải LED bằng vật liệu phát sáng. Quầng sáng chỉ là hiệu ứng hiển thị, không coi là mô phỏng phản chiếu thật.

Đã bỏ hai hình sao Hằng Nga và chú Cuội cùng module constellations.ts. Giữ sao nền dạng Points. engine/moon.ts tạo texture trăng canvas 512px với mảng tối/miệng hố; resize đặt trăng theo camera đích, desktop lệch trái và dưới tiêu đề. Đèn ông sao dùng public/branding/star-lantern.svg ở home và dòng gợi ý cảnh.

Các đèn lớn dùng tọa độ thế giới và tốc độ bay riêng. advanceFlight trong engine/lantern-flight.ts xử lý bay lên/tái sử dụng và pause khi focus. Không còn unproject vị trí lưới cố định mỗi frame; UI chỉ project vị trí thực để bám vùng nhấn.
