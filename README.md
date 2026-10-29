# ⚡ TechPulse - Nền Tảng Tổng Hợp Tin Tức & Bài Viết Công Nghệ Chuyên Sâu

> Một ứng dụng web hiện đại tổng hợp tin tức công nghệ từ các nguồn hàng đầu thế giới và Việt Nam, tích hợp **Chế độ đọc tinh gọn (Reader Mode)** không quảng cáo, bộ lọc thông minh và tối ưu hóa tốc độ với **Vercel Edge Caching**.

---

## 🌟 1. Các Chức Năng Nổi Bật

### 📡 Thu Thập & Tổng Hợp Tự Động (RSS / XML / Public APIs)
- Tự động lấy và phân loại tin tức từ các nguồn uy tín:
  - **Trí tuệ nhân tạo (AI & Machine Learning)**: MIT Technology Review, VentureBeat AI, Ars Technica.
  - **Phần cứng & Thiết bị (Hardware & Gadgets)**: The Verge, Tom's Hardware, Wccftech.
  - **Lập trình & Kỹ thuật (Programming & Dev)**: Hacker News (Y Combinator), DEV Community, GitHub Blog.
  - **An ninh mạng (Cybersecurity)**: The Hacker News, BleepingComputer.
  - **Khởi nghiệp & Thị trường (Startups & Trends)**: TechCrunch, Wired.
  - **Công nghệ Việt Nam**: VnExpress Số Hóa, Dân Trí Sức Mạnh Số, Tinh Tế.

### 📖 Chế Độ Đọc Tinh Gọn (Reader Mode)
- **Loại bỏ 100% quảng cáo, banner, pop-up, video tự chạy, sidebar và mã theo dõi phiền nhiễu**.
- Bóc tách nội dung chính, tiêu đề, ảnh minh họa chất lượng cao, tác giả và thời gian đọc ước tính.
- **Tùy biến trải nghiệm đọc**:
  - **4 Chế độ màu nền**: Sáng (Light), Cổ điển (Sepia - dịu mắt khi đọc lâu), Tối (Dark), Đen tuyệt đối (OLED Midnight).
  - **Cỡ chữ linh hoạt**: A- / A+ (Nhỏ, Vừa, Lớn, Rất lớn).
  - **Kiểu font chữ**: Hiện đại (Sans-serif), Báo in văn học (Serif), Lập trình (Monospace).
  - **Đọc to bài viết bằng giọng nói (AI Voice / Text-to-Speech)**: Hỗ trợ tiếng Việt và tiếng Anh có sẵn ngay trên trình duyệt Google Chrome.
  - **Thanh tiến trình đọc**: Hiển thị % tiến độ đọc thực tế khi cuộn trang.

### 🔍 Lọc & Tìm Kiếm Thông Minh
- **Lọc theo danh mục**: Xem riêng từng chuyên đề (AI, Phần cứng, Dev, Bảo mật, Thị trường, Tin Việt Nam).
- **Lọc theo nguồn báo cụ thể**: Chọn nguồn yêu thích (The Verge, TechCrunch, VnExpress...).
- **Tìm kiếm thời gian thực**: Tìm tức thì theo từ khóa trong tiêu đề, tóm tắt và tags.
- **Sắp xếp linh hoạt**: Mới nhất hoặc Bài viết đọc sâu (bài viết dài, phân tích chuyên đề).
- **Lưu bài viết yêu thích (Bookmarks)**: Lưu trữ trên trình duyệt (`localStorage`) để đọc lại sau mà không cần đăng ký tài khoản hay cài database phức tạp.

### ⚡ Không Cần Cơ Sở Dữ Liệu (Read-Only Edge Caching)
- Hoàn toàn không phụ thuộc Supabase hay database nặng nề.
- Tận dụng **Edge Caching của Vercel** (`s-maxage=300, stale-while-revalidate=600`): Dữ liệu được cache tại các máy chủ CDN gần người dùng nhất (như Singapore), tốc độ tải trang dưới 100ms.

---

## 🛠️ 2. Công Nghệ Sử Dụng

- **Frontend / Framework**: Next.js 14 (App Router), React 18, TypeScript.
- **Styling**: Tailwind CSS, Tailwind Typography (`@tailwindcss/typography`), Glassmorphism UI.
- **Icons**: Lucide React.
- **Data Parser**: `fast-xml-parser` & `cheerio` (Serverless / Edge Functions).
- **CI/CD**: GitHub Actions tự động kiểm tra tính hợp lệ khi có code mới.
- **Hosting / Deployment**: Vercel Edge Network.

---

## 🚀 3. Hướng Dẫn Triển Khai 100% Qua Trình Duyệt Google (Không Cần Cài Đặt Ứng Dụng Nào Vào Máy Tính)

Bạn không cần cài đặt Git, NodeJS hay bất kỳ phần mềm chuyên dụng nào vào máy tính. Toàn bộ quá trình triển khai đều có thể thực hiện thông qua trình duyệt Google Chrome:

### Bước 1: Tạo Repository Trên GitHub (Bằng Web)
1. Mở trình duyệt, truy cập [https://github.com](https://github.com) và đăng nhập (hoặc đăng ký miễn phí bằng tài khoản Google).
2. Nhấn vào dấu **`+`** ở góc trên bên phải màn hình -> Chọn **New repository**.
3. Đặt tên kho lưu trữ: `techpulse-news`.
4. Chọn chế độ **Public** (Công khai) -> Nhấn nút xanh **Create repository**.

### Bước 2: Tải Mã Nguồn Lên GitHub (Trực Tiếp Qua Trình Duyệt)
1. Trong trang repository vừa tạo, bạn sẽ thấy đường link: **"uploading an existing file"** (Tải file có sẵn lên).
2. Mở thư mục `c:\Users\Tuan\Downloads\technology news` trên máy tính.
3. Kéo thả toàn bộ các file và thư mục này vào khung tải lên của GitHub trên trình duyệt Google:
   - Thư mục `src/`
   - Thư mục `.github/`
   - Các file: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `vercel.json`, `README.md`, `.gitignore`, `.eslintrc.json`.
4. Nhấn nút **Commit changes**.

### Bước 3: Đăng Ký & Deploy Lên Vercel (1 Cú Click Chuột)
1. Mở tab mới trên Google Chrome, truy cập [https://vercel.com](https://vercel.com).
2. Nhấn **Sign Up** (Đăng ký) hoặc **Log In** -> Chọn **Continue with GitHub** (Đăng nhập liên kết với tài khoản GitHub ở Bước 1).
3. Sau khi vào trang tổng quan Vercel (Dashboard), nhấn nút **Add New...** -> Chọn **Project**.
4. Bạn sẽ thấy repository `techpulse-news` xuất hiện trong danh sách -> Nhấn nút **Import**.
5. Giữ nguyên toàn bộ cấu hình mặc định (Vercel tự động nhận diện Next.js) -> Nhấn nút **Deploy**!

### Bước 4: Hoàn Tất & Sử Dụng
- Trong vòng 60 giây, máy chủ Vercel sẽ tự động tải các thư viện, chạy kiểm tra và tạo cho bạn một website trực tiếp trên Internet với tên miền miễn phí dạng:
  👉 `https://techpulse-news.vercel.app` (hoặc tên tương tự)
- Kể từ đây, mỗi khi bạn cập nhật code trên GitHub:
  - **GitHub Actions** sẽ tự động chạy workflow kiểm tra tính hợp lệ (`.github/workflows/ci.yml`).
  - **Vercel** sẽ tự động cập nhật phiên bản mới nhất lên website mà bạn không phải làm thêm bất kỳ thao tác nào!

---

## 📂 4. Cấu Trúc Thư Mục Dự Án

```
technology-news/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions kiểm tra tính hợp lệ & build tự động
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── news/
│   │   │   │   └── route.ts       # API tổng hợp tin tức từ RSS/APIs + Edge Caching
│   │   │   ├── reader/
│   │   │   │   └── route.ts       # API bóc tách nội dung Reader Mode (loại bỏ ads)
│   │   │   └── sources/
│   │   │       └── route.ts       # API danh sách các nguồn báo
│   │   ├── globals.css            # Styles Tailwind, Dark Mode & Typography Reader
│   │   ├── layout.tsx             # Root layout & Metadata SEO
│   │   └── page.tsx               # Giao diện chính (Hero, Filter, Grid, Reader Modal)
│   ├── components/
│   │   ├── ArticleCard.tsx        # Thẻ bài viết (ảnh, badge, thời gian đọc, nút reader)
│   │   ├── BookmarksDrawer.tsx    # Ngăn xem các bài viết đã lưu
│   │   ├── CategoryFilter.tsx     # Bộ lọc danh mục con (AI, Phần cứng, Lập trình...)
│   │   ├── Footer.tsx             # Chân trang & trạng thái Edge Cache
│   │   ├── Header.tsx             # Thanh điều hướng, tìm kiếm, đổi giao diện sáng/tối
│   │   ├── ReaderModal.tsx        # Giao diện Đọc tinh gọn (4 theme, cỡ chữ, Text-to-Speech)
│   │   └── SourceFilter.tsx       # Bộ lọc chi tiết theo từng trang báo
│   ├── lib/
│   │   ├── reader-extractor.ts    # Logic bóc tách Reader Mode và làm sạch HTML
│   │   ├── rss-parser.ts          # Engine phân tích dữ liệu RSS/Atom/XML
│   │   ├── sources.ts             # Danh sách nguồn tin tức công nghệ tuyển chọn
│   │   └── utils.ts               # Các hàm tiện ích (tính thời gian đọc, thời gian tương đối)
│   └── types/
│       └── news.ts                # Khai báo kiểu TypeScript
├── next.config.mjs                # Cấu hình Next.js (cho phép ảnh từ mọi nguồn tin)
├── package.json                   # Khai báo thư viện & scripts
├── postcss.config.mjs             # Cấu hình PostCSS
├── tailwind.config.ts             # Cấu hình Tailwind CSS & theme
├── tsconfig.json                  # Cấu hình TypeScript
├── vercel.json                    # Cấu hình Vercel Edge Caching & Regions
└── README.md                      # Hướng dẫn chi tiết dự án
```

---

## 🔒 5. Bản Quyền & Giấy Phép
Dự án được xây dựng dưới giấy phép mã nguồn mở MIT. Tin tức được trích dẫn và tổng hợp tự động từ các nguồn báo chí công nghệ uy tín với đầy đủ ghi chú nguồn và liên kết gốc.
