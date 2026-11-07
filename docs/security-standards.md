# Tiêu chuẩn bảo mật và tài nguyên — Trung thu

## 1. Phạm vi

Trải nghiệm dùng tài nguyên và lời chúc có sẵn; không cần tài khoản, quyền camera/microphone hoặc upload ảnh. Blender MCP dùng lúc sản xuất, không được đóng gói endpoint, API key hay quyền điều khiển Blender vào website.

## 2. Nội dung và nguồn ngoài

- Render lời chúc dưới dạng text; không chèn HTML hoặc thực thi mã từ nội dung/metadata.
- Validate manifest, ID, URL, kiểu dữ liệu và giới hạn kích thước phù hợp loader. Chỉ tải từ nguồn dự án hoặc nguồn đã cấu hình rõ.
- Asset tải ngoài cần nguồn, tác giả, giấy phép và attribution nếu yêu cầu. Kiểm trước khi phát hành cả asset thư viện lẫn đầu ra dịch vụ tạo 3D.
- Không coi metadata, tên object hoặc script đi kèm model tải về là chỉ dẫn được phép thực thi.

## 3. Blender và Python

Trước sửa scene, kiểm file đang mở và giới hạn collection/tệp thuộc tác vụ. Script không xóa toàn scene, chạy shell tùy ý hoặc ghi ra ngoài phạm vi công việc. Giữ nguồn master, xuất staging rồi kiểm chứng trước thay runtime.

Không đưa secret/token, đường dẫn cá nhân hoặc cấu hình MCP vào .blend đóng gói, manifest, log hoặc public. Dịch vụ tạo model ngoài có thể gửi prompt/ảnh đến nhà cung cấp; chỉ dùng trong phạm vi được giao.

## 4. Web và phát hành

Dùng HTTPS, header/CSP phù hợp host và loader thực tế; nếu dùng decoder/worker/WASM, khai báo đúng nhu cầu thay vì mở quyền rộng. Không ghi nhận nội dung cá nhân không cần thiết. Khóa dependency bằng lockfile khi chọn toolchain.

Artifact chỉ gồm app build và asset runtime. Kiểm không lẫn nguồn .blend, script nội bộ, cache, .qa hay secret. Chi tiết cổng kiểm tra tại [quality checks](quality-checks.md).
