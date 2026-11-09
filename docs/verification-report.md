# Báo cáo hiện trạng và kiểm chứng

Cập nhật 09/11/2026. Báo cáo này thay phần nhật ký chồng chéo trước đó và mô tả repository hiện tại. Lần cập nhật docs không chạy lại QA trình duyệt, Blender hoặc đo hiệu năng.

**Kết luận:** bộ kiểm tra tự động hiện có đã qua ở lần chạy gần nhất; chưa đủ bằng chứng nghiệm thu phát hành.

Entry point scripts/check-code.mjs đã tích hợp BEM HTML/CSS, performance budget và security tĩnh. Có 7 test checker mới, tổng 17 test. Đã chuyển selector ID CSS sang class và bỏ button--small không dùng. Phạm vi/giới hạn tại automated-checks.md; chưa QA lại giao diện.

## Bằng chứng đã có

| Kiểm tra                  | Kết quả và phạm vi                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| npm.cmd run check         | Lần chạy 09/11 qua typecheck, ESLint 10, Stylelint 16, Prettier 3, test và build                                                           |
| Unit test                 | 17/17: 7 test checker và 10 test IK, release timeline, flight/pause/wrap, random, state, lighting, dịch và quay lại                        |
| Production build          | JS 671.42 kB, gzip 178.79 kB; còn cảnh báo chunk trên 500 kB                                                                               |
| Runtime asset             | Hai GLB tổng 15.741.392 bytes trước nén truyền tải                                                                                         |
| Chrome thủ công trước đây | Đã quan sát home → cầu → thả → bầu trời → mở/đóng lời chúc; hai CTA và đèn tiếp tục bay sau đóng                                           |
| Mobile/trăng              | Đã kiểm toán học mép trăng ở một số viewport; chưa phải QA điện thoại thật. Vị trí desktop đã chỉnh tiếp để tránh chữ, chưa QA lại toàn bộ |
| npm audit                 | Lần chạy 09/11: 10 moderate trong dependency dev, không high/critical; chưa xử lý bằng downgrade/override                                  |

Ngày 09/11 đã tạo và mở lại master sạch bằng Blender 4.5.15 LTS; xuất GLB thử qua prepare_characters.py vào .qa. Geometry/animation accessor, ảnh nhúng và số khớp skin khớp GLB runtime, dung lượng xuất bằng nhau. Master nam khoảng 6,65 MB, nữ 7,19 MB; mỗi file một scene/rig, không còn action cũ. Không thay GLB public. Có cảnh báo metadata đường dẫn ảnh cũ không tồn tại nhưng exporter dùng ảnh packed; chưa QA trực quan mọi khung hình.

## Đối chiếu tiêu chuẩn

- Đạt phần tự động hiện có: TypeScript strict, lint TS/JS và CSS, formatter, unit test, build.
- Có state machine, random thuần, nội dung lời chúc bằng textContent; engine không import UI/app.
- Có render delta giới hạn, pause tab ẩn, mixer trước IK, reset và dispose tài nguyên/listener.
- Có dialog native, focus-visible, inert, menu bàn phím và prefers-reduced-motion; chưa nghiệm thu đầy đủ truy cập.
- Chưa đạt toàn bộ cấu trúc/BEM: main.ts còn gộp template/điều phối, CSS chung, config/nhãn còn rải. Selector ID đã bỏ, Stylelint cấm ID; checker qua chưa có nghĩa mọi quy tắc kiến trúc đã đạt.
- Chưa có CI, integration/e2e, assets manifest hoặc hồ sơ license hoàn chỉnh. Chưa đo mobile/Safari, FPS, frame time, bộ nhớ, draw calls hay thời gian tải.
- Python Blender chưa được ESLint/Stylelint/Prettier kiểm tra. art và public nằm ngoài phạm vi Prettier.

## Vấn đề còn mở từ rà soát code

1. **Camera resize:** resize cập nhật skyCamera/aspect nhưng camera thực chỉ reset khi idle. Ở sky có thể lệch bố cục khi xoay màn hình; cần xử lý cả resize giữa transition.
2. **bfcache:** pagehide dispose engine/audio và ngắt observer, chưa có pageshow khôi phục khi persisted; cần kiểm và sửa vòng đời.
3. **Glow cache:** texture cấp module có thể bị engine dispose rồi tái sử dụng khi retry. Cần quy định quyền sở hữu rõ.
4. **Hiệu năng:** có cấp phát vector/mảng và ghi DOM mỗi frame; profile trước khi tối ưu. GLB và JS bundle còn lớn.
5. **QA:** chưa kiểm đầy đủ mọi khung hình bàn tay/tay áo, mobile thật, zoom, bàn phím/screen reader, tải lỗi/retry và bộ nhớ sau nhiều lượt.

Các mục này là phát hiện tĩnh hoặc khoảng trống kiểm chứng, không tuyên bố mọi lỗi đã tái hiện trên thiết bị thật. Chưa được sửa trong lần cập nhật tài liệu.

## Nguồn và dọn tài nguyên

- Giữ art/characters/mid-autumn-male-source.blend và mid-autumn-female-source.blend vì script cần chúng; giữ texture nguồn và logo master.
- Đã xóa hai Blender trung gian cũ (46.640.954 bytes) và cache npm cục bộ (118.609.288 bytes), tổng 165.250.242 bytes, khoảng 157,6 MiB.
- Script ghi Blender trung gian vào .qa/characters đã gitignore; runtime vẫn dùng public/models/characters/festival-*.glb.
- Dọn art/cache làm gọn workspace, không trực tiếp giảm dung lượng web hoặc tăng FPS.
- Đã bỏ docs frame/theme photobooth; cập nhật localization, deployment và README nhân vật. Không còn hình sao Hằng Nga/chú Cuội; giữ sao nền, trăng và đèn ông sao trang trí.

Xem kế hoạch xử lý tại implementation-plan.md; tiêu chí kiểm tra tại testing-strategy.md.
