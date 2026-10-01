export default async function handler(req, res) {
    // Разрешаем запросы с вашего сайта
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { productName, price } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: 'Telegram credentials are not set in environment variables' });
    }

    const message = `☕ Новый заказ в кофейне!\n\nТовар: ${productName}\nЦена: ${price} ₽`;

    try {
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true, message: 'Notification sent to Telegram' });
        } else {
            return res.status(500).json({ error: 'Failed to send to Telegram', details: data });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
