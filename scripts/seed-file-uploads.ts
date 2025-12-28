
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db';
import Lab from '../models/Lab';
import mongoose from 'mongoose';

const fileUploadLabs = [
  {
    slug: 'client-side-bypass',
    title: 'Bypass Xác Thực Client-Side',
    category: 'Web Security',
    difficulty: 'Beginner',
    description: 'Lab này minh họa cách bypass các kiểm tra phần mở rộng file (file extension) được thực hiện bằng JavaScript ở phía client (trình duyệt).',
    tags: ['File Upload'],
    challengePath: '/challenges/client-side-bypass',
    solutionMDX: `
### Giải pháp

**Mục tiêu:** Upload một file \`shell.php\` lên server chỉ cho phép ảnh (\`.jpg\`, \`.png\`).

**Phương pháp: Proxy Interception (Khuyên dùng)**

1.  **Chuẩn bị Payload:** Đổi tên \`shell.php\` thành \`shell.jpg\`.
2.  **Upload:** Chọn file \`shell.jpg\` hợp lệ. Trình duyệt sẽ chấp nhận nó.
3.  **Intercept:** Sử dụng Proxy (như Burp Suite hoặc tab Proxy trong lab) để chặn request.
4.  **Sửa đổi:** Đổi tên file trong body request từ \`shell.jpg\` lại thành \`shell.php\`.
5.  **Forward:** Gửi request đã sửa đổi lên server.
    `,
    contentMDX: `
# Bypass Xác Thực Client-Side

## Tổng quan
Nhiều ứng dụng web chỉ dựa vào JavaScript để kiểm tra loại file người dùng tải lên. Đây là một lỗ hổng bảo mật vì kẻ tấn công có thể dễ dàng vô hiệu hóa hoặc sửa đổi JavaScript để bypass các kiểm tra này.

## Mục tiêu
1.  Tải lên một file PHP (ví dụ: \`shell.php\`) để thực thi mã từ xa.
2.  Ứng dụng sẽ chặn file PHP bằng JavaScript.
3.  Nhiệm vụ của bạn là bypass kiểm tra này.

## Hướng dẫn
1.  Tạo một file có tên \`shell.php\` với nội dung:
    \`\`\`php
    <?php echo "Hello from shell!"; ?>
    \`\`\`
2.  Thử tải lên file này. Bạn sẽ thấy thông báo lỗi từ trình duyệt.
3.  **Cách 1: Tắt JavaScript**
    *   Vào cài đặt trình duyệt và tắt JavaScript.
    *   Tải lại trang và upload file.
4.  **Cách 2: Đổi tên file (Extension Renaming)**
    *   Đổi tên \`shell.php\` thành \`shell.jpg\`.
    *   Chọn file để upload.
    *   Sử dụng Burp Suite hoặc công cụ Proxy để chặn request.
    *   Sửa tên file trong request từ \`shell.jpg\` thành \`shell.php\`.
    *   Gửi request đi (Forward).

## Flag
Sau khi upload thành công và thực thi được file, bạn sẽ nhận được flag.
    `,
    points: 100,
    order: 1,
  },
  // Các lab khác sẽ được thêm vào sau
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing File Upload labs...');
    await Lab.deleteMany({ tags: 'File Upload' });

    console.log('Seeding new labs...');
    await Lab.insertMany(fileUploadLabs);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
