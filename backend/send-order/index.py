"""Отправка заказа в Telegram. Поддерживает GET /get-chat-id для диагностики."""
import json
import os
import urllib.request
import urllib.parse


def tg_request(token: str, method: str, params: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(params).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"ok": False, "error": e.read().decode()}


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

    # GET /get-chat-id — показывает последние updates, чтобы найти chat_id
    if event.get("httpMethod") == "GET":
        result = tg_request(token, "getUpdates", {"limit": 5, "offset": -5})
        chats = []
        for u in result.get("result", []):
            msg = u.get("message") or u.get("channel_post") or {}
            chat = msg.get("chat", {})
            if chat:
                chats.append({"id": chat.get("id"), "username": chat.get("username"), "title": chat.get("title"), "type": chat.get("type")})
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"updates_chats": chats, "raw": result})}

    # POST — отправка заказа
    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "")
    phone = body.get("phone", "")
    address = body.get("address", "")
    items = body.get("items", [])
    total = body.get("total", 0)

    items_text = "\n".join([f"  • {i['name']} x{i['qty']} — {i['price'] * i['qty']} руб." for i in items])

    message = (
        f"НОВЫЙ ЗАКАЗ — ШАУРМА-РОК\n\n"
        f"Имя: {name}\n"
        f"Телефон: {phone}\n"
        f"Адрес: {address}\n\n"
        f"Состав:\n{items_text}\n\n"
        f"Итого: {total} руб."
    )

    result = tg_request(token, "sendMessage", {
        "chat_id": int(chat_id) if chat_id.lstrip("-").isdigit() else chat_id,
        "text": message,
    })

    print(f"Telegram result: {result}")

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": result.get("ok", False), "tg": result})
    }
