# Định hướng phố cổ từ ảnh tham chiếu

Hai ảnh người dùng cung cấp là tham chiếu về bố cục, hình khối và ánh sáng; không dùng trực tiếp làm texture hoặc nền website.

## Những đặc điểm cần giữ

- Dòng sông dẫn mắt qua nhiều lớp kiến trúc, có điểm nhấn ở xa thay vì kết thúc đột ngột.
- Nhà gỗ hai bên có mái cong vươn ra, tầng mái chồng, cửa sổ và ban công nhiều nhịp.
- Nền đêm xanh sâu, khối nhà tối, đèn lồng và ánh sáng trong nhà vàng cam nổi bật.
- Tháp hoặc lầu nhiều tầng làm điểm nhận diện; núi xa và sương tạo chiều sâu.
- Mặt nước có những vệt sáng đứt đoạn kéo dài; thuyền tạo chuyển động chậm, đường phố vẫn có khoảng trống.

Ưu tiên không khí đêm của ảnh thứ hai và các hình khối lầu/cổng của ảnh thứ nhất. Hai nhân vật trên cầu vẫn là chủ thể; tránh để kiến trúc hoặc hiệu ứng che hoạt cảnh.

## Mức chi tiết theo khoảng cách

| Lớp   | Cách thể hiện                                                       |
| ----- | ------------------------------------------------------------------- |
| Gần   | Cầu, đôi nhân vật, đèn chính, bờ kè và vài mặt tiền có hình khối rõ |
| Trung | Module nhà tái sử dụng, biến thể mái/chiều cao, ô cửa và đèn treo   |
| Xa    | Tháp đơn giản, cửa sáng dùng instancing, núi dạng silhouette        |

Chi tiết đắt như chạm khắc, từng viên ngói 3D, lá cây dày và phản chiếu toàn cảnh không cần sao chép. Có thể biểu đạt bằng hình dáng mái, màu, đường nét và ánh sáng.

## Quy tắc hiệu năng

- Gộp các nét ngói thành một buffer LineSegments cho mỗi mái.
- Dùng InstancedMesh cho các khối đá bờ kè và cửa sổ lặp của tháp.
- Dùng vật liệu emissive và sprite quầng sáng thay nhiều đèn động, không bật shadow riêng cho từng đèn lồng.
- Núi xa dùng mặt phẳng hình khối đơn giản; nguồn ảnh tham chiếu không trở thành ảnh nền nặng.
- Đo frame time, draw calls, texture memory và thời gian tải trước khi tăng chi tiết. Build thành công không chứng minh cảnh đã nhẹ hoặc đạt FPS mục tiêu.

## Trạng thái triển khai

Đèn phố dùng bốn kiểu: tròn, dáng dài, lục giác và hộp gỗ. Mỗi mặt tiền có một cấu hình ổn định về màu, số đèn cửa, dây đèn tầng trên và LED; hai bờ không lặp đối xứng cùng mẫu. Đèn cửa nằm cạnh cột, tránh biển tiệm và mái quầy. Dây đèn tầng trên có móc bám dây, đặt phía trước lan can; một số nhà chỉ dùng đèn cửa/LED để tạo khoảng nghỉ. Ven sông dùng đèn hộp thưa hơn, có tay đỡ và chừa vùng sân đầu cầu; cầu dùng đèn lục giác cùng bộ.

Đã bổ sung dáng mái cong, lưới cửa, bờ kè, tháp/cổng ở xa, núi nhiều lớp và cân chỉnh ánh sáng trong mã nguồn. Chưa kiểm tra trực quan bản cập nhật này hoặc đo hiệu năng trên thiết bị thật. Tiếp tục tinh chỉnh theo hình ảnh runtime, không xem bản dựng là đã khớp hai ảnh tham chiếu.
