const ONE_TRADE_META = {
  version: "1.0.9",
  createdBy: "mr.1",
  updatedAt: "2026-07-05",
  releaseNotes: [
    {
      version: "1.0.9",
      date: "2026-07-05",
      title: "เพิ่มสถานะการสแกนแบบ Batch",
      notes: [
        "เพิ่มแผง Scan Progress เพื่อบอกว่าระบบกำลังสแกนชุดที่เท่าไรจากทั้งหมด",
        "แสดงรายชื่อหุ้นใน batch ปัจจุบันและเวลาที่อัปเดตล่าสุด",
        "เพิ่ม badge รายตัวเป็น Live now, Updated และ Waiting เพื่อให้รู้ว่าหุ้นตัวไหนได้ราคาจริงแล้ว",
      ],
    },
    {
      version: "1.0.8",
      date: "2026-07-05",
      title: "ปรับ Settings เป็น Production Admin",
      notes: [
        "เปลี่ยนหน้า Settings จากฟอร์มกรอก API key ในเครื่องเป็นหน้าแสดงสถานะ production",
        "เพิ่มการตรวจสถานะ `/api/data` และ `/api/telegram` โดยไม่เปิดเผย secret",
        "คงหน้า Settings ไว้สำหรับ admin, Cloudflare Secrets และ Release Notes เท่านั้น",
      ],
    },
    {
      version: "1.0.7",
      date: "2026-07-05",
      title: "เพิ่มรายการโปรดและปรับ Watchlist",
      notes: [
        "เพิ่มปุ่มดาวเพื่อบันทึกหุ้นที่สนใจเป็นรายการโปรดในเครื่องผู้ใช้",
        "เพิ่มตัวกรองรายการโปรดในหน้า Watchlist",
        "ปรับ ticker chip ให้ทันสมัยขึ้น ขนาดนิ่งขึ้น และไม่ล้นกรอบบนมือถือ",
        "ปรับ layout แถวหุ้นบนหน้าจอเล็กให้เน้นชื่อหุ้นและปุ่มรายการโปรดอ่านง่ายขึ้น",
      ],
    },
    {
      version: "1.0.6",
      date: "2026-07-05",
      title: "เพิ่ม Scanner หุ้นสหรัฐ 50 ตัว",
      notes: [
        "เพิ่ม universe หุ้นสหรัฐ 50 ตัว พร้อมทองคำ XAUUSD ในหน้า Monitor",
        "ปรับระบบดึงข้อมูลจริงให้ทยอยอัปเดต batch ละ 8 ตัวต่อรอบ เพื่อให้เหมาะกับ Twelve Data free plan",
        "จัดเรียง Watchlist ตาม Signal Score เพื่อให้หุ้นที่น่าสนใจขึ้นก่อน",
        "เพิ่มสถานะ Live/Queued ในรายการหุ้นเพื่อบอกว่าตัวไหนเพิ่งได้ข้อมูลจริงจาก API",
      ],
    },
    {
      version: "1.0.5",
      date: "2026-07-05",
      title: "ปรับ Telegram Alert และคำบน Production",
      notes: [
        "ปรับข้อความ Telegram Alert ให้มีไอคอนและโครงสร้างที่อ่านง่ายขึ้นบนมือถือ",
        "เปลี่ยนปุ่มจากทดสอบ Telegram Alert เป็นส่ง Telegram Alert เพื่อให้เหมาะกับ production",
        "เปลี่ยนสถานะ Demo Fallback เป็น Fallback Data และ Standby Data เพื่อลดความสับสนของผู้ใช้",
      ],
    },
    {
      version: "1.0.4",
      date: "2026-07-04",
      title: "เชื่อม API ข้อมูลจริงผ่าน Cloudflare",
      notes: [
        "เพิ่ม Cloudflare Pages Functions `/api/data` สำหรับดึงราคาจาก Twelve Data และข่าวจาก Marketaux โดยอ่าน API key จาก Cloudflare Secrets",
        "เพิ่ม `/api/telegram` สำหรับส่ง Telegram alert ผ่าน backend แทนการใช้ token ใน browser",
        "ปรับหน้า Dashboard ให้ใช้ live data เมื่อ secret พร้อม และ fallback เป็น demo data เมื่อยังไม่ได้ตั้งค่า API",
        "เพิ่มรายชื่อ Cloudflare Secrets ที่ต้องตั้งในหน้า Settings",
      ],
    },
    {
      version: "1.0.3",
      date: "2026-07-04",
      title: "เตรียม Responsive และ App Icon",
      notes: [
        "เพิ่ม Web App Manifest สำหรับติดตั้งเป็นไอคอนบนโทรศัพท์และแท็บเล็ตในอนาคต",
        "เพิ่ม mobile web app meta tags สำหรับ iOS/Android browser",
        "ปรับหน้า Settings ให้ใช้โลโก้เดียวกับหน้า Monitor และยืนยันแนว responsive สำหรับ desktop, tablet และโทรศัพท์",
      ],
    },
    {
      version: "1.0.2",
      date: "2026-07-04",
      title: "เพิ่มเครดิตผู้สร้างและระบบเวอร์ชัน",
      notes: [
        "เพิ่มข้อความ create by mr.1 ที่มุมขวาล่างของทุกหน้า",
        "เพิ่มการแสดงเลขเวอร์ชันระบบบนหน้า Monitor และ Settings",
        "เพิ่ม Release Notes ในหน้า Settings เพื่อบันทึกสิ่งที่ปรับในแต่ละเวอร์ชัน",
      ],
    },
    {
      version: "1.0.1",
      date: "2026-07-03",
      title: "ปรับความอ่านง่ายของ Watchlist",
      notes: [
        "ปรับสีตัวอักษรในกล่องชื่อหุ้นและราคาให้ contrast สูงขึ้น",
        "ปรับ ticker chip ให้ไม่กลืนกับพื้นหลังและรองรับ XAUUSD ได้ดีขึ้น",
      ],
    },
    {
      version: "1.0.0",
      date: "2026-07-03",
      title: "เปิดตัว 1-Trade MVP",
      notes: [
        "สร้าง dashboard สำหรับหุ้นสหรัฐและทองคำ",
        "เพิ่มหน้า Settings สำหรับ Telegram และ API keys",
        "Deploy ขึ้น Cloudflare Pages ที่ https://1-trade.pages.dev/",
      ],
    },
  ],
};

function hydrateSystemMeta() {
  document.querySelectorAll("[data-app-version]").forEach((element) => {
    element.textContent = `v${ONE_TRADE_META.version}`;
  });

  document.querySelectorAll("[data-created-by]").forEach((element) => {
    element.textContent = `create by ${ONE_TRADE_META.createdBy}`;
  });

  const releaseList = document.querySelector("#releaseNotesList");
  if (!releaseList) return;

  releaseList.innerHTML = ONE_TRADE_META.releaseNotes
    .map((release) => `
      <article class="release-item">
        <header>
          <span>v${release.version}</span>
          <strong>${release.title}</strong>
          <time>${release.date}</time>
        </header>
        <ul>
          ${release.notes.map((note) => `<li>${note}</li>`).join("")}
        </ul>
      </article>
    `)
    .join("");
}

hydrateSystemMeta();
