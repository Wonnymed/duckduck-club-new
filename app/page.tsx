"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ArrowRight, Menu, X, Check, ChevronDown, Compass, BookOpen, Handshake, Settings } from "lucide-react";

const GOLD = "#C9A84C";
const GOLD_DIM = "#A0832A";
const SERIF = "'Cormorant Garamond', serif";

/* ─── Fade-in on scroll ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)" } };
}

function Fade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, style } = useFadeIn();
  return <div ref={ref} style={{ ...style, transitionDelay: `${delay}ms` }} className={className}>{children}</div>;
}

/* ─── Smooth scroll helper ─── */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Logo ─── */
function Logo({ size = 36 }: { size?: number }) {
  return <img src="/logo.jpeg" alt="DuckDuck Club" width={size} height={size} style={{ width: size, height: size, objectFit: "contain" }} />;
}

/* ─── Shared UI ─── */
function Badge({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 9999, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.06)", color: GOLD, fontFamily: SERIF }}>{children}</span>;
}

function GoldButton({ children, onClick, href, style: extraStyle = {} }: { children: React.ReactNode; onClick?: () => void; href?: string; style?: React.CSSProperties }) {
  const handleClick = () => {
    if (href) scrollTo(href);
    if (onClick) onClick();
  };
  return (
    <button onClick={handleClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", borderRadius: 8, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontWeight: 600, fontFamily: SERIF, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, color: "#0A0A0A", border: "none", cursor: "pointer", transition: "box-shadow 0.3s", ...extraStyle }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(201,168,76,0.18), 0 8px 32px rgba(0,0,0,0.4)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
      {children}<ArrowRight size={15} />
    </button>
  );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 28px", borderRadius: 8, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontFamily: SERIF, color: GOLD, border: "1px solid rgba(201,168,76,0.3)", background: "transparent", cursor: "pointer", transition: "all 0.3s", width: "100%" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.background = "transparent"; }}>
      {children}
    </button>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ borderRadius: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${open ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "border-color 0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
        <h4 style={{ fontSize: 15, fontWeight: 500, fontFamily: SERIF, color: open ? GOLD : "white", paddingRight: 16, margin: 0 }}>{q}</h4>
        <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.3)", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }} />
      </div>
      {open && <div style={{ padding: "0 24px 20px" }}><p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: 0 }}>{a}</p></div>}
    </div>
  );
}

/* ─── Mobile Nav ─── */
function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo size={28} /><span style={{ color: "white", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: SERIF }}>DuckDuck Club</span></div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color="rgba(255,255,255,0.6)" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 32 }}>
        {[["O clube", "about"], ["Por dentro", "inside"], ["Acesso", "pricing"]].map(([l, h]) => (
          <button key={l} onClick={() => { onClose(); setTimeout(() => scrollTo(h), 200); }} style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: SERIF, letterSpacing: "0.1em" }}>{l}</button>
        ))}
        <GoldButton href="pricing" onClick={onClose}>Ver meu acesso</GoldButton>
      </div>
    </div>
  );
}

/* ═══ CHECKOUT MODAL ═══ */
const LANGS = ["English", "Spanish", "Italian", "French", "German", "Mandarin", "Korean", "Japanese"];

function CheckoutModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const premium = plan === "premium";
  const basePrice = premium ? 29 : 15;
  const [poly, setPoly] = useState(false);
  const [langs, setLangs] = useState<string[]>([]);
  const [payMethod, setPayMethod] = useState<'card' | 'pix' | 'crypto'>('card');
  const free = premium ? 2 : 0;
  const paid = Math.max(0, langs.length - free);
  const total = basePrice + paid * 5 + (poly ? 10 : 0);
  const brl = Math.round(total * 5.2);
  const toggle = (l: string) => setLangs(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", borderRadius: 16, background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, zIndex: 10, width: 32, height: 32, borderRadius: 9999, background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color="rgba(255,255,255,0.6)" /></button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div style={{ padding: 32 }}>
            <div style={{ display: "inline-flex", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, color: GOLD, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 24 }}>Plano {premium ? "Premium" : "Base"}</div>
            <h3 style={{ fontSize: 28, fontWeight: 300, fontFamily: SERIF, marginBottom: 16 }}>Personalize seu acesso</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>
              {premium ? "Seus 2 primeiros idiomas já estão incluídos. Adicione extras ou o Polymarket Lab se quiser expandir." : "Nenhum idioma incluído neste plano. Escolha quantos quiser por +US$5/mês cada, e adicione o Polymarket Lab se desejar."}
            </p>
            <div style={{ borderRadius: 12, padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, fontFamily: SERIF, marginBottom: 4 }}>Polymarket Lab</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>+US$10/mês · aprox. R$52/mês</div>
                </div>
                <button onClick={() => setPoly(!poly)} style={{ width: 48, height: 24, borderRadius: 12, position: "relative", border: "none", cursor: "pointer", background: poly ? GOLD : "rgba(255,255,255,0.1)", transition: "background 0.3s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, position: "absolute", top: 2, left: poly ? 26 : 2, background: poly ? "#0A0A0A" : "rgba(255,255,255,0.4)", transition: "left 0.3s" }} />
                </button>
              </div>
            </div>
            <div style={{ borderRadius: 12, padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 500, fontFamily: SERIF, marginBottom: 8 }}>{premium ? "Escolha seus idiomas" : "Idiomas disponíveis"}</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{premium ? "2 incluídos no plano. A partir do 3º: +US$5/mês cada." : "+US$5/mês por idioma · aprox. R$26/mês cada."}</p>
              {premium && <p style={{ fontSize: 12, color: GOLD, opacity: 0.7, marginBottom: 12 }}>{Math.min(langs.length, free)}/{free} incluídos selecionados</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {LANGS.map(l => {
                  const on = langs.includes(l);
                  return <button key={l} onClick={() => toggle(l)} style={{ fontSize: 12, padding: "8px 16px", borderRadius: 9999, border: `1px solid ${on ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`, background: on ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)", color: on ? GOLD : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }}>{l}</button>;
                })}
              </div>
            </div>
          </div>
          <div style={{ padding: 32, background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 500, color: GOLD, fontFamily: SERIF, marginBottom: 24 }}>Seu acesso selecionado</h4>
            <div>
              {[
                ["Plano", premium ? "Premium" : "Base"],
                ["Inclui", premium ? "Tudo do Base + The Sanctum, Duck Tank, Black Book, Global Moves e 2 idiomas" : "The Portal, The Core, The Lounge e Geopolitics"],
                ["Idiomas", langs.length > 0 ? langs.join(", ") : "Nenhum"],
                ["Extensões", poly ? "Polymarket Lab" : "Nenhum"],
              ].map(([label, value], i) => (
                <div key={label} style={{ paddingTop: i > 0 ? 16 : 0, marginTop: i > 0 ? 16 : 0, borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: GOLD, fontFamily: SERIF }}>Total mensal</span>
                <span style={{ fontSize: 24, fontWeight: 300, fontFamily: SERIF }}>US${total}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>Aprox. R${brl}/mês</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {([["card", "Cartão"], ["pix", "Pix"], ["crypto", "Crypto"]] as const).map(([method, label]) => (
                  <button key={method} onClick={() => setPayMethod(method)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: SERIF, cursor: "pointer", transition: "all 0.2s", background: payMethod === method ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${payMethod === method ? GOLD : "rgba(255,255,255,0.08)"}`, color: payMethod === method ? GOLD : "rgba(255,255,255,0.45)" }}>{label}</button>
                ))}
              </div>
              <button style={{ width: "100%", padding: "14px 0", borderRadius: 8, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, fontFamily: SERIF, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, color: "#0A0A0A", border: "none", cursor: "pointer" }}>
                {payMethod === "card" ? "Continuar para checkout" : payMethod === "pix" ? "Gerar pagamento via Pix" : "Pagar com crypto"}
              </button>
              <p style={{ fontSize: 10, marginTop: 16, textAlign: "center", color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>Cobrança via Stripe. Valor pode variar conforme câmbio e taxas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ COMMUNITY SCREENSHOTS ═══ */
function CommunityShowcase() {
  const screens = [
    { src: "/club-screen-1.png", alt: "The Portal & Core", rotate: -3, ty: 12, w: "28%" },
    { src: "/club-screen-2.png", alt: "The Sanctum & Duck Tank", rotate: 0, ty: 0, w: "32%", featured: true },
    { src: "/club-screen-3.png", alt: "Languages & Polymarket", rotate: 3, ty: 12, w: "28%" },
  ];
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: "2%", alignItems: "flex-end" }}>
        {screens.map((s, i) => (
          <div key={i} style={{
            width: s.w,
            maxWidth: 260,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            border: s.featured ? "1px solid rgba(201,168,76,0.15)" : "1px solid rgba(255,255,255,0.08)",
            transform: `rotate(${s.rotate}deg) translateY(${s.ty}px)`,
            position: "relative" as const,
            zIndex: s.featured ? 3 : 1,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(10,10,10,0.4) 100%)", zIndex: 2, pointerEvents: "none" }} />
            <img src={s.src} alt={s.alt} style={{ width: "100%", height: "auto", display: "block", filter: s.featured ? "brightness(0.95)" : "brightness(0.85)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkout, setCheckout] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dot = (gold = false) => <div style={{ width: 6, height: 6, borderRadius: 3, background: gold ? GOLD : "rgba(255,255,255,0.25)", flexShrink: 0 }} />;

  return (
    <>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      {checkout && <CheckoutModal plan={checkout} onClose={() => setCheckout(null)} />}

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.02) 0%, transparent 70%)" }} />
      </div>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, transition: "all 0.5s", background: scrolled ? "rgba(10,10,10,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "1px solid transparent" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={30} />
            <span style={{ color: "white", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: SERIF }}>DuckDuck Club</span>
          </div>
          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
            {[["O clube", "about"], ["Por dentro", "inside"]].map(([l, h]) => (
              <button key={l} onClick={() => scrollTo(h)} style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: SERIF, transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>{l}</button>
            ))}
            <button onClick={() => scrollTo("pricing")} style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 8, background: "rgba(201,168,76,0.1)", color: GOLD, border: "1px solid rgba(201,168,76,0.2)", fontFamily: SERIF, cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.15)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}>
              Ver meu acesso
            </button>
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(true)} className="mobile-menu" style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}><Menu size={22} color="rgba(255,255,255,0.6)" /></button>
        </div>
      </nav>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu { display: block !important; }
        }
      `}</style>

      {/* ═══ 1. HERO ═══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px 80px", zIndex: 1 }}>
        <div style={{ maxWidth: 896, margin: "0 auto", textAlign: "center" }}>
          <Fade><Badge>Ecossistema Privado</Badge></Fade>
          <Fade delay={150}>
            <h1 style={{ marginTop: 40, marginBottom: 28, fontSize: "clamp(30px, 6vw, 72px)", fontWeight: 300, lineHeight: 1.1, fontFamily: SERIF }}>
              Antes de pensar em crescer financeiramente, <span style={{ fontStyle: "italic", color: GOLD }}>aumente o seu valor no jogo.</span>
            </h1>
          </Fade>
          <Fade delay={300}>
            <p style={{ maxWidth: 640, margin: "0 auto 40px", fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)" }}>
              DuckDuck Club é um ecossistema privado para quem quer mais direção, mais contexto e mais valor real. Aqui você constrói repertório internacional, aprende idiomas, amplia networking e acessa temas como offshore, China import, geopolítica, investimentos, segurança digital e operação global.
            </p>
          </Fade>
          <Fade delay={450}><GoldButton href="pricing">Ver meu acesso</GoldButton></Fade>
          <Fade delay={600}>
            <div style={{ marginTop: 48, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              {["Idiomas para acesso global", "Network, deals e matchmaking", "Offshore, China e geopolítica", "Privado, curado, sem ruído"].map(t => (
                <span key={t} style={{ fontSize: 12, padding: "8px 16px", borderRadius: 9999, border: "1px solid rgba(201,168,76,0.12)", background: "rgba(201,168,76,0.03)", color: "rgba(255,255,255,0.45)" }}>{t}</span>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ 2. O PROBLEMA ═══ */}
      <section id="about" style={{ position: "relative", padding: "80px 24px 112px", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Fade>
            <Badge>O problema</Badge>
            <h2 style={{ marginTop: 24, fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 24 }}>
              Ambição sem contexto, sem linguagem e sem estrutura vira <span style={{ fontStyle: "italic", color: GOLD }}>desperdício de potencial.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 40, maxWidth: 720 }}>
              Muita gente quer crescer e acessar oportunidades maiores. Mas tenta fazer isso com informação espalhada, networking fraco, leitura rasa de cenário e pouca capacidade prática de execução. O resultado é viver ocupada, mas continuar jogando abaixo do próprio potencial.
            </p>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { t: "Muito conteúdo, pouca direção", d: "Sem leitura de cenário e geopolítica, a maioria reage tarde e decide no ruído." },
              { t: "Muito potencial, pouco acesso", d: "Sem linguagem, repertório e as pessoas certas por perto, oportunidades simplesmente não chegam." },
              { t: "Muita ambição, pouca estrutura", d: "Sem ferramentas, proteção e operações globais bem entendidas, o jogo fica mais caro e mais lento." },
            ].map((item, i) => (
              <Fade key={item.t} delay={i * 100}>
                <div style={{ padding: "24px 28px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", height: "100%" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, fontFamily: SERIF, marginBottom: 12 }}>{item.t}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", margin: 0 }}>{item.d}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. POR DENTRO — 2x2 rectangle grid ═══ */}
      <section id="inside" style={{ position: "relative", padding: "80px 24px 112px", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Fade>
            <Badge>Por dentro</Badge>
            <h2 style={{ marginTop: 24, fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 16 }}>O que você encontra <span style={{ fontStyle: "italic", color: GOLD }}>ao entrar</span></h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 48, maxWidth: 720 }}>
              Quatro frentes de valor real. Cada uma desenhada para te colocar em uma posição melhor do que você estava ontem.
            </p>
          </Fade>
          {/* 2x2 grid of horizontal rectangles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { icon: Compass, title: "Direção", desc: "Geopolítica, leitura de cenário e contexto estratégico para você antecipar movimentos — enquanto a maioria ainda está reagindo." },
              { icon: BookOpen, title: "Valor pessoal", desc: "Idiomas, repertório e ferramentas práticas para ampliar seu alcance, sua utilidade e o tipo de oportunidade que chega até você." },
              { icon: Handshake, title: "Valor relacional", desc: "Networking, deals e matchmaking que conectam você a operadores, investidores e oportunidades que não circulam no mainstream." },
              { icon: Settings, title: "Valor operacional", desc: "Offshore, China import, crypto OPSEC e estruturas internacionais — não como teoria, mas como execução real com proteção." },
            ].map((item, i) => (
              <Fade key={item.title} delay={i * 80}>
                <div style={{ padding: "28px 32px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", height: "100%", display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, minWidth: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", marginTop: 2 }}><item.icon size={20} color={GOLD} /></div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 500, fontFamily: SERIF, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
          <Fade delay={350}><div style={{ marginTop: 56, textAlign: "center" }}><GoldButton href="pricing">Quero acessar o clube</GoldButton></div></Fade>
        </div>
      </section>

      {/* ═══ 4. COMMUNITY SCREENSHOTS ═══ */}
      <section style={{ position: "relative", padding: "80px 24px 112px", overflow: "hidden", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Fade>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>O ambiente</Badge>
              <h2 style={{ marginTop: 24, fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 16 }}>Um ecossistema <span style={{ fontStyle: "italic", color: GOLD }}>real e organizado.</span></h2>
              <p style={{ fontSize: 15, maxWidth: 560, margin: "0 auto", lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>Canais estruturados, inteligência curada e espaços que funcionam — do onboarding ao nível mais operacional.</p>
            </div>
          </Fade>
          <Fade delay={200}><CommunityShowcase /></Fade>
          <Fade delay={350}><p style={{ textAlign: "center", marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Plataforma via app e desktop · Acesso imediato após checkout</p></Fade>
        </div>
      </section>

      {/* ═══ 5. SOBRE O CRIADOR ═══ */}
      <section style={{ position: "relative", padding: "80px 24px 112px", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Fade>
            <Badge>Sobre o criador</Badge>
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src="/founder-photo.jpeg" alt="Nando Voyager — Founder" style={{ width: 320, height: 320, minWidth: 320, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(201,168,76,0.3)" }} />
                <p style={{ fontSize: 18, fontWeight: 500, fontFamily: SERIF, color: "white", marginTop: 20, marginBottom: 4 }}>Nando Voyager</p>
                <a href="https://instagram.com/nandovoyager" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: GOLD, textDecoration: "none", opacity: 0.85, transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}>@nandovoyager</a>
              </div>
              <div>
                <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 300, lineHeight: 1.2, fontFamily: SERIF, marginBottom: 24 }}>
                  A DuckDuck Club nasceu da interseção entre <span style={{ fontStyle: "italic", color: GOLD }}>contexto global, operação real e construção de valor.</span>
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 0 }}>
                  Depois de viver entre países, operar em ambientes diferentes e perceber como idioma, geopolítica, estrutura, network e execução mudam o nível do jogo, eu decidi reunir tudo isso em um ecossistema privado. A DuckDuck Club foi criada para quem quer deixar de depender de improviso, ruído e informação solta — e começar a operar com mais clareza, mais linguagem e mais capacidade prática.
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ 6. PARA VOCÊ SE... ═══ */}
      <section style={{ position: "relative", padding: "80px 24px 112px", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Fade><h2 style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 48 }}>Isso é para você se<span style={{ color: GOLD }}>...</span></h2></Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Fade>
              <div style={{ padding: "24px 32px", borderRadius: 16, background: "rgba(201,168,76,0.02)", border: "1px solid rgba(201,168,76,0.1)", height: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {["Quer aumentar o próprio valor antes de aumentar o tamanho do jogo", "Valoriza contexto, curadoria e repertório internacional", "Quer construir networking útil — não só consumir conteúdo", "Quer operar melhor com mais direção, linguagem e alavancas"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><Check size={16} color={GOLD} style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>{item}</span></div>
                  ))}
                </div>
              </div>
            </Fade>
            <Fade delay={100}>
              <div style={{ padding: "24px 32px", borderRadius: 16, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", height: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {["Procura hype, promessa fácil ou atalhos mágicos", "Quer só assistir sem aplicar", "Prefere volume em vez de sinal", "Não valoriza contexto, profundidade e execução"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><X size={16} color="rgba(255,255,255,0.2)" style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.3)" }}>{item}</span></div>
                  ))}
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══ 7. PRICING ═══ */}
      <section id="pricing" style={{ position: "relative", padding: "80px 24px 112px", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Fade>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 12 }}>Escolha seu nível de <span style={{ fontStyle: "italic", color: GOLD }}>acesso</span></h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 48 }}>Entre pelo core ou desbloqueie a camada mais valiosa do clube.</p>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <Fade>
              <div style={{ padding: "24px 32px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100%" }}>
                <span style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontFamily: SERIF }}>Base</span>
                <p style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>A camada de direção e posicionamento</p>
                <div style={{ marginTop: 12, marginBottom: 4 }}><span style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300, fontFamily: SERIF }}>US$15</span><span style={{ fontSize: 14, marginLeft: 4, color: "rgba(255,255,255,0.35)" }}>/mês</span></div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 24 }}>aprox. R$79/mês</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, flex: 1 }}>
                  {[
                    ["The Portal", "onboarding e direção"],
                    ["The Core", "strategy & intel"],
                    ["The Lounge", "networking"],
                    ["Geopolitics", "leitura de cenário"],
                  ].map(([name, sub]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>{dot()}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{name} <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>({sub})</span></span></div>
                  ))}
                </div>
                <OutlineButton onClick={() => setCheckout("base")}>Escolher Base</OutlineButton>
              </div>
            </Fade>
            <Fade delay={100}>
              <div style={{ padding: "24px 32px", borderRadius: 16, background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", transform: "translate(30%, -30%)", pointerEvents: "none" }} />
                <p style={{ fontSize: 11, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, marginTop: 0 }}>Mais popular</p>
                <span style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 9999, border: `1px solid ${GOLD}`, background: "rgba(201,168,76,0.1)", color: GOLD, fontFamily: SERIF }}>Premium</span>
                <p style={{ marginTop: 20, fontSize: 14, color: "rgba(201,168,76,0.7)", marginBottom: 4 }}>A camada mais valiosa do clube</p>
                <div style={{ marginTop: 12, marginBottom: 4 }}><span style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300, fontFamily: SERIF, color: GOLD }}>US$29</span><span style={{ fontSize: 14, marginLeft: 4, color: "rgba(201,168,76,0.5)" }}>/mês</span></div>
                <p style={{ fontSize: 12, color: "rgba(201,168,76,0.35)", marginBottom: 24 }}>aprox. R$149/mês</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, flex: 1 }}>
                  {[
                    ["Tudo do Base", null],
                    ["The Sanctum", "offshore, crypto, China"],
                    ["Duck Tank", "deals e projetos"],
                    ["Black Book", "case studies"],
                    ["Global Moves", "vida internacional"],
                    ["2 idiomas incluídos", null],
                  ].map(([name, sub]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>{dot(true)}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{name}{sub && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}> ({sub})</span>}</span></div>
                  ))}
                </div>
                <GoldButton onClick={() => setCheckout("premium")} style={{ width: "100%" }}>Escolher Premium</GoldButton>
              </div>
            </Fade>
          </div>
          <Fade delay={200}>
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Cobrança internacional via Stripe. Valor final pode variar conforme câmbio.</p>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ 8. FAQ ═══ */}
      <section style={{ position: "relative", padding: "80px 24px 112px", zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Fade><h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 40 }}>Perguntas <span style={{ fontStyle: "italic", color: GOLD }}>frequentes</span></h2></Fade>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "O que exatamente eu recebo no Base?", a: "Acesso ao core do ecossistema: leitura de cenário, contexto, sinal e networking leve, sem ruído. Inclui The Portal, The Core, The Lounge e Geopolitics." },
              { q: "O que muda no Premium?", a: "O Premium abre a camada mais valiosa do clube: The Sanctum, Duck Tank, Black Book, Global Moves e 2 idiomas incluídos. É onde vive a parte mais estratégica e operacional." },
              { q: "Os 2 idiomas do Premium são escolhidos na entrada?", a: "Sim. Ao entrar no Premium, você define seus 2 idiomas. Extras podem ser adicionados depois por US$5/mês cada." },
              { q: "Posso adicionar idiomas no Base?", a: "Sim. No Base, idiomas funcionam como extensão opcional por +US$5/mês cada." },
              { q: "O que é o Polymarket Lab?", a: "Camada opcional para acompanhar leituras, teses e sinais ligados a prediction markets dentro da lógica do ecossistema. +US$10/mês." },
              { q: "Como funciona o acesso depois do pagamento?", a: "Após confirmação, você segue para a ativação do acesso conforme o plano e extensões escolhidas." },
              { q: "O pagamento é mensal?", a: "Sim. Recorrente via Stripe, com cobrança internacional." },
              { q: "Posso cancelar?", a: "Sim. Acesso simples, sem fricção." },
            ].map((item, i) => (
              <Fade key={i} delay={i * 40}><FAQItem q={item.q} a={item.a} /></Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. FINAL CTA ═══ */}
      <section style={{ position: "relative", padding: "112px 24px 160px", zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 60%)" }} /></div>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Fade><Logo size={48} /></Fade>
          <Fade delay={100}><h2 style={{ marginTop: 32, fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 24 }}>Seu próximo nível começa <span style={{ fontStyle: "italic", color: GOLD }}>pelo ambiente certo.</span></h2></Fade>
          <Fade delay={200}><p style={{ fontSize: 15, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>Privado. Curado. Internacional.<br />Feito para quem quer operar com mais contexto, mais conexões e mais capacidade prática.</p></Fade>
          <Fade delay={300}><GoldButton href="pricing">Ver meu acesso</GoldButton></Fade>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", zIndex: 1 }}>
        <div style={{ maxWidth: 1024, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo size={22} /><span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontFamily: SERIF }}>DuckDuck Club</span></div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Termos", "Privacidade"].map(item => (
              <a key={item} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>{item}</a>
            ))}
            <a href="https://instagram.com/duckduck.club" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>Instagram</a>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.15)" }}>© 2026 DuckDuck Club</div>
        </div>
      </footer>
    </>
  );
}
