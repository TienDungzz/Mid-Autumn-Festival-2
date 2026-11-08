# Chiến lược kiểm thử Trung thu

Đây là tiêu chí kiểm chứng cho bản dựng hiện hành. Kết quả thực chạy và phần chưa kiểm tra nằm trong verification-report.md.

## 1. Hình ảnh

1. Có sông giữa khung cảnh, phố cổ Trung Hoa tấp nập hai bờ, hai người đứng trên cầu.
2. Cùng nâng/thả đèn lên trời; tay không xuyên đèn, đèn không nhảy lúc rời tay.
3. Camera lùi khiến toàn cảnh 1 nhỏ lại và hướng lên theo đèn; cảnh 2 nối cùng không gian, rất nhiều đèn bay lên.
4. Mobile nhận ra cả hai bờ, sông và cầu; hộp thoại không bị che/cắt.

## 2. Random và tương tác

- Random kiểm soát: 0 chọn đầu, giá trị sát 1 chọn cuối, các khoảng giữa chọn đúng chỉ số.
- Mỗi lượt kích hoạt gọi selector đúng một lần. Cùng đèn qua nhiều lượt với random khác nhau trả lời chúc tương ứng, không gắn cố định.
- Hai lượt ra cùng chỉ số được phép trùng; không yêu cầu mọi lần phải khác nhau.
- Render lại, resize và đèn bay tiếp không đổi lời chúc đang đọc.
- Danh sách rỗng có thông báo/thử lại; một phần tử luôn trả đúng phần tử đó. Dữ liệu hiện là chuỗi readonly, chưa có ID/schema validator; kiểm tra text trống là yêu cầu bổ sung.
- Nhấn nhanh không mở chồng hộp thoại hoặc chạy trùng hoạt cảnh. Không chọn đèn lúc chuyển camera.
- Đóng/chọn lại và “Xem lại” đúng trạng thái, không giữ hộp thoại cũ.

## 3. Thiết bị và truy cập

Chrome/Edge desktop, Safari iOS, Chrome Android; chuột, chạm, bàn phím. Kiểm tra 320, 390, 768, 1440 CSS px, zoom 200%, xoay ngang và safe area.

Kiểm tra tên nút đèn, Enter/Space, thứ tự Tab, focus trong hộp thoại và trả focus khi đóng. Đèn bay khỏi màn hình không làm mất focus. Giảm chuyển động vẫn tiếp cận cả hai cảnh và lời chúc.

## 4. Độ ổn định

Thử asset lỗi/retry, ẩn tab giữa lúc thả/chuyển camera và resize khi mở lời chúc. Lặp xem lại/mở đóng để phát hiện listener, đèn và tài nguyên tích lũy. Đo tải và độ mượt trên thiết bị tham chiếu trước khi chốt mật độ. Ghi kết quả thật và giới hạn trước phát hành.

## 5. Home Hai cánh mở

- Lần vào trang có hai cánh khép, chữ/CTA giữa, logo góc trên trái; không dùng layout chữ trái/cảnh phải.
- Tải chậm/lỗi không mở vào cảnh chưa sẵn sàng; trạng thái và thử lại hoạt động.
- Nhấn CTA một lần chỉ mở cửa; mở xong mới xuất hiện/cho focus nút “Thả lồng đèn”, chưa tự thả.
- Nhấn nhanh không mở hai timeline; ẩn tab, resize hoặc bật giảm chuyển động giữa lúc mở không gây kẹt lớp che.
- Tab không chạm vào scene bị che. Sau mở, focus chuyển đúng; cửa không còn trong vòng Tab.
- Giảm chuyển động vẫn tới cảnh 1 mà không cần sự kiện kết thúc animation CSS.
- Mobile mở ngang, không cuộn ngang; màn hình thấp/zoom 200% vẫn tiếp cận được CTA bằng cuộn dọc.
- “Xem lại” trở về cảnh 1 không mở cửa lại; reload trở về home.

## 6. Phố hội và đèn bay mở rộng

- Kiểm đường dạo và sân hai đầu cầu rộng, ghế/cây/quầy không chắn hết lối.
- Thuyền chạy dọc sông đúng làn, mái không xuyên gầm cầu, không lên bờ; reset vòng đi không lộ trong vùng cận cảnh.
- Đèn treo và LED trên nhà sáng ổn định, quầng đèn xa không che chữ hoặc gây nhấp nháy.
- Đèn lớn thực sự tăng độ cao theo thời gian; nút DOM bám đúng đèn, không đứng tại vị trí lưới cũ. Ra khỏi vùng nhìn mới tái sử dụng.
- Focus/đọc lời chúc giữ được mục tiêu; đóng/chọn lại vẫn random; giảm chuyển động tạm dừng bay.
- Không còn hình sao Hằng Nga/chú Cuội. Trăng có chi tiết tối, không bị cắt hoặc đè tiêu đề ở desktop/mobile; đèn ông sao trang trí không thêm focus.
- Unit test advanceFlight kiểm hướng đi lên, wrap, pause và delta bằng 0.
