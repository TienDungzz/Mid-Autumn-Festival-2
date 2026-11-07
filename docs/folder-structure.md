# Cấu trúc thư mục — Trung thu

## 1. Trạng thái và cây mục tiêu

Workspace hiện có docs/ và art/. Cây sau là định hướng khi khởi tạo ứng dụng, không xác nhận các file/runtime/script đã tồn tại. Chỉ tạo thư mục khi có nội dung thực.

Ví dụ dùng TypeScript/TSX nếu chọn React; ranh giới module vẫn áp dụng khi dùng UI framework khác.

~~~text
Mid-Autumn-Festival-2/
├── docs/
│   ├── README.md
│   ├── scene-design.md
│   ├── coding-standards.md
│   ├── folder-structure.md
│   └── blender-workflow.md
├── art/                         # Nguồn biên tập, không phục vụ trực tiếp lên web
│   ├── characters/              # Giữ các master hiện có
│   ├── environment/             # Cầu, bờ sông, module phố cổ
│   ├── props/                   # Lồng đèn, đèn treo, đạo cụ
│   ├── scenes/                  # Bố cục tổng thể và camera tham khảo
│   └── references/              # Tham chiếu và thông tin quyền sử dụng
├── scripts/
│   ├── blender/                 # Python: build, validate, export
│   └── assets/                  # Kiểm tra GLB/texture/manifest, tối ưu sau export
├── public/
│   ├── models/
│   │   ├── characters/
│   │   ├── environment/
│   │   └── props/
│   ├── textures/
│   └── assets-manifest.json
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   └── model/               # Story state machine, phối hợp UI và engine
│   ├── content/
│   │   ├── wishes.vi.ts
│   │   └── ui.vi.ts
│   ├── domain/
│   │   ├── story/               # State/event và quy tắc chuyển cảnh thuần
│   │   └── wishes/              # Type, validation, pick-wish.ts
│   ├── features/
│   │   ├── story-controls/
│   │   ├── lantern-selection/   # Liên kết sự kiện chọn đèn với UI truy cập
│   │   └── wish-dialog/
│   ├── engine/
│   │   ├── runtime/             # Render loop, resize, pause/resume, dispose
│   │   ├── assets/              # Loader, cache và quyền sở hữu tài nguyên
│   │   ├── scenes/              # Lắp cảnh cầu/phố và trạng thái bầu trời
│   │   ├── characters/          # Rig, mixer, pose và hiệu chỉnh tay
│   │   ├── lanterns/            # Spawn, bay, pooling, vùng chọn
│   │   ├── camera/              # Camera và timeline chuyển cảnh
│   │   └── effects/             # Nước, ánh sáng và hiệu ứng
│   └── shared/
│       ├── ui/                  # Nút, loading, dialog cơ bản
│       ├── lib/
│       ├── config/
│       └── styles/              # Tokens, reset, global, utilities
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
└── .qa/                         # Preview, render QA, GLB staging; không deploy
~~~

## 2. Chiều phụ thuộc

| Tầng | Được phụ thuộc | Trách nhiệm |
| --- | --- | --- |
| app | features, engine, domain, content, shared | Điều phối toàn trải nghiệm |
| features | domain, shared | UI/hành vi sản phẩm; nhận adapter engine từ app |
| engine | domain, shared/lib, shared/config, thư viện đồ họa | Render và tài nguyên 3D, không import UI |
| content | Type từ domain | Lời chúc và nhãn tĩnh |
| domain | Module thuần trong domain | Không biết DOM, React, Blender hoặc WebGL |
| shared | shared và thư viện ngoài | Thành phần chung, không import tầng trên |

Không tầng nào import app. Các feature phối hợp qua app thay vì gọi store của nhau. Module công bố index.ts tối thiểu, không deep import hoặc phụ thuộc vòng.

## 3. Ranh giới cảnh và tài nguyên

Hai cảnh là hai giai đoạn của cùng không gian. Có thể dùng chung scene graph để giữ liên tục camera/đèn; không bắt buộc tải hai bản cầu/phố trùng nhau.

art chứa .blend và texture nguồn. public chỉ chứa tài nguyên đã xuất/tối ưu và được kiểm chứng trong runtime. .qa giữ bản xuất thử và ảnh so sánh; scripts không tự ghi đè master từ staging.

Manifest ghi ID, URL phiên bản, nguồn .blend, clip/node cần dùng, kích thước file và thông tin quyền sử dụng. Đường dẫn trong manifest tương đối dự án; không lưu đường dẫn máy cá nhân. Bản sao dự phòng và cache không thuộc artifact phát hành.

## 4. Test và thay đổi cấu trúc

Unit test cạnh module như pick-wish.test.ts. Integration kiểm tra phối hợp state/UI/engine; e2e kiểm tra hành trình hai cảnh. Không tạo module rỗng hoặc giữ tên frame-catalog, photo-library, capture-session từ photobooth.

Nguồn nhân vật hiện có được giữ tại art/characters; các đường dẫn scripts/public trong README cũ chỉ có giá trị sau kiểm chứng. Quy trình nguồn → staging → runtime tại [Blender MCP](blender-workflow.md).
