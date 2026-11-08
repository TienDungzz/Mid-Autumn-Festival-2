# Luồng trải nghiệm Trung thu

Điều khiển mới: góc trên phải có chọn VI/EN, bật/tắt âm thanh và nút quay lại (chỉ hiện trong cảnh). Từ bầu trời, quay lại về cầu; từ cầu, quay lại home và đóng hai cánh cửa. Khóa quay lại khi đang thả đèn/chuyển camera. Không còn nút xem lại ở dưới hoặc nút giảm chuyển động riêng. Âm thanh nền gợi tiếng nước mặc định tắt, chỉ phát khi người dùng bật. Đổi ngôn ngữ giữ nguyên cảnh và lời chúc hiện tại.

## 1. Luồng chính

1. Mở trang, hiển thị home “Hai cánh mở”: hai cánh cửa khép, tiêu đề và nút “Bước vào đêm trăng” ở giữa. Tải tài nguyên cảnh 1 phía sau; nếu chưa sẵn sàng, hiện trạng thái tải và chưa cho mở cửa. Khi sẵn sàng, nhấn nút để hai cánh tách sang hai bên, hé lộ cảnh sông và đôi nhân vật trên cầu. Kết thúc mở cửa, chuyển focus tới “Thả lồng đèn”; hoạt cảnh thả chưa tự bắt đầu.
2. Nhấn “Thả lồng đèn”; hai người cùng nâng và thả đèn. Khóa nút để không chạy hoạt cảnh trùng.
3. Đèn rời tay bay lên; camera lùi, thu nhỏ cảnh 1 và hướng lên trời. Tự chuyển sang cảnh 2.
4. Bầu trời nhiều đèn bay lên, hiện hướng dẫn chọn đèn.
5. Nhấn/chạm đèn hoặc chọn bằng bàn phím rồi Enter/Space. Chọn ngẫu nhiên một lời chúc và mở hộp thoại.
6. “Đóng” hoặc Escape trở về bầu trời. Chọn đèn bất kỳ để lấy lượt ngẫu nhiên tiếp theo, có thể trùng.
7. “Xem lại” đóng lời chúc và đặt lại đầu cảnh 1.

## 2. Khi đọc lời chúc

Chỉ mở một hộp thoại, giữ focus trong hộp thoại và khóa tương tác nền. Không tự đổi nội dung theo thời gian. Đóng trước khi chọn đèn khác; trả focus về đèn đã chọn nếu còn khả dụng, nếu không thì về điều khiển chọn đèn tiếp theo.

## 3. Gián đoạn

| Tình huống                  | Hành vi                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| Asset đang tải/lỗi          | Hiện trạng thái tải hoặc thử lại, không bắt đầu cảnh thiếu tài nguyên |
| Danh sách lời chúc rỗng/lỗi | Báo “Chưa thể tải lời chúc”, cho thử lại; không mở hộp thoại trống    |
| Chỉ có một lời chúc         | Luôn hiển thị lời chúc đó                                             |
| Ẩn tab                      | Tạm dừng; trở lại tiếp tục từ trạng thái giữ, không chạy dồn          |
| Giảm chuyển động            | Chuyển trạng thái nhẹ, vẫn tới được cảnh 2 và nhận lời chúc           |
| Resize/xoay màn hình        | Cập nhật bố cục và vùng nhấn, giữ cảnh và lời chúc đang mở            |

Xem [storyboard](scene-design.md) và [UI/UX](ui-ux-spec.md).
