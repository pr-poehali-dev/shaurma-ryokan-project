import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/d3eca4b3-1036-4f92-94af-157af1812bb5/files/d67e0c29-fceb-404e-868a-29eac9680adb.jpg";

interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  priceLabel?: string;
  emoji: string;
  tag?: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

const MENU: MenuItem[] = [
  { id: 1, name: "Гурьевск-экспресс", desc: "Тройная курица, капуста, три соуса, и соль, соль, соль. Подаётся с кружкой солёного воздуха.", price: 500, priceLabel: "500 ₽ или пачка Winston (Маркиз проверит)", emoji: "🌯", tag: "ХИТ" },
  { id: 2, name: "Ленивый депутат", desc: "Без штанов, но с улыбкой. Мяса мало, соли много. И воспоминание о мерседесе на дереве.", price: 999, priceLabel: "штаны или протез (любой)", emoji: "🥩", tag: "VIP" },
  { id: 3, name: "Секретная от Андрея", desc: "🤫", price: 300, emoji: "❓" },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [orderDone, setOrderDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === id);
      if (!ex) return prev;
      if (ex.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const getQty = (id: number) => cart.find((c) => c.id === id)?.qty || 0;

  const scrollTo = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) return;
    setOrderDone(true);
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-border/50" style={{ background: "hsl(20 14% 6% / 0.92)" }}>
        <div className="font-display text-2xl font-bold tracking-widest">
          <span className="text-fire">ШАУРМА</span>-РОК
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[["home", "Главная"], ["menu", "Меню"], ["delivery", "Доставка"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`font-display tracking-wider text-sm uppercase transition-colors hover:text-fire ${activeSection === id ? "text-fire" : "text-muted-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-fire text-background px-4 py-2 rounded-full font-display font-bold text-sm tracking-wide transition-all hover:scale-105 hover:brightness-110"
        >
          <Icon name="ShoppingCart" size={16} />
          Корзина
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-background w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold cart-badge">
              {totalQty}
            </span>
          )}
        </button>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(20 14% 4% / 0.97) 40%, hsl(20 14% 4% / 0.6) 100%), url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        />
        <div className="relative z-10 container mx-auto px-6 pt-24 pb-32">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 border border-fire/40 text-fire text-xs font-display tracking-widest uppercase px-3 py-1 rounded-full mb-6 animate-fade-up">
              🔥 Горячая шаурма прямо к вам
            </div>
            <h1 className="font-display text-7xl md:text-8xl font-bold leading-none tracking-tight mb-4 animate-fade-up delay-100">
              ШАУ<br />
              <span className="text-fire">РМА</span><br />
              -РОК 🤘
            </h1>
            <p className="text-muted-foreground text-lg mb-8 font-body animate-fade-up delay-200">
              Шаурма, которую хочется снова — свежее мясо, хрустящий лаваш, фирменные соусы. Доставим за 30 минут.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-300">
              <button
                onClick={() => scrollTo("menu")}
                className="bg-fire text-background font-display font-bold text-lg px-8 py-4 rounded-full tracking-wide transition-all hover:scale-105 hover:brightness-110 animate-pulse-fire"
              >
                Смотреть меню →
              </button>
              <button
                onClick={() => scrollTo("delivery")}
                className="border border-border text-foreground font-display font-bold text-lg px-8 py-4 rounded-full tracking-wide transition-all hover:border-fire hover:text-fire"
              >
                Условия доставки
              </button>
            </div>
            <div className="flex gap-8 mt-12 animate-fade-up delay-400">
              {[["30 мин", "Доставка"], ["⭐ 4.9", "Рейтинг"], ["1200+", "Отзывов"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-gold">{val}</div>
                  <div className="text-muted-foreground text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl animate-float hidden lg:block">🌯</div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-fire font-display tracking-widest uppercase text-sm mb-2">Наше меню</p>
              <h2 className="font-display text-5xl font-bold">ЧТО <span className="text-fire">ЕДИМ</span></h2>
            </div>
            <p className="text-muted-foreground text-sm hidden md:block">Все позиции готовятся свежими</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MENU.map((item, i) => {
              const qty = getQty(item.id);
              return (
                <div
                  key={item.id}
                  className="relative bg-card border border-border rounded-2xl p-5 hover-lift group"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {item.tag && (
                    <span className="absolute top-4 right-4 text-xs font-display font-bold px-2 py-0.5 rounded-full bg-fire text-background tracking-wider">
                      {item.tag}
                    </span>
                  )}
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.emoji}</div>
                  <h3 className="font-display font-semibold text-lg mb-1 leading-tight">{item.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-snug">{item.desc}</p>
                  <div className="flex flex-col gap-3">
                    <span className="font-display text-base font-bold text-gold">{item.priceLabel ?? `${item.price} ₽`}</span>
                    <div className="flex items-center justify-between">
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-fire text-background font-bold px-4 py-2 rounded-full text-sm transition-all hover:brightness-110 hover:scale-105 font-display"
                        >
                          + В корзину
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full border border-border text-foreground font-bold hover:border-fire hover:text-fire transition-colors"
                          >
                            −
                          </button>
                          <span className="font-display font-bold text-fire w-4 text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-full bg-fire text-background font-bold hover:brightness-110 transition-all"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalQty > 0 && (
            <div className="mt-8 flex justify-center animate-scale-in">
              <button
                onClick={() => setCartOpen(true)}
                className="bg-fire text-background font-display font-bold text-lg px-10 py-4 rounded-full tracking-wide transition-all hover:scale-105 hover:brightness-110 flex items-center gap-3"
              >
                <Icon name="ShoppingCart" size={20} />
                Корзина · {totalQty} шт · {totalPrice} ₽
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-fire font-display tracking-widest uppercase text-sm mb-2">Доставка</p>
            <h2 className="font-display text-5xl font-bold">КАК ЭТО <span className="text-fire">РАБОТАЕТ</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: "UtensilsCrossed", num: "01", title: "Выбираешь", desc: "Добавляй позиции в корзину — шаурму, напитки, закуски" },
              { icon: "Clock", num: "02", title: "Оформляешь", desc: "Заполняешь адрес и имя. Принимаем заказы круглосуточно" },
              { icon: "Bike", num: "03", title: "Получаешь", desc: "Горячая шаурма у твоей двери через 30 минут" },
            ].map((step) => (
              <div key={step.num} className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden group hover-lift">
                <div className="absolute -top-4 -right-4 font-display font-bold text-8xl text-fire/5 group-hover:text-fire/10 transition-colors select-none">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-xl bg-fire/10 border border-fire/20 flex items-center justify-center mb-4">
                  <Icon name={step.icon} fallback="Circle" size={22} className="text-fire" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* ORDER FORM */}
          <div className="max-w-lg mx-auto bg-card border border-border rounded-3xl p-8">
            <h3 className="font-display text-3xl font-bold mb-6 text-center">
              {orderDone ? "ЗАКАЗ ПРИНЯТ! 🎉" : "ОФОРМИТЬ ЗАКАЗ"}
            </h3>
            {orderDone ? (
              <div className="text-center py-8">
                <div className="text-7xl mb-4">🌯</div>
                <p className="text-muted-foreground mb-6">Мы получили ваш заказ и уже готовим! Ожидайте звонка оператора.</p>
                <button
                  onClick={() => { setOrderDone(false); setForm({ name: "", phone: "", address: "" }); }}
                  className="bg-fire text-background font-display font-bold px-8 py-3 rounded-full hover:brightness-110 transition-all"
                >
                  Новый заказ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground font-display uppercase tracking-wider mb-1 block">Ваше имя</label>
                  <input
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-fire transition-colors font-body"
                    placeholder="Иван Петров"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-display uppercase tracking-wider mb-1 block">Телефон</label>
                  <input
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-fire transition-colors font-body"
                    placeholder="+7 (900) 000-00-00"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-display uppercase tracking-wider mb-1 block">Адрес доставки</label>
                  <input
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-fire transition-colors font-body"
                    placeholder="ул. Пушкина, д. 10, кв. 5"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="bg-muted rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Минимальный заказ:</span>
                  <span className="font-display font-bold text-gold">300 ₽</span>
                </div>
                <div className="bg-muted rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Или позвони сам:</span>
                  <a href="tel:+79505795263" className="font-display font-bold text-fire hover:brightness-125 transition-all">+7 (950) 579-52-63</a>
                </div>
                {totalQty > 0 && (
                  <div className="bg-fire/10 border border-fire/20 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-display">В корзине</span>
                    <span className="font-display font-bold text-fire">{totalQty} позиции · {totalPrice} ₽</span>
                  </div>
                )}
                <button
                  onClick={handleOrder}
                  disabled={!form.name || !form.phone || !form.address || totalQty === 0}
                  className="w-full bg-fire text-background font-display font-bold text-lg py-4 rounded-full tracking-wide transition-all hover:brightness-110 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {totalQty === 0 ? "Добавьте товары в корзину" : `Заказать на ${totalPrice} ₽`}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Доставка бесплатно от 500 ₽ · Наличными или картой курьеру
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-2xl font-bold tracking-widest">
            <span className="text-fire">ШАУРМА</span>-РОК
          </div>
          <p className="text-muted-foreground text-sm">Горячая уличная еда · Доставка 30 мин</p>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <a href="tel:+79505795263" className="hover:text-fire transition-colors">📞 +7 (950) 579-52-63</a>
            <span>🕐 Круглосуточно</span>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border flex flex-col animate-slide-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-display text-2xl font-bold">КОРЗИНА</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-fire hover:text-fire transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-5xl mb-4">🌯</div>
                  <p className="font-display text-xl">Корзина пуста</p>
                  <p className="text-sm mt-2">Добавьте что-нибудь из меню</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm leading-tight truncate">{item.name}</p>
                      <p className="text-gold font-bold text-sm">{item.price * item.qty} ₽</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-fire hover:text-fire transition-colors text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="font-display font-bold text-fire w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 rounded-full bg-fire text-background flex items-center justify-center hover:brightness-110 transition-all text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-display text-muted-foreground">Итого</span>
                  <span className="font-display text-2xl font-bold text-gold">{totalPrice} ₽</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); scrollTo("delivery"); }}
                  className="w-full bg-fire text-background font-display font-bold text-lg py-4 rounded-full tracking-wide transition-all hover:brightness-110 hover:scale-[1.02]"
                >
                  Оформить заказ →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}