# Nguyệt Ước · Moonlit Wishes

Trải nghiệm Trung thu tương tác với phố cổ bên sông, đèn trời và những lời chúc dành riêng cho người xem.

An interactive Mid-Autumn Festival experience featuring a riverside old town, floating lanterns and personal wishes.

[Tiếng Việt](#tiếng-việt) · [English](#english)

## Tiếng Việt

### Trải nghiệm

- **Hai cánh mở:** bước qua hai cánh cửa cổ khi khung cảnh đã tải xong.
- **Đêm hội bên sông:** đôi nhân vật đối mặt trên cầu, cùng nâng và thả lồng đèn; hai bờ có phố cổ phong cách Trung Hoa, thuyền, đám đông và đèn trang trí.
- **Bầu trời lời chúc:** camera lùi và hướng lên trời. Chọn một đèn lớn đang bay để nhận lời chúc ngẫu nhiên; đóng hộp thoại để đèn tiếp tục bay. Lời chúc có thể trùng giữa các lượt.
- **Điều khiển:** VI/EN qua custom dropdown, bật/tắt âm thanh nền tổng hợp và quay lại. Âm thanh mặc định tắt; chuyển động giảm theo thiết lập của thiết bị.
- **Trang trí Trung thu:** logo thỏ/trăng, mặt trăng có chi tiết bề mặt, sao nền và đèn ông sao năm cánh.

### Công nghệ và trạng thái

TypeScript strict, Vite và Three.js; UI DOM/CSS, không dùng React hoặc backend. Mô hình nhân vật tải từ GLB. Blender MCP chỉ phục vụ sản xuất tài nguyên, không cần kết nối khi chạy website.

Đã có bản local và bộ kiểm tra tự động. Chưa triển khai hosting hoặc nghiệm thu phát hành. Vẫn cần xử lý camera khi resize, vòng đời bfcache/cache texture, tối ưu bundle/GLB và kiểm tra thiết bị thật. Xem [báo cáo kiểm chứng](docs/verification-report.md) để biết bằng chứng, cảnh báo dependency và giới hạn hiện tại.

### Cài đặt và chạy

Khuyến nghị Node.js 22.13+ trong nhánh 22, hoặc Node.js 24+. Cần trình duyệt hỗ trợ WebGL. Tại thư mục gốc:

```sh
npm ci
npm run dev
```

Mở **http://127.0.0.1:5177/**. Dev server dùng strictPort; nếu cổng bận, lệnh sẽ báo lỗi. Trong PowerShell, có thể thay npm bằng npm.cmd khi npm.ps1 bị execution policy chặn.

### Kiểm tra và build

| Lệnh                                    | Mục đích                                                 |
| --------------------------------------- | -------------------------------------------------------- |
| npm run check                           | Typecheck → ESLint → Stylelint → Prettier → test → build |
| npm run typecheck                       | Kiểm tra TypeScript                                      |
| npm run lint / npm run lint:css         | Kiểm tra TS/JS và CSS                                    |
| npm run format:check                    | Kiểm tra định dạng                                       |
| npm test                                | Chạy unit test                                           |
| npm run build                           | Tạo bản production trong dist/                           |
| npm run preview                         | Xem bản build local, không phải server production        |
| npm run lint:fix / npm run lint:css:fix | Sửa lỗi lint có thể tự động sửa                          |
| npm run format                          | Định dạng mã và docs trong phạm vi cấu hình              |

### Cấu trúc và tài nguyên

```text
src/       UI, state machine, nội dung, logic lời chúc và engine 3D
public/    GLB và branding được phục vụ lên web
tests/     Unit tests
scripts/   Công cụ chuẩn bị/xuất nhân vật Blender
art/       Master Blender, texture và logo nguồn
docs/      Đặc tả, tiêu chuẩn và báo cáo kiểm chứng
```

Hai master là art/characters/mid-autumn-male-source.blend và mid-autumn-female-source.blend. Script scripts/blender/prepare_characters.py xuất GLB vào public/models/characters và bản Blender trung gian vào .qa/characters. Nguồn Blender cần để biên tập/tái tạo, không phải tài nguyên trình duyệt tải. Chưa chạy lại export sau lần đổi tên/đổi thư mục staging; xem [README nhân vật](art/characters/README.md).

Chỉ deploy nội dung **dist/**. Không upload art, scripts, .qa, cache hoặc node_modules. Asset hiện dùng URL từ gốc domain; deploy dưới subpath cần điều chỉnh đường dẫn. Chưa có giấy phép chung được công bố cho toàn dự án; hồ sơ nguồn/license asset cần hoàn thiện trước phát hành.

### Tài liệu

README này là điểm bắt đầu; [docs/README.md](docs/README.md) là mục lục chuyên sâu. Docs hiện chủ yếu bằng tiếng Việt.

- [Yêu cầu sản phẩm](docs/product-requirements.md) · [Bối cảnh](docs/scene-design.md) · [UI/UX](docs/ui-ux-spec.md)
- [Thiết kế kỹ thuật](docs/technical-design.md) · [Cấu trúc thư mục](docs/folder-structure.md)
- [Quy chuẩn code](docs/coding-standards.md) · [Bảo mật](docs/security-standards.md) · [Hiệu năng](docs/performance-standards.md)
- [Blender](docs/blender-workflow.md) · [Build/deploy](docs/deployment-guide.md) · [Việc còn lại](docs/implementation-plan.md)

## English

### Experience

- **Opening doors:** enter through two traditional doors once the scene is ready.
- **Riverside festival:** two characters face each other on a bridge and raise a shared lantern before releasing it. Chinese-inspired streets, boats, crowds and festive lighting line the river.
- **Sky of wishes:** the camera pulls back and tilts upward. Select a large rising lantern to reveal a random wish; closing the dialog lets it fly on. Wishes may repeat between selections.
- **Controls:** a custom VI/EN dropdown, optional synthesized ambience and back navigation. Audio starts muted; reduced motion follows the device preference.
- **Mid-Autumn details:** moon-rabbit branding, a textured moon, background stars and a Vietnamese five-point star lantern.

### Technology and status

Built with strict TypeScript, Vite and Three.js, using DOM/CSS for the interface. There is no React or backend. Characters load from GLB files. Blender MCP supports asset production only and is not required to run the website.

A local prototype and automated checks are available. Hosting and release acceptance are pending. Remaining work includes camera resizing, bfcache and texture-cache lifecycle handling, bundle/GLB optimization and testing on real devices. The [verification report](docs/verification-report.md) records evidence, dependency warnings and current limitations.

### Install and run

Use Node.js 22.13+ within the 22.x line, or Node.js 24+. A WebGL-capable browser is required. From the repository root:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5177/**. The dev server uses strictPort and fails if the port is occupied. In PowerShell, use npm.cmd if the execution policy blocks npm.ps1.

### Checks and build

| Command                                 | Purpose                                                     |
| --------------------------------------- | ----------------------------------------------------------- |
| npm run check                           | Typecheck → ESLint → Stylelint → Prettier → tests → build   |
| npm run typecheck                       | Check TypeScript                                            |
| npm run lint / npm run lint:css         | Lint TS/JS and CSS                                          |
| npm run format:check                    | Check formatting                                            |
| npm test                                | Run unit tests                                              |
| npm run build                           | Produce the production build in dist/                       |
| npm run preview                         | Preview the build locally; not a production server          |
| npm run lint:fix / npm run lint:css:fix | Apply available lint fixes                                  |
| npm run format                          | Format source and documentation within the configured scope |

### Structure and assets

```text
src/       UI, state machine, content, wish logic and 3D engine
public/    Runtime GLB models and branding
tests/     Unit tests
scripts/   Blender character preparation/export tooling
art/       Blender masters, source textures and logo
docs/      Specifications, standards and verification reports
```

Character masters are art/characters/mid-autumn-male-source.blend and mid-autumn-female-source.blend. scripts/blender/prepare_characters.py exports runtime GLB files to public/models/characters and intermediate Blender files to .qa/characters. Source assets support editing and regeneration; browsers do not download them. Export has not been rerun since the source renaming and staging-path changes; see the [character README](art/characters/README.md).

Deploy only the contents of **dist/**. Keep art, scripts, .qa, caches and node_modules out of the deployment. Asset URLs currently assume the domain root; subpath hosting requires path changes. No project-wide license has been published; asset provenance and licensing records must be completed before release.

### Documentation

This README is the starting point; [docs/README.md](docs/README.md) indexes the detailed documentation, which is currently mostly in Vietnamese.

- [Product requirements](docs/product-requirements.md) · [Scene design](docs/scene-design.md) · [UI/UX](docs/ui-ux-spec.md)
- [Technical design](docs/technical-design.md) · [Repository structure](docs/folder-structure.md)
- [Code standards](docs/coding-standards.md) · [Security](docs/security-standards.md) · [Performance](docs/performance-standards.md)
- [Blender workflow](docs/blender-workflow.md) · [Build/deployment](docs/deployment-guide.md) · [Remaining work](docs/implementation-plan.md)
