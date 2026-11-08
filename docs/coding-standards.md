# Quy chuẩn code — Trung thu

## 1. Phạm vi và định dạng

Áp dụng cho trải nghiệm hai cảnh tại [yêu cầu sản phẩm](product-requirements.md), theo [cấu trúc thư mục](folder-structure.md). Stack hiện hành là TypeScript strict, Vite và Three.js với UI DOM/CSS, không dùng React. Những quy tắc dưới đây là chuẩn mục tiêu; các sai lệch hiện tại được ghi trong verification-report.md.

- Văn bản UTF-8, LF, newline cuối file; TypeScript/CSS thụt 2 spaces, Python Blender 4 spaces.
- TypeScript strict; const mặc định, không dùng any để bỏ kiểm tra. Dữ liệu ngoài module bắt đầu bằng unknown rồi validate.
- Biến/hàm camelCase; type/component PascalCase; hằng cấu hình UPPER_SNAKE_CASE; thư mục kebab-case.
- Hàm có động từ rõ: releaseLantern, selectWish, resetStory, disposeScene. Thời gian có đơn vị như durationSeconds, elapsedMs.
- Component và CSS đặt cạnh nhau: WishDialog.tsx, WishDialog.css. Logic thuần như pick-wish.ts; test tương ứng pick-wish.test.ts.
- Không tắt lint toàn file hoặc nuốt lỗi bằng catch rỗng. Dùng formatter và cấu hình chung khi có toolchain.

## 2. Trạng thái và logic

- Dùng union/state machine cho homeLoading, homeReady, openingDoors, scene1Ready, releasing, transitioning, scene2Ready và homeError. Không ghép boolean tạo trạng thái mâu thuẫn.
- App sở hữu tiến trình hai cảnh. Logic lời chúc thuần không phụ thuộc UI hoặc engine 3D.
- Chỉ gọi random trong sự kiện chọn đèn hợp lệ, đúng một lần; lưu kết quả để render ổn định. Cho phép trùng giữa các lượt.
- Cấu hình camera, thời lượng, mật độ đèn và mốc buông tay có tên rõ, không rải số trực tiếp qua nhiều module.
- Dữ liệu danh sách lời chúc bất biến. Đối tượng đồ họa được cập nhật có chủ đích trong engine, không đưa từng transform mỗi frame vào state UI.
- Async dùng token/phiên để bỏ kết quả đến muộn sau reset hoặc tháo cảnh. Không khởi động hoạt cảnh trùng.

## 3. Render, animation và tài nguyên

- Một nơi sở hữu vòng lặp render; lấy delta time có giới hạn hợp lý, không giả định máy luôn chạy 60 fps.
- UI chỉ gửi lệnh qua API engine. Engine không import component, hook hoặc store UI.
- Animation mixer cập nhật trước bước hiệu chỉnh tay/IK nếu rig dùng IK. Mốc buông đèn giữ nguyên world transform khi tách khỏi tay.
- Một timeline chịu trách nhiệm camera chuyển cảnh; tránh nhiều hệ cùng ghi transform của camera hoặc đèn.
- Khai báo rõ nơi sở hữu geometry, material, texture, mixer, listener và timeline. Cleanup đúng chủ sở hữu; không dispose asset dùng chung khi còn instance khác sử dụng.
- Tạm dừng khi tab ẩn, resume không nhảy thời gian. Reset có thể gọi nhiều lần mà không nhân đôi đèn/listener.
- Đèn lặp dùng pooling/instancing khi phù hợp; không tạo geometry/material mới mỗi frame. Không raycast toàn cảnh nếu chỉ cần lớp đèn tương tác.
- Không sửa rig/rest pose hoặc apply transform của nhân vật tùy tiện; quy trình nguồn tại [Blender MCP](blender-workflow.md).

## 4. UI và CSS BEM

Dùng CSS thông thường theo BEM, trừ khi có quyết định thay đổi:

| Loại                   | Ví dụ                         |
| ---------------------- | ----------------------------- |
| Block                  | story-controls, wish-dialog   |
| Element                | wish-dialog__message          |
| Modifier               | wish-dialog--open             |
| Class gốc kèm modifier | wish-dialog wish-dialog--open |

Không nối element theo cây DOM; không dùng selector ID, selector sâu hoặc !important để chữa xung đột. Modifier không thay thế disabled/ARIA. Style component đặt cạnh component; token màu, spacing, typography, z-index dùng chung tại shared/styles.

Lời chúc hiện nằm trong content/wishes.ts; bản dịch VI/EN trong content/translations.ts. Nhãn gốc còn trong main.ts; tập trung hoàn toàn nội dung UI là việc còn lại. Phong cảnh luôn là đêm Trung thu, không đảo màu cảnh 3D theo theme.

Mobile-first, nút có nhãn, vùng nhấn tối thiểu 44 × 44 CSS px, focus rõ và hộp thoại truy cập được. Hỗ trợ prefers-reduced-motion cả CSS lẫn timeline 3D.

## 5. Python Blender

- Script dùng bpy nằm trong scripts/blender, có hàm vào rõ và tham số đường dẫn; không nhúng đường dẫn máy cá nhân.
- Tìm shader node theo type, không dựa tên hiển thị có thể bản địa hóa. Kiểm tra khả năng API/enum trên phiên bản Blender đang kết nối.
- Chỉnh màu vật liệu qua shader input. Quy ước tên object/collection và export theo [Blender MCP](blender-workflow.md).
- Script dựng lại chỉ tác động collection/tài sản do nó sở hữu. Không xóa toàn scene hoặc ghi đè master ngoài phạm vi tác vụ.
- Tách build, validate và export; kiểm tra context/mode/selection, lưu hoặc khôi phục trạng thái cần thiết. Ghi random seed nếu cần tái tạo bố trí.

## 6. Import và hoàn thành thay đổi

Theo chiều phụ thuộc tại folder-structure; không phụ thuộc vòng hoặc deep import nội bộ module khác. API công khai nhỏ, named export và import type khi phù hợp. Chỉ chuyển code lên shared khi thật sự dùng chung và không phụ thuộc nghiệp vụ.

Đã có build, typecheck, lint (ESLint), lint:css (Stylelint), format:check (Prettier) và test. Chạy npm.cmd run check để thực hiện toàn bộ. Các lệnh lint:fix, lint:css:fix và format dùng để sửa tự động; kiểm tra diff sau khi chạy. Cấu hình .editorconfig thống nhất UTF-8, LF và thụt dòng. Python Blender chưa được bộ lint/formatter này kiểm tra.

Stylelint kế thừa config-standard và kiểm tra tên class BEM. Selector ID hiện hữu được giữ như khoản nợ kỹ thuật, chưa áp cổng selector-max-id; không coi lint qua là đã hoàn tất việc chuyển sang class. Các override !important cho hidden/reduced motion vẫn cần theo dõi trong báo cáo. Chưa có CI tự động chạy các lệnh này.

Thay đổi hoàn thành khi đúng hành vi, kiểm tra phù hợp đã chạy, UI được xem ở kích thước liên quan và asset 3D được kiểm tra trong runtime. Test tập trung vào random, state transition, reset/cleanup và mốc animation; không viết test chỉ sao chép chi tiết triển khai. Xem [quality checks](quality-checks.md).
