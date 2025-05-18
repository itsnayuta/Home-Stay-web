🚀 HƯỚNG DẪN CÀI ĐẶT SOURCE CODE WEBSITE CHO THUÊ HOMESTAY
1️⃣ Yêu cầu hệ thống
🔹 Node.js >= 18.0 (Tải Node.js)
🔹 Yarn (Trình quản lý package) (Cài đặt Yarn)
2️⃣ Yêu cầu thông tin .env
(Thông tin này bạn cần tự tạo, không thuộc phần hỗ trợ dịch vụ)

🔹 Kết nối MongoDB
Xem hướng dẫn tại: Hướng dẫn tạo MongoDB

Ví dụ:

MONGO_URI=mongodb+srv://demomedproxxxx:demomedproxxxxx@homestaycluxlys.ntflq.mongodb.net/

🔹 Cấu hình VNPAY
Xem hướng dẫn tại: Hướng dẫn lấy config VNPAY

Chỉ cần lấy được các thông tin Merchant VNPAY như trong video (phút 2:46).

🔹 Cấu hình Firebase
Dùng để upload ảnh, cần thông tin config Firebase.

3️⃣ Cài đặt source (Node.js + Express)
📥 Tải file ZIP và giải nén thành thư mục homestay
📂 Mở thư mục homestay, copy file .env.local và đổi tên thành .env
✏️ Cập nhật file .env với các thông tin:
MONGO_URI=MONGO_URI
FIREBASE_API_KEY=FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN=FIREBASE_AUTH_DOMAIN
FIREBASE_APP_ID=FIREBASE_APP_ID
FIREBASE_MESSAGING_SENDER_ID=FIREBASE_MESSAGING_SENDER_ID
FIREBASE_PROJECT_ID=FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET=FIREBASE_STORAGE_BUCKET
VNP_TMN_CODE=VNP_TMN_CODE
VNP_HASH_SECRET=VNP_HASH_SECRET

4️⃣ Cài đặt & chạy project
📌 Mở **Terminal** hoặc **Command Prompt**, chạy các lệnh sau:

# Cài đặt backend: mở thư mục homestay
yarn install

# Cài đặt frontend: mở thư mục homeatay/frontend
yarn install

# Khi muốn Chạy toàn bộ hệ thống (backend + frontend) mở terminal ở thư mục homestay
yarn full

✅ Sau khi hoàn tất, mở trình duyệt và truy cập:

🌍 Frontend: http://localhost:5173
🔗 API Backend: http://localhost:5000
📩 Liên hệ ngay nếu bạn cần hỗ trợ! 🚀