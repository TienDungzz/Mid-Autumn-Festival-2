# Đa ngôn ngữ — Trung thu

Dự án hiện hỗ trợ VI/EN bằng src/content/translations.ts. Nhãn tiếng Việt gốc trong src/main.ts và lời chúc trong src/content/wishes.ts. localizePage dịch text và các thuộc tính truy cập; MutationObserver xử lý nhãn đổi theo trạng thái mà không dựng lại cảnh hoặc chọn lại lời chúc.

Custom dropdown ở góc trên phải hỗ trợ click, ArrowUp/ArrowDown, Home/End và Escape. Locale lưu ở khóa nguyet-uoc.locale trong localStorage; nếu storage bị chặn, lựa chọn chỉ tồn tại trong phiên. Mặc định tiếng Việt; chưa tự chọn theo ngôn ngữ trình duyệt.

Các nút có chiều rộng dự phòng VI/EN để giảm dịch chuyển bố cục. Kiểm bằng npm.cmd test và kiểm trực quan cả hai ngôn ngữ, nội dung lời chúc, aria-label và thông báo tải/lỗi.

Không dùng cấu hình photobooth.preferences.v1 hoặc chế độ theme sáng/tối của dự án trước. Phong cảnh luôn là đêm Trung thu.
