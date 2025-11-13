// === Настройки Telegram (ВНИМАНИЕ: небезопасно хранить токен в клиентском JS) ===
const TELEGRAM_BOT_TOKEN = "8506461202:AAG6V4dppZG6EVyxvarHfwb3Dso2IwQG2xY"; 
const TELEGRAM_CHAT_ID = "5764625744";

// === Получить публичный IP через ipify ===
async function getPublicIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
        if (!res.ok) throw new Error("ipify error " + res.status);
        const j = await res.json();
        return j.ip || "unknown";
    } catch (e) {
        console.warn("Не удалось получить публичный IP:", e);
        return "unknown";
    }
}

// === Отправка сообщения в Telegram ===
async function sendLog(message) {
    try {
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🧾 [Шёпот тишины]\n${message}`,
                disable_notification: true
            })
        }).catch(err => console.error("Ошибка отправки fetch -> Telegram:", err));
    } catch (err) {
        console.error("Ошибка при отправке в Telegram:", err);
    }
}

// === Собрать расширенные данные окружения ===
async function gatherAndSend(baseMessage) {
    const ip = await getPublicIP();
    const ua = navigator.userAgent || "unknown";
    const platform = navigator.platform || "unknown";
    const lang = navigator.language || "unknown";
    const screenRes = (window.screen && window.screen.width) ? `${window.screen.width}x${window.screen.height}` : "unknown";

    const full = [
        baseMessage,
        "",
        "📡 IP: " + ip,
        "🌐 User-Agent: " + ua,
        "💻 Platform: " + platform,
        "🗣 Language: " + lang,
        "🖥 Screen: " + screenRes,
        "⏱ Time: " + new Date().toISOString()
    ].join("\n");

    console.log(full);
    sendLog(full);
}

// === Отчёт при загрузке страницы ===
(async function initialReport() {
    const report = [
        "123"
    ].join("\n");

    await gatherAndSend(report);
    console.log("🟢 Скрипт загружен!");
})();
