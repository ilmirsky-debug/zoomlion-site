import { jsPDF } from "jspdf";
import RobotoFont from "../public/fonts/Roboto-Regular-normal.js";

export default function GeneratePDF({ item }) {

  // === РЕГИСТРАЦИЯ ШРИФТА ===
  jsPDF.API.events.push([
    "addFonts",
    function () {
      this.addFileToVFS("Roboto-Regular.ttf", RobotoFont);
      this.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    },
  ]);

  const company = {
    name: "ООО «АЛЬФА ТРЕЙД»",
    address:
      "423800, РТ, г. Набережные Челны, Промкомзона 2, Производственный проезд, 3",
    phone: "+7 (919) 622-85-55",
    email: "info@zoomliontrade.ru",
    inn: "1650365378",
    kpp: "165001001",
    bank: 'ФИЛИАЛ "НИЖЕГОРОДСКИЙ" АО "АЛЬФА-БАНК"',
    bik: "042202824",
    account: "40702810929140004090",
  };

  // ========= loader изображений =========
  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
    });

  const generate = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFont("Roboto");

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // === ЛОГОТИП ===
    try {
      const logo = await loadImage("/images/Heropdf.jpg");
      doc.addImage(logo, "JPEG", 40, y, 150, 80);
    } catch {}

    // === QR ===
    try {
      const qr = await loadImage("/images/qr.png");
      doc.addImage(qr, "PNG", pageWidth - 150, y, 100, 100);
    } catch {}

    y += 120;

    // === ЗАГОЛОВОК ===
    doc.setFontSize(22);
    doc.text("КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ", pageWidth / 2, y, { align: "center" });
    y += 25;

    // === БЛОК РЕКВИЗИТОВ ===
    doc.setFillColor(237, 237, 237); // стиль B
    doc.roundedRect(40, y, pageWidth - 80, 140, 6, 6, "F");

    doc.setFontSize(11);

    // авто-перенос для адреса
    const addrText = doc.splitTextToSize(`Адрес: ${company.address}`, 250);
    let addrHeight = addrText.length * 12;

    // левая колонка
    doc.text(company.name, 55, y + 18);
    doc.text(addrText, 55, y + 34);
    doc.text(`Телефон: ${company.phone}`, 55, y + 34 + addrHeight + 5);
    doc.text(`Email: ${company.email}`, 55, y + 34 + addrHeight + 20);

    // правая колонка
    const rightX = pageWidth / 2 + 10;
    doc.text(`ИНН: ${company.inn}`, rightX, y + 18);
    doc.text(`КПП: ${company.kpp}`, rightX, y + 34);
    const bankWrapped = doc.splitTextToSize(`Банк: ${company.bank}`, 200);
    doc.text(bankWrapped, rightX, y + 50);
    doc.text(`БИК: ${company.bik}`, rightX, y + 50 + bankWrapped.length * 12 + 5);
    doc.text(
      `Счёт: ${company.account}`,
      rightX,
      y + 50 + bankWrapped.length * 12 + 20
    );

    y += 170;

    // === Фото техники ===
    if (item.images?.length > 0) {
      try {
        const image = await loadImage(item.images[0]);
        doc.addImage(image, "JPEG", 40, y, 240, 170); // одинаковый размер
      } catch {}
    }

// === Таблица техники ===
const tableX = 300;
const tableW = pageWidth - tableX - 40;

doc.setFillColor(242, 242, 242);
doc.roundedRect(tableX, y, tableW, 190, 6, 6, "F");

doc.setFontSize(14);

// ---- Название техники (перенос)
const titleWrapped = doc.splitTextToSize(item.title, tableW - 20);
doc.text(titleWrapped, tableX + 12, y + 20);

doc.setFontSize(11);

// ---- Производитель
const producer = doc.splitTextToSize(`Производитель: Zoomlion`, tableW - 20);
doc.text(producer, tableX + 12, y + 55);

// ---- Модель
const model = doc.splitTextToSize(`Модель: ${item.title}`, tableW - 20);
doc.text(model, tableX + 12, y + 75);

// ---- Срок поставки
doc.text(`Срок поставки: Техника в наличии`, tableX + 12, y + 95);

// ---- Описание
doc.text("Описание:", tableX + 12, y + 110);
const descLines = doc.splitTextToSize(item.desc || "", tableW - 20);
doc.text(descLines, tableX + 12, y + 125);

y += 220;;

    // === ИТОГО ===
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // теперь ЧЁРНЫЙ
    doc.text(`ИТОГО: ${item.price}  (с НДС)`, 40, y);

    y += 25;

    // === СРОК ДЕЙСТВИЯ КП ===
    doc.setFontSize(11);
    doc.text("Коммерческое предложение действительно 3 дня.", 40, y);

    y += 40;

    // === FOOTER ===
    doc.setFontSize(10);
    doc.text(company.phone, 40, 820);
    doc.text(company.email, 150, 820);
    doc.text("© Zoomlion Russia", pageWidth - 150, 820);

    doc.save(`Коммерческое_предложение_${item.title}.pdf`);
  };

  return (
    <button
      onClick={generate}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Скачать КП
    </button>
  );
}
