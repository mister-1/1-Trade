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
  - `/api/data` ดึงราคาจาก provider หลายเจ้า เช่น Twelve Data, Finnhub, Polygon/Massive และข่าวจาก Marketaux
  - `/api/telegram` ส่ง Telegram alert ผ่าน backend
- โหมด API ฟรีจะทยอยอัปเดต live batch ละ 8 ตัวต่อรอบ เพื่อให้เหมาะกับข้อจำกัด Twelve Data free plan
- แสดง Scan Progress, batch ปัจจุบัน และสถานะรายตัวว่า Fresh, Stale, Updated หรือ Waiting
- แสดง freshness, stale status, อายุข้อมูล และ bid/ask metadata ถ้า provider ส่งมา เพื่อไม่ใช้ข้อมูลเก่าไปตัดสินใจซื้อขาย
- ปรับ ticker badge ให้รองรับ ticker สั้น/ยาวบนมือถือโดยไม่ล้นกรอบ
- แสดง system version และเครดิต `create by mr.1` บนทุกหน้า
- มี Release Notes ในหน้า Settings สำหรับติดตามการเปลี่ยนแปลงแต่ละเวอร์ชัน
- เตรียม Web App Manifest และ mobile meta สำหรับต่อยอดเป็นไอคอนแอปบนโทรศัพท์/แท็บเล็ต

## Production secrets

ตั้งค่าใน Cloudflare Pages > Settings > Variables and Secrets > Add แล้วเลือก Encrypt:

- `TWELVE_DATA_API_KEY` สำหรับหุ้นสหรัฐและ XAU/USD จาก Twelve Data
- `FINNHUB_API_KEY` สำหรับ quote realtime/near realtime จาก Finnhub
- `POLYGON_API_KEY` หรือ `MASSIVE_API_KEY` สำหรับ last trade ของหุ้นสหรัฐจาก Polygon/Massive
- `MARKETAUX_API_KEY` สำหรับข่าวหุ้นและตลาดจาก Marketaux
- `TELEGRAM_BOT_TOKEN` สำหรับ Telegram Bot
- `TELEGRAM_CHAT_ID` สำหรับห้องหรือผู้รับ alert
- `AUTO_SCAN_SECRET` สำหรับป้องกัน endpoint `/api/scan` และ `/api/social` เมื่อเรียกแบบ POST

KV bindings ที่แนะนำ:

- `SIGNAL_JOURNAL` ใช้เก็บประวัติสัญญาณเพื่อวัด win rate/backtest summary
- `SOCIAL_NOTES` ใช้เก็บ social intelligence notes จาก X.com, Facebook, ข่าวไทย หรือ analyst links ที่ admin เพิ่มเอง

หลังเพิ่มหรือแก้ secret ให้ redeploy project อีกครั้ง

## Auto scan และ Telegram schedule

ระบบเพิ่ม endpoint `/api/scan` สำหรับสแกนทั้ง universe, ให้ confidence score, สร้าง Telegram message และบันทึก signal journal เมื่อเรียกแบบ POST

- `GET /api/scan?round=dashboard` ดูผล scan โดยไม่ส่ง Telegram
- `POST /api/scan?round=pre-market` ส่ง Telegram และบันทึก journal ถ้า `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` พร้อม
- ถ้าตั้ง `AUTO_SCAN_SECRET` ต้องส่ง header `x-auto-scan-secret`

ตัวอย่าง worker สำหรับ Cloudflare Cron อยู่ที่ `cloudflare-auto-scan-worker.js` โดยตั้ง secret/variable:

- `ONE_TRADE_SCAN_URL=https://1-trade.pages.dev/api/scan`
- `AUTO_SCAN_SECRET` ค่าเดียวกับ Pages secret
- ตัวอย่าง schedule อยู่ที่ `wrangler.auto-scan.example.toml`

รอบเวลาที่แนะนำสำหรับหุ้น US ตามเวลาไทย:

- 17:30-18:30 ก่อนตลาดเปิด 2-3 ชั่วโมง
- 20:15-20:35 ก่อนเปิด/ตอนเปิดตลาด
- 21:00 ยืนยันหลังตลาดเปิดประมาณ 30 นาที

Social intelligence ใช้ `/api/social` เพื่อเพิ่ม note/ลิงก์ที่ admin ตรวจเจอจาก X.com, Facebook หรือข่าวไทย โดยไม่ scrape หน้าเว็บอัตโนมัติ:

```json
{
  "source": "x.com",
  "title": "NVDA demand discussion",
  "note": "Positive discussion from Thai trading community",
  "url": "https://x.com/...",
  "symbols": ["NVDA"],
  "sentiment": 0.45
}
```

## Marketaux quota guard

เพื่อประหยัดโควต้า Marketaux, `/api/data` จะไม่ดึงข่าวทุกครั้งโดยอัตโนมัติแล้ว ต้องส่ง `news=1` เมื่อต้องการข่าวจริง เช่น `/api/data?liveLimit=8&news=1`

- หน้า Monitor จะ refresh ราคาทุก 30 วินาที แต่ขอข่าวทุก 15 นาทีหรือเมื่อกด refresh เอง
- `/api/scan` ขอข่าวเฉพาะรอบสแกนอัตโนมัติ
- ถ้า response มี warning `news_skipped_to_save_quota` แปลว่ารอบนั้นตั้งใจข้ามข่าวเพื่อประหยัดโควต้า

## ขั้นต่อไปสำหรับ production

- สมัคร Twelve Data และ Marketaux free plan แล้วใส่ key เป็น Cloudflare Secrets
- เพิ่มระบบลบข่าวซ้ำและสรุปภาษาไทยด้วย AI ใน backend
- เพิ่ม backend scheduler สำหรับสแกนสัญญาณ
- เพิ่ม backtesting และ paper trading log ก่อนใช้เงินจริง

## Deploy

โปรเจกต์นี้ deploy ผ่าน Cloudflare Pages ได้โดยตั้งค่า build command เป็นค่าว่าง และ output directory เป็น root ของ repository หากใช้ direct upload ผ่าน Wrangler ให้รัน deploy จาก root ของ repo เพื่อให้แนบ `functions/` และ `_routes.json` ไปด้วย

ระบบนี้เป็นเครื่องมือช่วยวิเคราะห์ ไม่ใช่คำแนะนำการลงทุนหรือการรับประกันผลตอบแทน
