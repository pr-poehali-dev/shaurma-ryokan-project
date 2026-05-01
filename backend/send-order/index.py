"""Отправка заказа в Telegram @Egor100825"""
import json
import os
import urllib.request
import urllib.parse


TELEGRAM_CHAT = "@Egor100825"


def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "")
    phone = body.get("phone", "")
    address = body.get("address", "")
    items = body.get("items", [])
    total = body.get("total", 0)

    items_text = "\n".join([f"  • {i['name']} x{i['qty']} — {i['price'] * i['qty']} ₽" for i in items])

    message = (
        f"🌯 *НОВЫЙ ЗАКАЗ — ШАУРМА-РОК*\n\n"
        f"👤 Имя: {name}\n"
        f"📞 Телефон: {phone}\n"
        f"📍 Адрес: {address}\n\n"
        f"🛒 Состав:\n{items_text}\n\n"
        f"💰 Итого: *{total} ₽*"
    )

    token = os.environ["TELEGRAM_BOT_TOKEN"]
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": TELEGRAM_CHAT,
        "text": message,
        "parse_mode": "Markdown"
    }).encode()

    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": result.get("ok", False)})
    }
