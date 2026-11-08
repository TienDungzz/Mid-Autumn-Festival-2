# Nguồn nhân vật Trung thu

## File được giữ

- mid-autumn-male-source.blend và mid-autumn-female-source.blend là đầu vào của scripts/blender/prepare_characters.py, không phải asset runtime dư thừa. Hậu tố source phân biệt master đầu vào với bản đã chỉnh trang phục/animation trong .qa và GLB runtime trong public.
- textures/ chứa atlas tóc của nguồn Blender. Giữ cùng nguồn để chỉnh sửa/tái xuất; chưa xác minh toàn bộ texture đã được pack trong master.
- Không có các script build_male.py, pack-male.mjs hoặc finalize-female.mjs của dự án cũ; các hướng dẫn đó đã được bỏ.

## Tạo lại nhân vật

Chạy scripts/blender/prepare_characters.py trong Blender với __file__ hợp lệ, hoặc cung cấp PROJECT_ROOT là thư mục dự án. Script đọc hai master, sửa trang phục/clip và xuất:

- public/models/characters/festival-male.glb
- public/models/characters/festival-female.glb
- .qa/characters/festival-male.blend và festival-female.blend: bản trung gian, được gitignore, có thể tái tạo.

Không chạy script trên scene biên tập chưa lưu. Giữ nguyên master; kiểm rig, trang phục và clip trên runtime sau mỗi lần xuất. Website dùng GLB, không dùng trực tiếp .blend hoặc PNG trong art.

## Nguồn và quyền sử dụng

Ghi chú kế thừa ghi nền nhân vật/rig Sam CC0. Chưa có hồ sơ nguồn/license độc lập được xác minh trong repository; cần bổ sung trước phát hành, không coi ghi chú này là chứng nhận quyền sử dụng đầy đủ.
