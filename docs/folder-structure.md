# Cấu trúc thư mục hiện hành

Cập nhật 09/11/2026. Stack: TypeScript strict, Vite, Three.js, UI DOM/CSS. Dự án không dùng React hoặc backend.

```text
README.md                         # Giới thiệu và cách chạy
package.json / package-lock.json   # Lệnh và dependency
index.html / tsconfig.json         # Entry HTML và cấu hình TypeScript
eslint.config.js                  # Lint TS/JS
stylelint.config.js               # Lint CSS
.prettierrc.json / .prettierignore # Formatter và phạm vi bỏ qua
.editorconfig / .gitignore        # Quy ước editor và file không commit
docs/                             # Đặc tả, tiêu chuẩn, báo cáo
src/
  main.ts                         # DOM, sự kiện, locale, focus và điều phối
  app/story-state.ts              # State machine
  content/                        # wishes.ts, translations.ts
  domain/wishes/pick-wish.ts       # Random thuần
  engine/                         # Cảnh Three.js, nhân vật/IK, đèn, thuyền, trăng, âm thanh
  shared/styles/main.css          # CSS và token dùng chung
tests/                            # Sáu file unit test, 10 test case
scripts/blender/prepare_characters.py
art/
  characters/                     # mid-autumn-{male,female}-source.blend, textures, README
  branding/                       # Logo master và ghi chú nguồn
public/
  models/characters/              # festival-male.glb, festival-female.glb
  branding/                       # Logo, favicon PNG, star-lantern.svg
  favicon.ico
```

## File được tạo lại

- node_modules: tạo bằng npm.cmd ci; không commit.
- dist: tạo bằng npm.cmd run build; chỉ nội dung này là artifact deploy.
- .qa/characters/festival-*.blend: đầu ra trung gian của script Blender; không commit. Có thể chưa tồn tại sau khi dọn.
- .cache: cache công cụ, không phải tài nguyên web.

Hai file Blender nguồn là đầu vào script, không phải bản xuất thừa. Web chỉ tải GLB và branding trong public; không tải art hoặc scripts. Không có module constellations.ts hoặc hình sao Hằng Nga/chú Cuội.

## Chiều phụ thuộc

main.ts điều phối app, content, domain và engine. Engine không import UI/app; domain không phụ thuộc DOM hoặc Three.js. Các module engine trao đổi nội bộ qua named export. CSS hiện tập trung trong main.css.

## Cấu trúc chưa triển khai

Chưa tách features/home-entry, wish-dialog, story-controls hoặc CSS cạnh feature; chưa có assets-manifest.json, integration/e2e hoặc CI. Đây là việc cải tiến có thể thực hiện sau, không phải đường dẫn dùng được trong repository hiện tại. Xem coding-standards.md và verification-report.md.
