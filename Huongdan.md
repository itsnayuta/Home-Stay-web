# 🚀 Hướng Dẫn Cài Đặt Source Code Website Cho Thuê Homestay

Hướng dẫn này sẽ giúp bạn cài đặt và chạy source code cho website cho thuê homestay sử dụng **Node.js** và **Express**. Hãy làm theo các bước dưới đây để triển khai hệ thống một cách dễ dàng.

---

## 1️⃣ Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo hệ thống của bạn đáp ứng các yêu cầu sau:

- **Node.js**: Phiên bản >= 18.0. [Tải Node.js tại đây](https://nodejs.org/).
- **Yarn**: Trình quản lý package. [Hướng dẫn cài đặt Yarn](https://yarnpkg.com/getting-started/install).

---

## 2️⃣ Cấu Hình File `.env`

Bạn cần tạo file `.env` với các thông tin cấu hình sau. Những thông tin này không thuộc phạm vi hỗ trợ dịch vụ, bạn cần tự chuẩn bị.

### 🔹 Kết Nối MongoDB
- **Hướng dẫn**: Xem [Hướng dẫn tạo MongoDB](https://www.mongodb.com/docs/manual/installation/).
- **Ví dụ**:
  ```
  MONGO_URI=mongodb+srv://demomedproxxxx:demomedproxxxxx@homestaycluxlys.ntflq.mongodb.net/
  ```

### 🔹 Cấu Hình VNPAY
- **Hướng dẫn**: Xem [Hướng dẫn lấy config VNPAY](https://sandbox.vnpayment.vn/). Xem video hướng dẫn (phút 2:46) để lấy thông tin Merchant.
- **Thông tin cần thiết**:
  - `VNP_TMN_CODE`
  - `VNP_HASH_SECRET`

### 🔹 Cấu Hình Firebase
- **Mục đích**: Dùng để upload ảnh.
- **Hướng dẫn**: Xem [Hướng dẫn cấu hình Firebase](https://firebase.google.com/docs/web/setup).
- **Thông tin cần thiết**:
  - `FIREBASE_API_KEY`
  - `FIREBASE_AUTH_DOMAIN`
  - `FIREBASE_APP_ID`
  - `FIREBASE_MESSAGING_SENDER_ID`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_STORAGE_BUCKET`

---

## 3️⃣ Cài Đặt Source Code

### Bước 1: Tải và Giải Nén
- Tải file ZIP chứa source code và giải nén vào thư mục `homestay`.

### Bước 2: Cấu Hình File `.env`
1. Mở thư mục `homestay`.
2. Copy file `.env.local` và đổi tên thành `.env`.
3. Mở file `.env` và cập nhật các thông tin sau:
   ```
   MONGO_URI=<your_mongo_uri>
   FIREBASE_API_KEY=<your_firebase_api_key>
   FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
   FIREBASE_APP_ID=<your_firebase_app_id>
   FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
   FIREBASE_PROJECT_ID=<your_firebase_project_id>
   FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
   VNP_TMN_CODE=<your_vnp_tmn_code>
   VNP_HASH_SECRET=<your_vnp_hash_secret>
   ```

---

## 4️⃣ Cài Đặt và Chạy Dự Án

### Bước 1: Cài Đặt Dependencies
Mở **Terminal** hoặc **Command Prompt** và chạy các lệnh sau:

#### Cài đặt Backend
```bash
# Di chuyển vào thư mục homestay
cd homestay
yarn install
```

#### Cài đặt Frontend
```bash
# Di chuyển vào thư mục frontend
cd homestay/frontend
yarn install
```

### Bước 2: Chạy Toàn Bộ Hệ Thống
```bash
# Quay lại thư mục homestay
cd homestay
yarn full
```

### Bước 3: Kiểm Tra Kết Quả
Sau khi chạy lệnh, mở trình duyệt và truy cập:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Backend**: [http://localhost:5000](http://localhost:5000)

---

## 5️⃣ Hỗ Trợ

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình cài đặt, vui lòng liên hệ để được hỗ trợ! 🚀

📩 **Email**: [support@example.com](mailto:support@example.com)  
🌐 **Website**: [www.example.com](https://www.example.com)
