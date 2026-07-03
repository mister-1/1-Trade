# 1-Trade Radar

เว็บแอพต้นแบบสำหรับมอนิเตอร์หุ้นสหรัฐและทองคำแบบ realtime/near realtime พร้อม trade setup ระยะ 1-3 วัน, ข่าวสรุปภาษาไทย, risk filter และตัวอย่าง Telegram alert

## เปิดใช้งาน

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ได้ทันที

## สิ่งที่มีใน MVP นี้

- Dashboard หน้าตาทันสมัยสำหรับหุ้นสหรัฐและทองคำ
- ใช้โลโก้ 1-Trade Stock & Gold Radar จาก `assets/1-trade-logo.png`
- Watchlist พร้อมราคาและสัญญาณจำลอง
- Trade setup: จุดเข้า, จุดขายทำกำไร, จุดตัดขาดทุน
- ข่าวล่าสุดแบบสรุปภาษาไทย
- Telegram alert preview
- Engine ให้คะแนนจาก technical, news, market trend และ risk control
- หน้า `settings.html` สำหรับ Backend Setup แยกจากหน้า monitor เพื่อบันทึก Telegram Bot, Chat ID, market data API, gold API, news API และ AI summary API ในเครื่อง

## ขั้นต่อไปสำหรับ production

- ต่อ market data API เช่น Finnhub, Alpha Vantage, Polygon หรือ Twelve Data
- ต่อ news API/RSS พร้อมระบบลบข่าวซ้ำและสรุปภาษาไทย
- เพิ่ม backend scheduler สำหรับสแกนสัญญาณ
- เพิ่ม Telegram Bot token และ chat ID
- ย้าย secret/API keys จาก browser localStorage ไปไว้ backend หรือ secret storage
- เพิ่ม backtesting และ paper trading log ก่อนใช้เงินจริง

## Deploy

Static MVP นี้สามารถนำขึ้น GitHub แล้ว deploy ผ่าน Cloudflare Pages ได้โดยตั้งค่า build command เป็นค่าว่าง และ output directory เป็น root ของ repository

ระบบนี้เป็นเครื่องมือช่วยวิเคราะห์ ไม่ใช่คำแนะนำการลงทุนหรือการรับประกันผลตอบแทน
