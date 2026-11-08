# Đặc tả UI/UX Trung thu

CTA thả đèn/trở lại bầu trời dùng nút bo tròn, icon SVG đèn trời/mây sao và mũi tên, nền vàng/teal tương ứng. Chiều rộng cố định theo cả hai ngôn ngữ. Khi đóng lời chúc, trả focus về đèn nếu còn khả dụng nhưng bỏ trạng thái giữ đèn để nó tiếp tục bay; lượt focus mới qua bàn phím vẫn tạm giữ để dễ chọn.

Thanh điều khiển hiện hành nằm góc trên phải: chọn ngôn ngữ VI/EN → bật/tắt âm thanh → quay lại. Bỏ nút giảm chuyển động; vẫn tự theo prefers-reduced-motion của thiết bị. Nút quay lại từ cảnh 2 về cầu, từ cầu về home, tạm khóa khi hoạt cảnh đang chạy. Home không hiển thị nút quay lại. Mobile giữ các nút 44px và dùng biểu tượng kèm nhãn truy cập.

Chọn ngôn ngữ dùng dropdown tùy chỉnh nền tối, viền vàng và dấu chọn; menu nổi không chiếm chỗ trong bố cục. Hỗ trợ Enter/Space, phím mũi tên, Home/End, Escape, đóng khi nhấn ngoài hoặc chuyển focus ra ngoài. Cố định chiều rộng nút ngôn ngữ, âm thanh, quay lại và các CTA theo cả bản Việt/Anh để tránh dịch chuyển bố cục khi đổi nhãn.

Âm thanh nền gợi tiếng nước được tạo bằng Web Audio, mặc định tắt và chỉ chạy khi người dùng bấm bật; ẩn tab thì tạm dừng. Chuyển ngôn ngữ cập nhật giao diện, hướng dẫn, nhãn truy cập và lời chúc đang mở sang bản dịch tương ứng; không tải lại cảnh hoặc chọn ngẫu nhiên lời chúc khác. Ghi nhớ ngôn ngữ nếu storage khả dụng. Tên thương hiệu và biển tiệm trong tài nguyên 3D giữ như thiết kế.

Typography tiếng Việt: nội dung dùng Segoe UI/Arial, tiêu đề và lời chúc ưu tiên Times New Roman với fallback Noto Serif/Liberation Serif. Không dùng Georgia làm font chính hoặc giãn chữ theo em cho nhãn tiếng Việt; giữ letter-spacing và word-spacing bình thường để tránh ký tự có dấu bị rời nhau. Biển tiệm vẽ trên canvas dùng cùng họ serif hỗ trợ tiếng Việt. Font hệ thống không cần tải ngoài.

## 1. Bố cục

Ưu tiên toàn cảnh, điều khiển gọn không che đôi nhân vật hay lồng đèn chính. Hình ảnh theo [storyboard](scene-design.md), hành vi theo [luồng trải nghiệm](user-flows.md).

| Trạng thái           | Nội dung và điều khiển                                                |
| -------------------- | --------------------------------------------------------------------- |
| Home đang tải        | Hai cánh cửa khép, tiêu đề giữa; trạng thái tải thật, thử lại khi lỗi |
| Home sẵn sàng        | Nút “Bước vào đêm trăng” ở giữa hai cánh                              |
| Đang mở cửa          | Hai cánh tách sang hai bên, hé lộ cảnh 1; khóa kích hoạt lặp          |
| Cảnh 1               | Sông, hai bờ phố cổ, đôi nhân vật trên cầu; “Thả lồng đèn”            |
| Đang thả/chuyển cảnh | Ưu tiên hoạt cảnh, chưa nhận thêm lượt bắt đầu hoặc chọn đèn          |
| Cảnh 2               | Bầu trời nhiều đèn, hướng dẫn chọn đèn, “Xem lại”                     |
| Lời chúc             | Hộp thoại “Lời chúc đêm trăng”, một lời chúc, “Đóng”                  |

## 2. Hình ảnh và responsive

- Giữ phong cảnh đêm và ánh đèn ấm xuyên suốt; không đổi thành ban ngày theo theme hệ thống.
- Desktop ưu tiên chiều rộng đọc rõ sông và hai bờ. Mobile chỉnh góc camera để vẫn nhận ra hai bờ, cây cầu và đôi nhân vật.
- Đèn tương tác nằm ở vùng dễ chọn. Đèn quá xa chỉ trang trí.
- Hộp thoại có nền đủ tương phản, chữ xuống dòng dễ đọc. Chừa safe area, không che nút điều khiển.
- Kiểm tra chiều rộng 320, 390, 768, 1440 CSS px, xoay ngang và zoom 200%.

## 3. Tương tác và truy cập

- Vùng nhấn tối thiểu 44 × 44 CSS px. Hover/focus gợi sáng nhẹ; mobile không phụ thuộc hover.
- Nếu dùng canvas/WebGL, cung cấp nút DOM tương đương, có tên như “Mở lời chúc từ lồng đèn 1” và hỗ trợ Enter/Space.
- Giữ thứ tự focus ổn định; đèn đang focus giữ khả dụng đến khi focus chuyển đi. Không đưa mọi đèn trang trí vào vòng Tab.
- Hộp thoại giữ focus, Escape/“Đóng” trả focus về đèn đã chọn hoặc điều khiển khả dụng tiếp theo. Trình đọc màn hình đọc lời chúc mới một lần.
- Tôn trọng giảm chuyển động, tránh nhấp nháy. Lời chúc không tự đóng theo bộ đếm.

## 4. Nội dung giao diện

“Bước vào đêm trăng” · “Đang chuẩn bị đêm trăng…” · “Thả lồng đèn” · “Chạm vào một chiếc lồng đèn để nhận lời chúc” · “Lời chúc đêm trăng” · “Đóng” · “Xem lại” · “Đang tải khung cảnh…” · “Chưa thể tải lời chúc” · “Thử lại”.

## 5. Layout home đã chọn — Hai cánh mở

Home là một bố cục toàn màn hình như hai cánh cửa cổ khép lại, không dùng hero chia chữ trái/cảnh 3D phải. Đường ghép cửa nằm giữa; tiêu đề, lời dẫn và CTA căn giữa trên một lớp nội dung riêng, không bị đường ghép cắt chữ.

- Hai cánh: nền xanh đêm, họa tiết cửa cổ Trung Hoa và điểm nhấn đỏ trầm/vàng ấm; chi tiết tiết chế để chữ rõ. Chưa phô toàn cảnh 3D.
- Trung tâm: tiêu đề đề xuất “Một đêm trăng, ngàn điều ước.”, lời dẫn ngắn và nút “Bước vào đêm trăng”. Nội dung chữ có thể biên tập sau.
- Góc trên trái: tên/logo dự án nhỏ, không cần thanh header ngang hoặc menu điều hướng lớn.
- Góc trên phải: chọn ngôn ngữ và bật/tắt âm thanh; khi vào cảnh có thêm nút quay lại. Không còn nút giảm chuyển động riêng.
- Sau CTA: tiêu đề/lời dẫn mờ đi, hai cánh trượt ra trái/phải đồng bộ để lộ cảnh 1 đã tải bên dưới. Kết thúc, gỡ lớp cửa khỏi tương tác và vòng Tab, đưa focus tới “Thả lồng đèn”.
- Người dùng chủ động nhấn “Thả lồng đèn” để bắt đầu hoạt cảnh tiếp theo; mở cửa không đồng thời thả đèn.
- Thời lượng mở đề xuất 1–1,5 giây để thử bản dựng. Giảm chuyển động bỏ trượt cửa, chuyển nhanh/nhẹ sang cảnh 1 nhưng vẫn giữ cùng thứ tự trạng thái.

Mobile vẫn dùng hai cánh mở ngang để nhất quán. Cho tiêu đề xuống dòng, giữ CTA trong vùng nhìn, chừa safe area và khoảng trống cho điều khiển góc. Không tạo cuộn ngang hoặc phụ thuộc gesture kéo cửa. Nếu màn hình thấp/zoom lớn, cho nội dung home cuộn dọc thay vì cắt nút.

“Xem lại” ở cảnh 2 trở về đầu cảnh 1, không đóng/mở cửa lại. Reload trang trở về home. Hai cánh cửa là lớp UI mở đầu, không phải cảnh thứ ba trong storyboard.

## 6. Đèn lời chúc chuyển động

Đèn lớn bay lên trong cảnh 3D; nút DOM tương đương bám theo vị trí chiếu thực của đèn. Đèn nhỏ và quầng sáng xa chỉ trang trí. Giữ viền gợi ý nhẹ, nhãn hover/focus và vùng nhấn đủ lớn; hướng dẫn là “Chạm vào lồng đèn lớn đang bay để nhận lời chúc”.

Tạm giữ chiếc đèn khi có focus bàn phím hoặc mở lời chúc để tránh mất mục tiêu thao tác. Khi focus rời đi, tiếp tục bay. Giảm chuyển động cho phép đèn đứng yên. Đèn ngoài vùng nhìn không nhận thao tác; đèn bay qua phía trên rồi được tái sử dụng ở phía dưới. Đây là thay đổi thay thế bố trí 12 đèn cố định trước đó.

Không còn hai hình sao Hằng Nga và chú Cuội. Giữ sao nền, trăng có chi tiết bề mặt và đèn ông sao trang trí không nhận focus. Trăng đặt theo viewport đích, desktop lệch trái và dưới tiêu đề. Cả ba CTA Bước vào đêm trăng, Thả lồng đèn và Trở lại bầu trời dùng nút bo tròn, icon SVG và chiều rộng ổn định giữa VI/EN.
