# Hướng Dẫn Bật Tự Động Xác Nhận VietQR Real-Time & Báo Telegram `<1 Giây` (`0₫/tháng`)

Hệ thống **TVT Studio** đã code sẵn 100% đầu cuối. Để chạy tự động hoàn toàn **24/7 kể cả khi bạn đang ngủ** (không cần mở web, không bị trễ như Email), chỉ cần cắm 4 bước miễn phí sau (~5 phút):

---

## Bước 1: Tạo Supabase PostgreSQL Miễn Phí (`0₫`)
1. Tạo 1 project miễn phí tại https://supabase.com.
2. Vào **SQL Editor** -> copy toàn bộ nội dung file `supabase/schema.sql` -> bấm **Run**.
   - Tạo 4 bảng (`tvt_orders`, `tvt_order_events`, `tvt_payment_webhooks`, `tvt_inquiries`), bật Row Level Security và tạo RPC `get_order_payment_status` (chỉ trả trạng thái thanh toán, **không lộ SĐT/Email khách**).
3. Lấy **Project URL** (`https://xxxx.supabase.co`) và **Anon Public Key** trong **Settings -> API**.

## Bước 2: Tạo Telegram Bot Báo Ting-Ting `<1 Giây` (`0₫`)
1. Mở Telegram, nhắn `@BotFather` -> gõ `/newbot` -> copy **`TELEGRAM_BOT_TOKEN`**.
2. Nhắn `@userinfobot` -> copy số **`TELEGRAM_CHAT_ID`** của bạn.
3. Gửi 1 tin `/start` cho con bot bạn vừa tạo để nó có quyền nhắn tin cho bạn.

## Bước 3: Deploy 2 Edge Functions Lên Supabase (`0₫`)
```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>

supabase secrets set \
  SEPAY_WEBHOOK_API_KEY="tvt_secret_key_tu_dat_bat_ky" \
  TELEGRAM_BOT_TOKEN="<BOT_TOKEN>" \
  TELEGRAM_CHAT_ID="<CHAT_ID>"

supabase functions deploy create-order --no-verify-jwt
supabase functions deploy sepay-webhook --no-verify-jwt
supabase functions deploy download-source --no-verify-jwt
supabase functions deploy order-notify --no-verify-jwt
```
> **Bật Đăng Nhập 1 Chạm Google / Facebook / LinkedIn Miễn Phí (`50,000` user/tháng)**:
> - Trong **Supabase -> Authentication -> Providers**: bật `Email` (Email + Password) và bật thêm `Google`, `Facebook`, `LinkedIn (OIDC)` với Client ID/Secret miễn phí của từng nền tảng.
> - Thêm `https://tvt987.github.io/tvt-studio/` vào **Authentication -> URL Configuration -> Redirect URLs**.
>
> **Bật Kho Tải Lại Source Code Vĩnh Viễn (Miễn phí 1GB Private Storage trên Supabase)**:
> 1. Vào **Supabase -> Storage -> New bucket** tên `source-packages` (chọn **Private**, tuyệt đối KHÔNG chọn Public).
> 2. Upload file `.zip` source code từng mẫu (VD: `lumina-medspa-v1.zip`), sau đó thêm 1 dòng vào bảng `tvt_product_deliverables`.
> 3. Khi khách đăng nhập bằng Email OTP (miễn phí `50,000` user/tháng), bấm **Tải Lại Source Code** -> Edge Function `download-source` xác thực đúng chủ đơn đã thanh toán và cấp link tải tạm sống **5 phút** (chống chia sẻ link lậu).
Webhook URL của bạn sẽ là:
`https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/sepay-webhook`

## Bước 4: Nối Ngân Hàng Qua SePay.vn (Hoặc PayOS.vn — `0₫`)
1. Đăng ký tài khoản miễn phí tại https://sepay.vn -> liên kết tài khoản ngân hàng (MB Bank, ACB, Vietcombank, TPBank, VPBank, BIDV...).
2. Vào mục **Webhooks -> Thêm Webhook**:
   - **URL**: `https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/sepay-webhook`
   - **Kiểu chứng thực**: `API Key` -> điền đúng chuỗi `SEPAY_WEBHOOK_API_KEY` ở Bước 3.
   - **Sự kiện**: `Có tiền vào`.
3. Vào **GitHub Repo `tvt987/tvt-studio` -> Settings -> Secrets and variables -> Actions -> Variables** (hoặc cấu hình ngay trong **Owner Console** trên web), điền:
   - `VITE_BANK_BIN` (VD: `970422` cho MB Bank)
   - `VITE_BANK_ACCOUNT` (STK thật của bạn)
   - `VITE_BANK_ACCOUNT_NAME` (`TRUONG VAN TINH`)
   - `VITE_SUPABASE_URL` (`https://xxxx.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` (`eyJ...`)

## Luồng Chạy Thực Tế Khi Đã Cắm Xong
1. Khách chọn web -> bấm **Tạo Đơn & Mở Mã VietQR** -> đơn lưu vào `tvt_orders` trước + **Telegram báo đơn mới sau `<1s`**.
2. Khách quét mã VietQR (tự điền sẵn đúng tiền + nội dung `TVTORD4821` chống ngân hàng xóa dấu `-`).
3. **1–3 giây sau khi khách bấm chuyển**: SePay bắn webhook -> `sepay-webhook` xác thực key, chống trùng tx, cập nhật `status = 'DEPOSIT_VERIFIED'` -> **Telegram điện thoại bạn ting-ting "PAID ✅"** VÀ **màn hình khách tự động nhảy dấu tích xanh "ĐÃ THANH TOÁN THÀNH CÔNG"** + đóng dấu `PAID` lên hóa đơn PDF A4!
