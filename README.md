# 1-Trade Radar

เว็บแอพต้นแบบสำหรับมอนิเตอร์หุ้นสหรัฐและทองคำแบบ realtime/near realtime พร้อม trade setup ระยะ 1-3 วัน, ข่าวสรุปภาษาไทย, risk filter และ Telegram alert

## เปิดใช้งาน

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ได้ทันทีเพื่อดูหน้า UI แบบ demo หรือใช้ Cloudflare Pages เพื่อเรียก `/api/data` และ `/api/telegram`

## สิ่งที่มีใน MVP นี้

- Dashboard หน้าตาทันสมัยสำหรับหุ้นสหรัฐและทองคำ
- ใช้โลโก้ 1-Trade Stock & Gold Radar จาก `assets/1-trade-logo.png`
- Watchlist/Scanner หุ้นสหรัฐ 50 ตัว + ทองคำ พร้อมราคาและสัญญาณ โดยใช้ live data เมื่อ Cloudflare Secrets พร้อม และ fallback เป็น demo data เมื่อยังไม่ได้ตั้งค่า
- รายการโปรดสำหรับหุ้นที่สนใจ เก็บไว้ใน browser ของผู้ใช้และกรองดูได้ทันที
- Trade setup: จุดเข้า, จุดขายทำกำไร, จุดตัดขาดทุน
- ข่าวล่าสุดจาก Marketaux พร้อมสรุปภาษาไทยแบบอ่านง่าย
- Telegram alert preview พร้อมข้อความรูปแบบ production และ backend endpoint สำหรับส่งข้อความจริง
- Engine ให้คะแนนจาก technical, news, market trend และ risk control
- หน้า `settings.html` สำหรับ Production Admin, ตรวจสถานะ API/Telegram และดู Release Notes
- Cloudflare Pages Functions:
  - `/api/data` ดึงราคาจาก Twelve Data และข่าวจาก Marketaux
  - `/api/telegram` ส่ง Telegram alert ผ่าน backend
- โหมด API ฟรีจะทยอยอัปเดต live batch ละ 8 ตัวต่อรอบ เพื่อให้เหมาะกับข้อจำกัด Twelve Data free plan
- แสดง system version และเครดิต `create by mr.1` บนทุกหน้า
- มี Release Notes ในหน้า Settings สำหรับติดตามการเปลี่ยนแปลงแต่ละเวอร์ชัน
- เตรียม Web App Manifest และ mobile meta สำหรับต่อยอดเป็นไอคอนแอปบนโทรศัพท์/แท็บเล็ต

## Production secrets

ตั้งค่าใน Cloudflare Pages > Settings > Variables and Secrets > Add แล้วเลือก Encrypt:

- `TWELVE_DATA_API_KEY` สำหรับหุ้นสหรัฐและ XAU/USD จาก Twelve Data
- `MARKETAUX_API_KEY` สำหรับข่าวหุ้นและตลาดจาก Marketaux
- `TELEGRAM_BOT_TOKEN` สำหรับ Telegram Bot
- `TELEGRAM_CHAT_ID` สำหรับห้องหรือผู้รับ alert

หลังเพิ่มหรือแก้ secret ให้ redeploy project อีกครั้ง

## ขั้นต่อไปสำหรับ production

- สมัคร Twelve Data และ Marketaux free plan แล้วใส่ key เป็น Cloudflare Secrets
- เพิ่มระบบลบข่าวซ้ำและสรุปภาษาไทยด้วย AI ใน backend
- เพิ่ม backend scheduler สำหรับสแกนสัญญาณ
- เพิ่ม backtesting และ paper trading log ก่อนใช้เงินจริง

## Deploy

โปรเจกต์นี้ deploy ผ่าน Cloudflare Pages ได้โดยตั้งค่า build command เป็นค่าว่าง และ output directory เป็น root ของ repository หากใช้ direct upload ผ่าน Wrangler ให้รัน deploy จาก root ของ repo เพื่อให้แนบ `functions/` และ `_routes.json` ไปด้วย

ระบบนี้เป็นเครื่องมือช่วยวิเคราะห์ ไม่ใช่คำแนะนำการลงทุนหรือการรับประกันผลตอบแทน
