# Nguồn nhân vật Trung thu

## Master hiện hành

- mid-autumn-male-source.blend: master nam sạch, khoảng 6,65 MB; 18 object, 16 mesh, một rig và một scene.
- mid-autumn-female-source.blend: master nữ sạch, khoảng 7,19 MB; 19 object, 17 mesh, một rig và một scene.
- Hai file không chứa hoạt ảnh cũ. Pipeline tạo clip thả đèn mới khi xuất.
- Texture phụ thuộc đã được pack vào master; textures/ giữ atlas để biên tập. Một số metadata đường dẫn ảnh cũ còn tồn tại; exporter dùng dữ liệu packed khi không tìm thấy file ngoài.

## Xuất nhân vật

Chạy scripts/blender/prepare_characters.py trong Blender với __file__ hợp lệ, hoặc cung cấp PROJECT_ROOT là thư mục dự án. Script đọc hai master, chỉnh trang phục/clip và xuất:

- public/models/characters/festival-male.glb
- public/models/characters/festival-female.glb
- .qa/characters/festival-male.blend và festival-female.blend: đầu ra trung gian, được gitignore, có thể tạo lại.

Có thể truyền EXPORT_ROOT qua runpy để xuất GLB thử vào .qa thay vì ghi public. Không chạy script trên scene biên tập chưa lưu. Website dùng GLB, không tải .blend hay ảnh trong art.

## Kiểm chứng

Ngày 09/11/2026 đã mở lại hai master sạch và xuất thử bằng Blender 4.5.15 LTS. Dữ liệu geometry/animation accessor, ảnh nhúng, số khớp skin và kích thước GLB khớp runtime hiện hành; không thay GLB public. Chưa QA trực quan mọi khung hình trong lần dọn nguồn.

## Nguồn và quyền sử dụng

Ghi chú kế thừa ghi nền nhân vật/rig Sam CC0. Hồ sơ nguồn/license độc lập chưa được xác minh đầy đủ; cần hoàn thiện trước phát hành.
