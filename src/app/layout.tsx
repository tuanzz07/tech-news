import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TechPulse - Tin tức & Nội dung chuyên sâu về Công nghệ',
  description:
    'Website tổng hợp tin tức công nghệ, trí tuệ nhân tạo (AI), phần cứng, lập trình, an ninh mạng với chế độ đọc tinh gọn (Reader Mode) loại bỏ quảng cáo.',
  keywords: [
    'công nghệ',
    'AI',
    'trí tuệ nhân tạo',
    'phần cứng',
    'lập trình',
    'an ninh mạng',
    'reader mode',
    'tin tức công nghệ',
    'tech news',
  ],
  authors: [{ name: 'TechPulse' }],
  openGraph: {
    title: 'TechPulse - Tin tức & Nội dung chuyên sâu về Công nghệ',
    description:
      'Cổng thông tin tổng hợp tin tức công nghệ uy tín kèm chế độ đọc tinh gọn Reader Mode.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
