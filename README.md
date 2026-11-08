# Đêm Trung thu

Dự án trải nghiệm Trung thu tương tác với hai cảnh nối tiếp, lấy bối cảnh phố cổ phong cách Trung Hoa bên dòng sông.

## Trải nghiệm

1. **Thả lồng đèn trên cầu:** chàng trai và cô gái đứng trên cây cầu bắc qua sông, cùng thả một chiếc lồng đèn lên trời. Hai bờ là phố cổ tấp nập với ánh đèn lễ hội phản chiếu trên mặt nước.
2. **Bầu trời lời chúc:** camera lùi ra, thu nhỏ cảnh đầu rồi hướng lên bầu trời đầy lồng đèn bay. Người xem nhấn vào đèn để nhận một lời chúc ngẫu nhiên từ danh sách có sẵn.

Mỗi lượt chọn đèn lấy ngẫu nhiên lại; lời chúc có thể trùng giữa các lượt.

## Trạng thái dự án

Dự án đã có bản web local dùng TypeScript, Vite và Three.js, cùng mô hình nhân vật được chuyển đổi từ nguồn Blender có sẵn. Xem [kết quả kiểm tra và giới hạn hiện tại](docs/verification-report.md).

Blender MCP có thể được sử dụng để dựng mô hình, chỉnh vật liệu và tạo animation. Website sẽ sử dụng các tài nguyên đã xuất, không cần kết nối Blender khi chạy.

## Cấu trúc hiện tại

```text
Mid-Autumn-Festival-2/
├── README.md       # Giới thiệu dự án
├── .gitignore
├── docs/           # Yêu cầu, thiết kế và tiêu chuẩn triển khai
├── art/            # Nguồn Blender và hình ảnh
├── src/            # UI, state, domain và engine
├── public/         # GLB và branding runtime
├── scripts/        # Công cụ Blender
├── tests/          # Unit tests
└── package.json    # Lệnh dev/build/typecheck/test
```

Cấu trúc hiện hành và định hướng tách module được mô tả trong [cấu trúc thư mục](docs/folder-structure.md).

## Tài liệu

- [Mục lục tài liệu](docs/README.md)
- [Yêu cầu sản phẩm](docs/product-requirements.md)
- [Bối cảnh, storyboard và lời chúc mẫu](docs/scene-design.md)
- [Luồng trải nghiệm](docs/user-flows.md)
- [Đặc tả UI/UX](docs/ui-ux-spec.md)
- [Thiết kế kỹ thuật](docs/technical-design.md)
- [Quy chuẩn code](docs/coding-standards.md)
- [Quy trình Blender MCP](docs/blender-workflow.md)
- [Kế hoạch triển khai](docs/implementation-plan.md)
- [Chiến lược kiểm thử](docs/testing-strategy.md)

Các hướng dẫn ngôn ngữ và build/deploy đã cập nhật cho Trung thu; tài liệu frame/theme photobooth không còn áp dụng đã được bỏ.

## Layout home

Home sử dụng layout **Hai cánh mở**: tiêu đề và nút “Bước vào đêm trăng” nằm giữa hai cánh cửa cổ. Khi cảnh 1 đã sẵn sàng, nhấn nút để mở cửa, rồi chọn “Thả lồng đèn” để bắt đầu câu chuyện. Xem [đặc tả UI/UX](docs/ui-ux-spec.md).

## Chạy và kiểm tra

Khuyến nghị Node.js 22.13 trở lên trong nhánh 22, hoặc Node.js 24 trở lên để tương thích ESLint 10. Trong PowerShell có thể dùng npm.cmd để tránh lỗi execution policy của npm.ps1.

```sh
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd test
npm.cmd run check
```

Mở URL Local mà Vite in ra. Thư mục dist chứa bản build; public/models/characters chứa GLB runtime, art/characters giữ nguồn Blender. Hiện dự án chưa được đưa lên hosting.
