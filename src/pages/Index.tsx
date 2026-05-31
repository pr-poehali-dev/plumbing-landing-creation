import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Услуги", href: "#services" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Контакты", href: "#contacts" },
];

const SERVICES = [
  {
    icon: "Wrench",
    title: "Установка сантехники",
    desc: "Унитазы, раковины, ванны, душевые кабины — монтаж любой сложности с гарантией.",
    price: "от 1 500 ₽",
    tag: "Популярное",
  },
  {
    icon: "Droplets",
    title: "Устранение протечек",
    desc: "Быстрая диагностика и ремонт труб, кранов, соединений. Работаем без вскрытия стен.",
    price: "от 800 ₽",
    tag: "Срочно",
  },
  {
    icon: "Flame",
    title: "Отопление",
    desc: "Монтаж и замена радиаторов, трубопроводов, подключение котлов и бойлеров.",
    price: "от 2 000 ₽",
    tag: null,
  },
  {
    icon: "Wind",
    title: "Канализация",
    desc: "Прочистка засоров, монтаж и замена канализационных труб любого диаметра.",
    price: "от 1 200 ₽",
    tag: null,
  },
  {
    icon: "Bath",
    title: "Ремонт ванной",
    desc: "Комплексное обустройство ванной комнаты под ключ — от плитки до сантехники.",
    price: "от 15 000 ₽",
    tag: "Под ключ",
  },
  {
    icon: "Gauge",
    title: "Водоснабжение",
    desc: "Замена труб, установка фильтров, счётчиков воды и запорной арматуры.",
    price: "от 1 800 ₽",
    tag: null,
  },
];

const ADVANTAGES = [
  { icon: "Clock", title: "Выезд за 30 минут", desc: "Работаем круглосуточно, приезжаем в кратчайшие сроки" },
  { icon: "ShieldCheck", title: "Гарантия 2 года", desc: "Письменная гарантия на все виды выполненных работ" },
  { icon: "BadgeCheck", title: "Лицензированные мастера", desc: "Все специалисты сертифицированы и имеют опыт от 5 лет" },
  { icon: "Wallet", title: "Честные цены", desc: "Смета до начала работ, стоимость не меняется в процессе" },
  { icon: "Star", title: "10 лет на рынке", desc: "Более 5 000 выполненных заказов по всему городу" },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Консультация по телефону в любое время суток" },
];

const PORTFOLIO = [
  { title: "Ванная комната под ключ", area: "8 м²", duration: "5 дней", tag: "Ремонт" },
  { title: "Замена труб в квартире", area: "62 м²", duration: "2 дня", tag: "Трубопровод" },
  { title: "Монтаж отопления", area: "Частный дом", duration: "3 дня", tag: "Отопление" },
  { title: "Установка душевой кабины", area: "Студия", duration: "1 день", tag: "Монтаж" },
  { title: "Устранение аварии", area: "Офис", duration: "4 часа", tag: "Аварийный" },
  { title: "Водоснабжение дома", area: "120 м²", duration: "4 дня", tag: "Водоснабжение" },
];

const REVIEWS = [
  {
    name: "Александра М.",
    rating: 5,
    text: "Вызвала мастера по аварии с прорывом трубы ночью. Приехали через 25 минут! Быстро и качественно всё починили. Очень благодарна!",
    service: "Устранение протечки",
    date: "15 марта 2024",
  },
  {
    name: "Виктор Р.",
    rating: 5,
    text: "Делали ванную полностью под ключ. Работой очень доволен — всё аккуратно, в срок, цена соответствует договору. Рекомендую!",
    service: "Ремонт ванной",
    date: "2 апреля 2024",
  },
  {
    name: "Наталья К.",
    rating: 5,
    text: "Заменили все трубы в квартире. Работали чисто, убрали за собой. Цена приятная, мастер опытный — чувствуется профессионализм.",
    service: "Замена труб",
    date: "20 апреля 2024",
  },
  {
    name: "Дмитрий Л.",
    rating: 4,
    text: "Установили котёл и радиаторы. Чуть дольше по времени, но зато всё работает отлично. Хорошее соотношение цена/качество.",
    service: "Монтаж отопления",
    date: "5 мая 2024",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function Index() {
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const servicesSection = useInView();
  const advantagesSection = useInView();
  const portfolioSection = useInView();
  const reviewsSection = useInView();
  const contactsSection = useInView();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", phone: "", service: "", comment: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan flex items-center justify-center glow-cyan">
              <Icon name="Wrench" size={18} className="text-background" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-cyan text-glow">
              АКВА<span className="text-foreground">МАСТЕР</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-display text-sm tracking-widest uppercase text-muted-foreground hover:text-cyan transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href="tel:+74951234567"
            className="hidden md:flex items-center gap-2 bg-cyan text-background px-5 py-2 rounded-full font-display font-semibold tracking-wide text-sm hover:glow-cyan transition-all duration-300 hover:scale-105"
          >
            <Icon name="Phone" size={15} />
            +7 (495) 123-45-67
          </a>

          <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background/98 border-b border-border px-6 pb-6 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-base tracking-widest uppercase text-muted-foreground hover:text-cyan py-2 border-b border-border/50"
              >
                {l.label}
              </a>
            ))}
            <a
              href="tel:+74951234567"
              className="flex items-center justify-center gap-2 bg-cyan text-background px-5 py-3 rounded-full font-display font-semibold tracking-wide mt-2"
            >
              <Icon name="Phone" size={15} />
              +7 (495) 123-45-67
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center grid-pattern overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-cyan/10 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-orange/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan/5 blur-3xl" />
        </div>

        <div className="absolute right-16 top-32 hidden lg:block opacity-15 animate-float">
          <div className="w-3 h-44 bg-cyan rounded-full" />
          <div className="w-14 h-3 bg-cyan rounded-full" />
          <div className="w-3 h-28 bg-cyan rounded-full ml-11" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 bg-cyan/10 border border-cyan/30 rounded-full px-4 py-2 mb-8 animate-slide-up"
              style={{ animationDelay: "0.1s", opacity: 0 }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              <span className="text-cyan text-sm font-display tracking-widest uppercase">Работаем 24/7 · Выезд за 30 мин</span>
            </div>

            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-6 animate-slide-up"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              САНТЕХ<span className="text-cyan text-glow">НИК</span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl font-light text-muted-foreground">на которого</span>
              <br />
              МОЖНО <span className="text-orange">ПОЛОЖИТЬСЯ</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10 max-w-xl animate-slide-up"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              Профессиональный ремонт, монтаж и обслуживание сантехники. Приезжаем быстро — решаем надёжно. Гарантия на все работы.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
              <a
                href="#contacts"
                className="group flex items-center justify-center gap-3 bg-cyan text-background px-8 py-4 rounded-full font-display font-bold text-lg tracking-wide hover:glow-cyan transition-all duration-300 hover:scale-105"
              >
                Вызвать мастера
                <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="flex items-center justify-center gap-3 border border-border bg-secondary/50 text-foreground px-8 py-4 rounded-full font-display tracking-wide text-lg hover:border-cyan/50 hover:bg-secondary transition-all duration-300"
              >
                <Icon name="List" size={18} />
                Все услуги
              </a>
            </div>

            <div className="flex flex-wrap gap-10 mt-16 animate-slide-up" style={{ animationDelay: "0.65s", opacity: 0 }}>
              {[
                { value: "5 000+", label: "Заказов выполнено" },
                { value: "10 лет", label: "На рынке" },
                { value: "98%", label: "Довольных клиентов" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display text-3xl md:text-4xl font-bold text-cyan text-glow">{s.value}</span>
                  <span className="text-sm text-muted-foreground mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-display tracking-widest uppercase text-muted-foreground">Листать</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyan to-transparent" />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
        <div ref={servicesSection.ref} className="max-w-7xl mx-auto px-6 relative">
          <div className={`mb-16 transition-all duration-700 ${servicesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-16 bg-cyan/50" />
              <span className="font-display text-cyan text-sm tracking-widest uppercase">Что мы делаем</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold">НАШИ <span className="text-cyan">УСЛУГИ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className={`group relative bg-card border border-border rounded-2xl p-7 hover:border-cyan/50 hover:bg-secondary/50 transition-all duration-500 cursor-default
                  ${servicesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {s.tag && (
                  <span className={`absolute top-5 right-5 text-xs font-display tracking-widest uppercase px-3 py-1 rounded-full ${s.tag === "Срочно" ? "bg-orange/20 text-orange border border-orange/30" : "bg-cyan/10 text-cyan border border-cyan/20"}`}>
                    {s.tag}
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-5 group-hover:bg-cyan/20 group-hover:border-cyan/40 transition-all duration-300">
                  <Icon name={s.icon} size={22} className="text-cyan" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 tracking-wide">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-cyan">{s.price}</span>
                  <a href="#contacts" className="flex items-center gap-1 text-xs font-display tracking-wide text-muted-foreground hover:text-cyan transition-colors uppercase">
                    Заказать <Icon name="ArrowRight" size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-28">
        <div ref={advantagesSection.ref} className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 transition-all duration-700 ${advantagesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-16 bg-orange/50" />
              <span className="font-display text-orange text-sm tracking-widest uppercase">Почему выбирают нас</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold">НАШИ <span className="text-orange">ПРЕИМУЩЕСТВА</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((a, i) => (
              <div
                key={a.title}
                className={`flex gap-5 bg-card border border-border rounded-2xl p-7 hover:border-orange/30 transition-all duration-500
                  ${advantagesSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center">
                  <Icon name={a.icon} size={22} className="text-orange" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2 tracking-wide">{a.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div ref={portfolioSection.ref} className="max-w-7xl mx-auto px-6 relative">
          <div className={`mb-16 transition-all duration-700 ${portfolioSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-16 bg-cyan/50" />
              <span className="font-display text-cyan text-sm tracking-widest uppercase">Наши объекты</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold">ПОРТФОЛИО <span className="text-cyan">РАБОТ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PORTFOLIO.map((p, i) => (
              <div
                key={p.title}
                className={`group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyan/40 hover:-translate-y-1
                  ${portfolioSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="h-48 bg-gradient-to-br from-secondary to-background relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 grid-pattern opacity-60" />
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Icon name="Wrench" size={36} className="text-cyan opacity-60" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-cyan/20 border border-cyan/30 text-cyan text-xs font-display tracking-widest uppercase px-3 py-1 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold mb-3 tracking-wide">{p.title}</h3>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Maximize2" size={14} className="text-cyan" />
                      {p.area}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} className="text-cyan" />
                      {p.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-28">
        <div ref={reviewsSection.ref} className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 transition-all duration-700 ${reviewsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-16 bg-orange/50" />
              <span className="font-display text-orange text-sm tracking-widest uppercase">Что говорят клиенты</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold">ОТЗЫВЫ <span className="text-orange">КЛИЕНТОВ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={r.name}
                className={`bg-card border border-border rounded-2xl p-8 hover:border-orange/30 transition-all duration-500
                  ${reviewsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange/10 border border-orange/20 flex items-center justify-center font-display text-lg font-bold text-orange">
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="font-display font-semibold tracking-wide">{r.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.service}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Icon key={j} name="Star" size={14} className="text-orange fill-orange" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm italic">"{r.text}"</p>
                <div className="mt-4 text-xs text-muted-foreground/60 font-display tracking-wide">{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 via-cyan/5 to-orange/10 pointer-events-none" />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            АВАРИЙНАЯ <span className="text-orange">СИТУАЦИЯ?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">Звоните прямо сейчас — мастер выедет в течение 30 минут</p>
          <a
            href="tel:+74951234567"
            className="inline-flex items-center gap-3 bg-orange text-background px-10 py-5 rounded-full font-display text-xl font-bold tracking-wide hover:glow-orange transition-all duration-300 hover:scale-105"
          >
            <Icon name="Phone" size={22} />
            +7 (495) 123-45-67
          </a>
        </div>
      </section>

      {/* CONTACTS / FORM */}
      <section id="contacts" className="py-28 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-cyan/30 pointer-events-none" />
        <div ref={contactsSection.ref} className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 transition-all duration-700 ${contactsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-16 bg-cyan/50" />
              <span className="font-display text-cyan text-sm tracking-widest uppercase">Связаться с нами</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold">ВЫЗВАТЬ <span className="text-cyan">МАСТЕРА</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className={`transition-all duration-700 delay-100 ${contactsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="bg-card border border-border rounded-2xl p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center glow-cyan">
                      <Icon name="CheckCircle2" size={32} className="text-cyan" />
                    </div>
                    <h3 className="font-display text-2xl font-bold">Заявка принята!</h3>
                    <p className="text-muted-foreground">Мы перезвоним вам в ближайшие 5 минут</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <h3 className="font-display text-2xl font-bold mb-2">Оставьте заявку</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Ваше имя</label>
                        <input
                          type="text"
                          required
                          placeholder="Иван Иванов"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Телефон</label>
                        <input
                          type="tel"
                          required
                          placeholder="+7 (999) 000-00-00"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Вид услуги</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all appearance-none"
                      >
                        <option value="">Выберите услугу...</option>
                        {SERVICES.map((s) => (
                          <option key={s.title} value={s.title}>{s.title}</option>
                        ))}
                        <option value="Другое">Другое</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Описание проблемы</label>
                      <textarea
                        rows={3}
                        placeholder="Опишите вашу проблему..."
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-3 bg-cyan text-background px-8 py-4 rounded-full font-display font-bold text-lg tracking-wide hover:glow-cyan transition-all duration-300 hover:scale-105 mt-2"
                    >
                      Отправить заявку
                      <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-muted-foreground/60 text-center">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className={`flex flex-col gap-4 transition-all duration-700 delay-200 ${contactsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (495) 123-45-67", sub: "Звонки принимаем 24/7" },
                { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "+7 (495) 123-45-67", sub: "Пишите в любое время" },
                { icon: "Mail", label: "Email", value: "info@aquamaster.ru", sub: "Ответим в течение часа" },
                { icon: "MapPin", label: "Адрес", value: "Москва и область", sub: "Работаем по всему городу" },
                { icon: "Clock", label: "График работы", value: "Круглосуточно", sub: "Без выходных и праздников" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-5 bg-card border border-border rounded-2xl p-6 hover:border-cyan/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} size={20} className="text-cyan" />
                  </div>
                  <div>
                    <div className="text-xs font-display tracking-widest uppercase text-muted-foreground mb-0.5">{c.label}</div>
                    <div className="font-display font-semibold text-base">{c.value}</div>
                    <div className="text-xs text-muted-foreground">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan flex items-center justify-center">
              <Icon name="Wrench" size={16} className="text-background" />
            </div>
            <span className="font-display font-bold tracking-wider text-cyan">АКВА<span className="text-foreground">МАСТЕР</span></span>
          </div>
          <p className="text-sm text-muted-foreground text-center">© 2024 АкваМастер. Сантехнические услуги в Москве</p>
          <div className="flex flex-wrap gap-5">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-xs font-display tracking-widest uppercase text-muted-foreground hover:text-cyan transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
