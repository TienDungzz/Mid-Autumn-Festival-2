# Đêm Trung thu

Dự án trải nghiệm Trung thu tương tác với hai cảnh nối tiếp, lấy bối cảnh phố cổ phong cách Trung Hoa bên dòng sông.

## Trải nghiệm

1. **Thả lồng đèn trên cầu:** chàng trai và cô gái đứng trên cây cầu bắc qua sông, cùng thả một chiếc lồng đèn lên trời. Hai bờ là phố cổ tấp nập với ánh đèn lễ hội phản chiếu trên mặt nước.
2. **Bầu trời lời chúc:** camera lùi ra, thu nhỏ cảnh đầu rồi hướng lên bầu trời đầy lồng đèn bay. Người xem nhấn vào đèn để nhận một lời chúc ngẫu nhiên từ danh sách có sẵn.

Mỗi lượt chọn đèn lấy ngẫu nhiên lại; lời chúc có thể trùng giữa các lượt.

## Trạng thái dự án

Dự án hiện có tài liệu thiết kế và tài nguyên nghệ thuật. Chưa có ứng dụng web, cấu hình build hoặc lệnh chạy được xác nhận; stack sẽ được chốt khi triển khai.

Blender MCP có thể được sử dụng để dựng mô hình, chỉnh vật liệu và tạo animation. Website sẽ sử dụng các tài nguyên đã xuất, không cần kết nối Blender khi chạy.

## Cấu trúc hiện tại

```text
Mid-Autumn-Festival-2/
├── README.md       # Giới thiệu dự án
├── .gitignore
├── docs/           # Yêu cầu, thiết kế và tiêu chuẩn triển khai
└── art/            # Tài nguyên nghệ thuật và nguồn Blender
```

Cấu trúc ứng dụng dự kiến được mô tả trong [cấu trúc thư mục](docs/folder-structure.md).

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

Các tài liệu photobooth cũ chưa chuyển đổi được đánh dấu riêng trong mục lục docs; không dùng chúng làm phạm vi cho trải nghiệm Trung thu hiện hành.
