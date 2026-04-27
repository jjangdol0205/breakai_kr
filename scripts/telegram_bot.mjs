import fetch from 'cross-fetch';

/**
 * Send a message to Telegram
 * @param {string} text - The message text (HTML format supported)
 */
export async function sendTelegramMessage(text) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn("⚠️ Telegram configuration missing (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID). Skipping Telegram notification.");
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            }),
        });

        const result = await response.json();
        if (!result.ok) {
            console.error("❌ Telegram API Error:", result.description);
            return false;
        }
        
        console.log("✅ Successfully sent Telegram notification!");
        return true;
    } catch (err) {
        console.error("❌ Failed to send Telegram message:", err);
        return false;
    }
}
