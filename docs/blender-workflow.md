# Quy trình dựng mô hình bằng Blender MCP

## 1. Vai trò và trạng thái

Dự án có thể dùng kết nối Blender MCP để kiểm tra scene, chạy Python bpy, dựng/chỉnh mô hình, tạo vật liệu, rig/animation và xuất GLB. MCP là công cụ trong quá trình sản xuất tài nguyên, không phải dependency của website khi chạy trên máy người xem.

Repository đã có script scripts/blender/prepare_characters.py và hai GLB nhân vật runtime. Script đọc art/characters/mid-autumn-male-source.blend và mid-autumn-female-source.blend; ghi GLB trực tiếp vào public/models/characters và Blender trung gian vào .qa/characters. Chưa chạy lại script sau khi đổi tên nguồn/đường dẫn staging. Khả năng kết nối MCP phải kiểm tra ở mỗi phiên; không suy ra trạng thái live Blender từ tài liệu.

## 2. Bắt đầu phiên dựng

1. Gọi get_addon_status để kiểm tra kết nối, phiên bản và khả năng hiện có.
2. Gọi get_scene_info để đọc file, object, collection, rig, animation, camera và đơn vị; không giả định scene trống.
3. Xác định asset/collection và đường dẫn đích trong workspace; lưu phiên bản nguồn trước thay đổi lớn.
4. Dùng execute_blender_code cho tác vụ bpy; dùng look để kiểm tra hình ảnh và các khung animation sau thay đổi.
5. Nếu kết nối chưa sẵn sàng, ghi rõ bước chưa thực hiện. Có thể chuẩn bị script/đặc tả trước, không báo đã kiểm chứng trong Blender.

Không tự dựng mô hình chỉ vì cập nhật tài liệu. Khi được giao tác vụ dựng, tiếp tục trong phạm vi asset đã yêu cầu.

## 3. Phân chia mô hình và đặt tên mục tiêu

Bảng dưới là quy ước cho asset dựng mới, không phải collection/file đã có. Phố, cầu, thuyền và đèn hiện được dựng bằng Three.js trong src/engine; chỉ hai nhân vật tải từ GLB. Script nhân vật hiện dùng collection INSPECT_Male/INSPECT_Female và clip Lantern_Release_male/female. Loader chọn clip có tên chứa Lantern_Release, fallback clip đầu tiên.

| Collection nguồn       | Nội dung                              | Đích xuất                  |
| ---------------------- | ------------------------------------- | -------------------------- |
| ENV_RiverTown          | Cầu, bờ sông, module phố cổ Trung Hoa | public/models/environment/ |
| CHAR_Male, CHAR_Female | Nhân vật và rig tương ứng             | public/models/characters/  |
| PROP_SkyLantern        | Đèn trời với điểm cầm và tâm bay      | public/models/props/       |
| PROP_StreetDecor       | Đèn treo, biển tiệm, đạo cụ phố       | public/models/props/       |
| REF_Cameras            | Camera/blockout tham khảo             | Chỉ xuất khi runtime cần   |

Tên object duy nhất, có ý nghĩa như bridge_main, lantern_body, lantern_grip. Cố định hợp đồng node/clip trước khi code runtime tham chiếu tên. Dùng module kiến trúc tái sử dụng thay vì xuất nguyên dãy phố trùng mesh.

## 4. Đơn vị, rig và vật liệu

- Nguồn dùng mét, unit scale 1. Ghi quy ước trục Blender và để exporter glTF chuyển đổi; kiểm tra hướng/scale trong runtime, không đổi trục hai lần.
- Kiểm bounding box, origin/pivot, normal, UV, transparency và vật liệu PBR. Vật liệu procedural cần bake hoặc chuyển sang dạng glTF hỗ trợ.
- Đèn có điểm cầm và pivot rõ. Tách đạo cụ khỏi rig ở runtime tại mốc buông, giữ world transform.
- Giữ master nam/nữ hiện có riêng biệt; không ghi đè nhân vật này bằng nhân vật kia. Không apply transform/reset rest pose tùy tiện trên mesh đã skin.
- Định nghĩa clip cần thiết cho storyboard: đứng chờ, cùng nâng/thả đèn; tên clip cụ thể được ghi trong manifest sau khi kiểm chứng. Clip idle/walk cũ không tự coi là đủ cho thả đèn.
- Kiểm animation tại trước nâng, giữ đèn, ngay lúc buông và sau buông. Bỏ đạo cụ hoa khỏi export dành cho kịch bản này.
- Màu đặt trên shader node input; tìm node theo type, kiểm API/enum phiên bản hiện hành thay vì hardcode tên hiển thị.

## 5. Lựa chọn nguồn asset

Ưu tiên dựng procedural bằng bpy cho cầu, module nhà và lồng đèn; tái sử dụng nhân vật hiện có sau kiểm rig. Có thể dùng search_assets/import_asset khi cần và ghi nguồn/giấy phép.

generate_3d là lựa chọn bổ sung cho từng mô hình, không dùng một yêu cầu để tạo cả cảnh. Dịch vụ có thể tốn credit; chỉ dùng khi phạm vi tác vụ cho phép sử dụng dịch vụ đó. Kiểm scale, topology, UV, rig và quyền sử dụng của đầu ra, không đưa thẳng lên web mà chưa QA.

## 6. Quy trình xuất và kiểm chứng mục tiêu

Các bước staging/manifest dưới đây là chuẩn mục tiêu. Script hiện xuất thẳng GLB vào public, chưa tự động chặn thay thế bằng cổng QA; assets manifest chưa tồn tại.

1. Lưu .blend và texture nguồn trong art theo nhóm. Script bpy tái sử dụng nằm trong scripts/blender.
2. Chọn đúng collection/object và animation cần xuất; không kèm camera, đèn hoặc đối tượng ẩn ngoài hợp đồng.
3. Xuất GLB thử vào .qa, kiểm lại bounding box, node, material, texture và clip; mở bằng loader runtime dự kiến.
4. Tối ưu mesh/texture, tái sử dụng vật liệu; chỉ bật nén Meshopt/Draco/KTX2 nếu loader có decoder tương ứng.
5. Kiểm lại sau tối ưu: tóc/alpha, màu, normal, skin, animation, bàn tay và vị trí đèn.
6. Đưa bản đạt QA vào public; cập nhật manifest và thông tin giấy phép. Không thay master bằng file nén runtime.
7. Kiểm toàn hành trình trên mobile và desktop, lưu preview các góc/khung chính trong .qa. Bản render Blender không thay thế QA trên web.

Kết quả bàn giao nêu file nguồn, script, GLB, clip/node, nguồn asset và những phần đã/chưa kiểm chứng. Không ghi lệnh pack/export là đã tồn tại khi chưa có script thật.
