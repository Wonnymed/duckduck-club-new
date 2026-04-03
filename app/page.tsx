"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, Check, ChevronDown, Compass, BookOpen, Handshake, Settings, Lock, Globe, Cpu, Shield } from "lucide-react";

const GOLD = "#C9A84C";
const GOLD_DIM = "#A0832A";
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'DM Sans', sans-serif";

/* ─── Loading Screen ─── */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const sequence = [
    { text: "> establishing secure connection...", delay: 300 },
    { text: "> routing through encrypted tunnel...", delay: 800 },
    { text: "> verifying credentials...", delay: 1300 },
    { text: "> clearance: granted", delay: 1800 },
    { text: "> welcome to duckduck club.", delay: 2200 },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    sequence.forEach((item) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, item.text]);
      }, item.delay));
    });
    timers.push(setTimeout(() => setDone(true), 2800));
    timers.push(setTimeout(() => { onCompleteRef.current(); }, 3200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "#050505", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 10%", fontFamily: "'Courier New', monospace" }}
    >
      {/* Scanline effect */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)", pointerEvents: "none", zIndex: 2 }} />

      {/* Terminal lines */}
      <div style={{ position: "relative", zIndex: 3 }} className="loading-content">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: 14,
              marginBottom: 12,
              color: line.includes("welcome")
                ? "#C9A84C"
                : line.includes("granted")
                ? "#4ADE80"
                : "rgba(201,168,76,0.6)",
              letterSpacing: "0.05em",
            }}
          >
            {line}
            {i === lines.length - 1 && !done && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ marginLeft: 2 }}
              >
                █
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Subtle DuckDuck logo watermark */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 10, opacity: lines.length >= 4 ? 0.3 : 0, transition: "opacity 0.5s" }}>
        <img src="/logo.jpeg" alt="" style={{ width: 20, height: 20, objectFit: "contain", borderRadius: "50%" }} />
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", fontFamily: SANS }}>DuckDuck Club</span>
      </div>
    </motion.div>
  );
}

/* ─── Text Reveal word by word ─── */
function TextReveal({ text, gold = false, italic = false, delay = 0 }: { text: string; gold?: boolean; italic?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(" ");
  return (
    <span ref={ref} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={gold ? "gold-shimmer" : ""}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: "inline-block", marginRight: "0.3em", fontStyle: italic ? "italic" : "normal" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Fade-in on scroll ─── */
function Fade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: delay / 1000, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated section divider ─── */
function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 80 } : { width: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }}
      />
    </div>
  );
}

/* ─── Smooth scroll helper ─── */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Logo ─── */
function Logo({ size = 36 }: { size?: number }) {
  return <img src="/logo.jpeg" alt="DuckDuck Club" width={size} height={size} style={{ width: size, height: size, objectFit: "cover", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.15)", background: "transparent" }} />;
}

/* ─── Shared UI ─── */
function Badge({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 9999, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.06)", color: GOLD, fontFamily: SANS }}>{children}</span>;
}

function GoldButton({ children, onClick, href, style: extraStyle = {}, className = "" }: { children: React.ReactNode; onClick?: () => void; href?: string; style?: React.CSSProperties; className?: string }) {
  const handleClick = () => {
    if (href) scrollTo(href);
    if (onClick) onClick();
  };
  return (
    <motion.button
      onClick={handleClick}
      className={className}
      whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(201,168,76,0.2)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 32px", borderRadius: 8, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontWeight: 600, fontFamily: SANS, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, color: "#0A0A0A", border: "none", cursor: "pointer", position: "relative", ...extraStyle }}
    >
      {children}<ArrowRight size={15} />
    </motion.button>
  );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(201,168,76,0.2)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 28px", borderRadius: 8, fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontFamily: SANS, color: GOLD, border: "1px solid rgba(201,168,76,0.3)", background: "transparent", cursor: "pointer", width: "100%" }}
      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; }}
      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </motion.button>
  );
}

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} className="faq-item" style={{ borderRadius: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)"}`, cursor: "pointer", transition: "border-color 0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
        <h4 style={{ fontSize: 15, fontWeight: 500, fontFamily: SANS, color: open ? GOLD : "white", paddingRight: 16, margin: 0 }}>{q}</h4>
        <span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", flexShrink: 0, lineHeight: 1, transition: "transform 0.2s" }}>{open ? "−" : "+"}</span>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo size={28} /><span style={{ color: "white", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: SANS }}>DuckDuck Club</span></div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} color="rgba(255,255,255,0.6)" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 32 }}>
        <GoldButton href="pricing" onClick={onClose}>Ver meu acesso</GoldButton>
      </div>
    </div>
  );
}

/* ═══ CHECKOUT MODAL ═══ */
const LANGS = ["English", "Spanish", "Italian", "French", "German", "Mandarin", "Korean", "Japanese"];

const CARD_LINKS: Record<string, string> = {
  "base-15": "https://app.duckduck.club/checkout/base-access",
  "base-20": "https://app.duckduck.club/checkout/base-access-1-idioma",
  "base-25": "https://app.duckduck.club/checkout/base-access-2-idiomas",
  "premium-29": "https://app.duckduck.club/checkout/premium-access",
  "premium-34": "https://app.duckduck.club/checkout/premium-access-1-idioma",
};

function resolveCheckoutLink(plan: string, extraLanguages: number): string {
  const normalizedExtra = plan === "premium" ? Math.min(extraLanguages, 1) : Math.min(extraLanguages, 2);
  const key = plan === "premium" ? `premium-${29 + normalizedExtra * 5}` : `base-${15 + normalizedExtra * 5}`;
  return CARD_LINKS[key] ?? "#";
}

const BRL_MAP: Record<number, number> = {
  15: 79, 20: 99, 25: 129, 29: 149, 34: 179, 39: 199, 44: 229, 49: 249,
};

function CheckoutModal({ plan, onClose, onWhatsApp }: { plan: string; onClose: () => void; onWhatsApp: (plan: string, method: string, totalUSD: number) => void }) {
  const premium = plan === "premium";
  const basePrice = premium ? 29 : 15;
  const [poly, setPoly] = useState(false);
  const [langs, setLangs] = useState<string[]>([]);
  const [payMethod, setPayMethod] = useState<'card' | 'pix' | 'crypto'>('card');
  const freeIncluded = premium ? 2 : 0;
  const maxLangs = premium ? 3 : 2;
  const extraLanguages = Math.max(0, langs.length - freeIncluded);
  const normalizedExtra = Math.min(extraLanguages, premium ? 1 : 2);
  const total = basePrice + normalizedExtra * 5;
  const brl = BRL_MAP[total] || Math.round(total * 5.2);
  const toggle = (l: string) => setLangs(p => {
    if (p.includes(l)) return p.filter(x => x !== l);
    if (p.length >= maxLangs) return p;
    return [...p, l];
  });

  const block: React.CSSProperties = { borderRadius: 12, padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12, transition: "all 0.3s ease" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={e => e.stopPropagation()}
        className="checkout-modal"
        style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", borderRadius: 20, background: "#0F0F0F", border: "1px solid rgba(201,168,76,0.08)", padding: 40 }}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 9999, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={15} color="rgba(255,255,255,0.4)" />
        </button>

        {/* Badge */}
        <div style={{ display: "inline-flex", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 9999, color: GOLD, background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: 20 }}>
          Plano {premium ? "Premium" : "Base"}
        </div>

        {/* Headline */}
        <h3 style={{ fontSize: 28, fontWeight: 300, fontFamily: SANS, marginBottom: 8, marginTop: 0 }}>Personalize seu acesso</h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.4)", marginBottom: 0 }}>
          {premium ? "Seus 2 primeiros idiomas estão incluídos. Adicione extras se quiser." : "Nenhum idioma incluído. Escolha até 2 por +US$5/mês cada."}
        </p>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: `rgba(201,168,76,0.3)`, margin: "24px auto" }} />

        {/* Total em destaque */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, fontWeight: 300, fontFamily: SANS, lineHeight: 1 }}>US${total}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>aprox. R${brl}/mês</div>
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.3)", margin: "0 auto 24px" }} />

        {/* Idiomas */}
        <div style={block}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: SANS }}>{premium ? "Escolha seus idiomas" : "Idiomas disponíveis"}</div>
            {premium && <div style={{ fontSize: 11, color: GOLD, opacity: 0.7 }}>{Math.min(langs.length, freeIncluded)}/{freeIncluded} incluídos</div>}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14, marginTop: 0 }}>
            {premium ? "2 incluídos · adicione até 1 extra por +US$5/mês" : "+US$5/mês por idioma · aprox. R$25/mês cada"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {LANGS.map(l => {
              const on = langs.includes(l);
              const blocked = !on && langs.length >= maxLangs;
              return (
                <button key={l} onClick={() => toggle(l)} disabled={blocked}
                  style={{ fontSize: 13, padding: "10px 18px", borderRadius: 20, border: `1px solid ${on ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`, background: on ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", color: on ? GOLD : blocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)", cursor: blocked ? "not-allowed" : "pointer", opacity: blocked ? 0.4 : 1, transition: "all 0.3s ease" }}>
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: "rgba(201,168,76,0.3)", margin: "12px auto 24px" }} />

        {/* Método de pagamento */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Método de pagamento</div>
          <div style={{ display: "flex", gap: 8 }}>
            {([["card", "Cartão"], ["pix", "Pix"], ["crypto", "Crypto"]] as const).map(([method, label]) => (
              <button key={method} onClick={() => setPayMethod(method)}
                style={{ flex: 1, padding: "12px 0", borderRadius: 10, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: SANS, cursor: "pointer", transition: "all 0.3s ease", background: payMethod === method ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${payMethod === method ? GOLD : "rgba(255,255,255,0.07)"}`, color: payMethod === method ? GOLD : "rgba(255,255,255,0.4)", boxShadow: payMethod === method ? "0 0 20px rgba(201,168,76,0.1)" : "none" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Resumo compacto */}
        <div style={{ ...block, marginBottom: 20 }}>
          {[
            ["Plano", premium ? "Premium" : "Base"],
            ["Idiomas", langs.length > 0 ? langs.join(", ") : "Nenhum"],
            ["Extras", extraLanguages > 0 ? `${extraLanguages} idioma(s) extra(s)` : "Nenhum"],
          ].map(([label, value], i) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: i > 0 ? 10 : 0, marginTop: i > 0 ? 10 : 0, borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}>{label}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => { if (payMethod === "card") { window.open(resolveCheckoutLink(plan, extraLanguages), "_blank"); } else { onWhatsApp(plan, payMethod, total); onClose(); } }}
          style={{ width: "100%", padding: "18px 0", borderRadius: 10, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, fontFamily: SANS, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, color: "#0A0A0A", border: "none", cursor: "pointer", transition: "opacity 0.2s ease" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {payMethod === "card" ? "Continuar para checkout" : payMethod === "pix" ? "Gerar pagamento Pix" : "Pagar com crypto"}
        </button>

        {/* Nota */}
        <p style={{ fontSize: 11, marginTop: 16, textAlign: "center", color: "rgba(255,255,255,0.2)", lineHeight: 1.6, margin: "16px 0 0" }}>
          Cobrança via Stripe. Valor pode variar conforme câmbio.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ═══ WHATSAPP FORM MODAL ═══ */
function WhatsAppFormModal({ plan, method, totalUSD, onClose }: { plan: string; method: string; totalUSD: number; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const planLabel = plan === "premium" ? "Premium" : "Base";
  const methodLabel = method === "pix" ? "Pix" : "Crypto";
  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    const message = encodeURIComponent("Olá, quero entrar no DuckDuck Club.\n\nPlano: " + planLabel + " (US$" + totalUSD + "/mês)\nMétodo de pagamento: " + methodLabel + "\nNome: " + name.trim() + "\nEmail: " + email.trim());
    window.open("https://wa.me/15615966097?text=" + message, "_blank");
    onClose();
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}>
      <div onClick={e => e.stopPropagation()} className="whatsapp-modal" style={{ maxWidth: 480, width: "100%", borderRadius: 16, background: "#111", border: "1px solid rgba(255,255,255,0.08)", padding: 32, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 9999, background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color="rgba(255,255,255,0.6)" /></button>
        <h3 style={{ fontSize: 24, fontWeight: 300, fontFamily: SANS, marginBottom: 8 }}>Finalize seu acesso</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>Pix e crypto com atendimento direto via WhatsApp.</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Plano</div>
            <div style={{ fontSize: 15, color: "white", fontFamily: SANS }}>{planLabel} · US${totalUSD}/mês</div>
          </div>
          <div style={{ flex: 1, padding: 14, borderRadius: 10, background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Pagamento</div>
            <div style={{ fontSize: 15, color: GOLD, fontFamily: SANS }}>{methodLabel}</div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" style={{ width: "100%", padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu melhor email" type="email" style={{ width: "100%", padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <button onClick={handleSubmit} disabled={!name.trim() || !email.trim()} style={{ width: "100%", padding: "16px 0", borderRadius: 8, background: (!name.trim() || !email.trim()) ? "rgba(201,168,76,0.3)" : `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, color: "#0A0A0A", fontSize: 14, fontWeight: 600, fontFamily: SANS, letterSpacing: "0.12em", textTransform: "uppercase", cursor: (!name.trim() || !email.trim()) ? "not-allowed" : "pointer", border: "none", opacity: (!name.trim() || !email.trim()) ? 0.5 : 1, transition: "opacity 0.3s" }}>Continuar no WhatsApp</button>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 14 }}>Você será redirecionado para o WhatsApp para finalizar.</p>
      </div>
    </div>
  );
}

/* ═══ COMMUNITY SCREENSHOTS ═══ */
function CommunityShowcase() {
  const screens = [
    { src: "/club-screen-1.png", alt: "The Portal & Core", rotate: -3, ty: 12, w: "28%" },
    { src: "/club-screen-2.png", alt: "The Sanctum & Duck Tank", rotate: 0, ty: 0, w: "32%", featured: true },
    { src: "/club-screen-3.png", alt: "Languages & Tools", rotate: 3, ty: 12, w: "28%" },
  ];
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />
      <div className="screenshots-row" style={{ display: "flex", justifyContent: "center", gap: "2%", alignItems: "flex-end" }}>
        {screens.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            style={{
              width: s.w,
              maxWidth: 260,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              border: s.featured ? "1px solid rgba(201,168,76,0.15)" : "1px solid rgba(255,255,255,0.08)",
              transform: `rotate(${s.rotate}deg) translateY(${s.ty}px)`,
              position: "relative" as const,
              zIndex: s.featured ? 3 : 1,
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(10,10,10,0.4) 100%)", zIndex: 2, pointerEvents: "none" }} />
              <img src={s.src} alt={s.alt} style={{ width: "100%", height: "auto", display: "block", filter: s.featured ? "brightness(0.95)" : "brightness(0.85)" }} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Redacted Intel Card ─── */
function RedactedCard({ title, preview, classification, expires }: { title: string; preview: string; classification: string; expires?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px 24px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.06)"}`,
        cursor: "default",
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,168,76,0.4)" }}>{classification}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {expires && <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,80,80,0.6)", padding: "2px 7px", borderRadius: 4, border: "1px solid rgba(255,80,80,0.15)", background: "rgba(255,80,80,0.04)" }}>expira em {expires}</span>}
          <Lock size={12} color="rgba(201,168,76,0.3)" />
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, fontFamily: SANS, color: "white", marginBottom: 8 }}>{title}</div>
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.35)", margin: 0 }}>{preview}</p>
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: hovered ? "40%" : "60%",
          background: hovered
            ? "linear-gradient(0deg, rgba(10,10,10,0.95) 0%, transparent 100%)"
            : "linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.9) 50%, transparent 100%)",
          transition: "all 0.5s ease",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 4,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: hovered ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.2)", transition: "color 0.3s" }}>
            {hovered ? "Entre no clube para desbloquear" : "Conteúdo classificado"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Language Card with lock/unlock ─── */
function LanguageCard({ flag, lang, unlock, delay }: { flag: string; lang: string; unlock: string; delay: number }) {
  const [locked, setLocked] = useState(true);
  return (
    <Fade delay={delay}>
      <div
        onMouseEnter={() => setLocked(false)}
        onMouseLeave={() => setLocked(true)}
        style={{ padding: "20px 18px", borderRadius: 12, background: locked ? "rgba(255,255,255,0.02)" : "rgba(201,168,76,0.03)", border: locked ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(201,168,76,0.2)", textAlign: "center", transition: "all 0.3s", cursor: "default", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div style={{ position: "relative", display: "inline-block", marginBottom: 6 }}>
          <span style={{ fontSize: 32 }}>{flag}</span>
          <span style={{ position: "absolute", top: -6, right: -12, fontSize: 11, transition: "all 0.3s", transform: locked ? "rotate(0deg)" : "rotate(15deg)" }}>
            {locked ? "🔒" : "🔓"}
          </span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, fontFamily: SANS, color: "white", marginBottom: 6 }}>{lang}</div>
        <div style={{ fontSize: 11, lineHeight: 1.5, color: locked ? "rgba(255,255,255,0.3)" : "rgba(201,168,76,0.5)", transition: "color 0.3s" }}>{unlock}</div>
      </div>
    </Fade>
  );
}

/* ─── Pillar Card with intel preview ─── */
function PillarCard({ num, icon: Icon, title, desc, delay }: { num: string; icon: React.ComponentType<{ size: number; color: string }>; title: string; desc: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Fade delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ padding: 24, borderRadius: 12, background: hovered ? "rgba(201,168,76,0.03)" : "rgba(255,255,255,0.02)", border: `1px solid ${hovered ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.12)"}`, height: "100%", transition: "all 0.3s" }}
        className="pillar-card"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <Icon size={18} color={GOLD} />
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(201,168,76,0.4)", marginBottom: 2 }}>{num}</div>
            <div style={{ fontSize: 17, fontWeight: 600, fontFamily: SANS }}>{title}</div>
          </div>
        </div>
        <div className="pillar-desc" style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.45)" }}>{desc}</div>
      </div>
    </Fade>
  );
}

/* ─── Decrypt Text (cinematic) ─── */
function DecryptText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const [output, setOutput] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const cancelled = useRef(false);

  const hex = "0123456789abcdef";
  const rand = () => hex[Math.floor(Math.random() * hex.length)];

  useEffect(() => {
    const t = setTimeout(() => setPhase("running"), delay);
    return () => { clearTimeout(t); cancelled.current = true; };
  }, [delay]);

  useEffect(() => {
    if (phase !== "running") return;
    cancelled.current = false;

    // State: which chars are locked
    const locked = new Array(text.length).fill(false);
    text.split("").forEach((c, i) => { if (c === " ") locked[i] = true; });
    let cursor = 0; // next char to lock
    let tick = 0;

    const render = () => {
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (locked[i]) { s += text[i]; }
        else if (i < cursor + 3) { s += rand(); } // scramble zone
        else { s += " "; }
      }
      return s;
    };

    const iv = setInterval(() => {
      if (cancelled.current) { clearInterval(iv); return; }
      tick++;

      // Every 3 ticks, lock the next non-space char
      if (tick % 3 === 0) {
        while (cursor < text.length && locked[cursor]) cursor++;
        if (cursor < text.length) { locked[cursor] = true; cursor++; }
      }

      // Check if all locked
      if (locked.every(Boolean)) {
        clearInterval(iv);
        setOutput(text);
        setPhase("done");
        return;
      }

      setOutput(render());
    }, 25);

    // Safety fallback
    const safety = setTimeout(() => { clearInterval(iv); setOutput(text); setPhase("done"); }, 4000);

    return () => { cancelled.current = true; clearInterval(iv); clearTimeout(safety); };
  }, [phase, text]);

  if (phase === "idle") return <span className={className}>{"\u00A0"}</span>;
  if (phase === "done") return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {output.split("").map((c, i) => {
        const isReal = i < text.length && c === text[i];
        return (
          <span key={i} style={{ color: isReal ? "inherit" : GOLD, opacity: isReal ? 1 : 0.35, transition: "color 0.1s, opacity 0.1s" }}>{c}</span>
        );
      })}
    </span>
  );
}

/* ─── Intelligence Ticker ─── */
function IntelTicker() {
  const items = [
    "AI OPS · Automação de prospecção com IA · workflow ativo",
    "DEAL · Rev share fechado entre membros · esta semana",
    "CHINA OPS · Fornecedor ████████ · preço 40% abaixo · verificado",
    "AI BUILD · Membro construindo SaaS com vibe coding · em andamento",
    "OPSEC · Vulnerabilidade crítica em ████ wallet · alerta membros",
    "DEAL · Parceria cross-border entre 2 membros · em execução",
    "SIGNAL · Risco de desvalorização CNY · corredor HK ativo",
    "LANGUAGES · Novo módulo de Mandarin business · disponível",
    "MACRO · Fluxo de capital saindo da Europa · oportunidade detectada",
    "GLOBAL · Nova jurisdição offshore aberta · briefing disponível",
    "AI OPS · Análise de mercado automatizada com IA · publicado",
    "NETWORK · Deal cross-border fechado entre membros · esta semana",
  ];

  const duplicated = [...items, ...items];

  return (
    <div className="intel-ticker" style={{
      width: "100%",
      overflow: "hidden",
      padding: "14px 0",
      borderTop: "1px solid rgba(201,168,76,0.06)",
      borderBottom: "1px solid rgba(201,168,76,0.06)",
      background: "rgba(201,168,76,0.02)",
      position: "relative",
      zIndex: 1,
    }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}
      >
        {duplicated.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9A84C", opacity: 0.4, display: "inline-block" }} />
            <span style={{ fontSize: 12, letterSpacing: "0.05em", color: "rgba(201,168,76,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Geo Intelligence Badge ─── */
function GeoIntel() {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city && data.country_name) {
          setLocation(data.city + ", " + data.country_name);
        }
      } catch {
        // silently fail
      }
    };
    const timer = setTimeout(fetchGeo, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="geo-intel"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        padding: "6px 14px",
        borderRadius: 20,
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.08)",
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
        <div style={{ position: "absolute", inset: 0, width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", animation: "geoPing 2s infinite" }} />
      </div>
      <span style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>
        Conexão segura de {location}
      </span>
    </motion.div>
  );
}

/* ─── Floating CTA Mobile ─── */
function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (typeof window !== "undefined" && window.innerWidth > 768) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="floating-cta"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        padding: "12px 20px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        background: "linear-gradient(0deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.9) 100%)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <button
        onClick={() => { const el = document.getElementById("pricing"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 8,
          background: "linear-gradient(135deg, #C9A84C, #A0832A)",
          color: "#0A0A0A",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: SANS,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          border: "none",
          cursor: "pointer",
        }}
      >
        Ver meu acesso →
      </button>
    </motion.div>
  );
}

/* ─── Cursor Spotlight ─── */
function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseleave", leave); };
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <div style={{
      position: "fixed",
      left: pos.x - 150,
      top: pos.y - 150,
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 30%, transparent 70%)",
      pointerEvents: "none",
      zIndex: 45,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
      transform: "translate3d(0,0,0)",
    }} />
  );
}

/* ─── Gold Particles ─── */
function GoldParticles() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 8 : 18;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 20,
    size: 2 + Math.random() * 3,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, typeof window !== "undefined" ? -window.innerHeight : -1000], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#C9A84C",
          }}
        />
      ))}
    </div>
  );
}


/* ─── Blur Reveal ─── */
function BlurReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
      animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════
   PRICING SECTION (two cards)
═══════════════════════════════ */
function PricingSection() {
  const baseFeatures: [string, string | null][] = [
    ["Conteúdo de IA e ferramentas", null],
    ["Networking entre membros", null],
    ["Geopolítica e leitura de cenário", null],
    ["Comunidade no app e desktop", null],
    ["Acesso imediato", null],
    ["Idiomas disponíveis por +US$5/mês", null],
  ];

  const premiumFeatures: [string, string | null][] = [
    ["Tudo do Base", null],
    ["Lives exclusivas + Q&A direto", null],
    ["Contato direto com o fundador via WhatsApp", null],
    ["IA avançada", "vibe coding, automação, construção"],
    ["Deals, rev share e parcerias entre membros", null],
    ["China Ops", "sourcing, feiras, empresa em HK"],
    ["Crypto e offshore", "OPSEC, estruturas"],
    ["2 idiomas completos incluídos", null],
    ["Ebooks e materiais exclusivos incluídos", null],
  ];

  const featureRow = (name: string, sub: string | null, gold: boolean) => (
    <div key={name} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ color: GOLD, fontSize: 13, marginTop: 2, flexShrink: 0 }}>→</span>
      <span style={{ fontSize: 14, lineHeight: 1.5, color: gold ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.55)" }}>
        {name}{sub && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}> ({sub})</span>}
      </span>
    </div>
  );

  return (
    <section id="pricing" style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Fade>
          <BlurReveal>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 12 }}>
              <TextReveal text="Escolha seu nível de" delay={0} />
              {" "}
              <TextReveal text="acesso" gold italic delay={0.4} />
            </h2>
          </BlurReveal>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>Cancele quando quiser. Sem contrato.</p>
        </Fade>

        {/* Two cards grid */}
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* BASE card */}
          <Fade>
            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(201,168,76,0.15)" }}
              transition={{ duration: 0.2 }}
              style={{ padding: 24, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)", display: "flex", flexDirection: "column", height: "100%" }}
            >
              <span style={{ display: "inline-flex", alignSelf: "flex-start", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontFamily: SANS }}>Base</span>

              <div style={{ marginTop: 20, marginBottom: 4 }}>
                <span style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 600, fontFamily: SANS }}>US$15</span>
                <span style={{ fontSize: 14, marginLeft: 4, color: "rgba(255,255,255,0.35)" }}>/mês</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 24, marginTop: 0 }}>aprox. R$79/mês</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1 }}>
                {baseFeatures.map(([n, s]) => featureRow(n, s, false))}
              </div>

              {/* Outline CTA */}
              <a
                href="https://app.duckduck.club/checkout/base-access"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "100%", padding: "14px 0", borderRadius: 12,
                  border: `1px solid rgba(201,168,76,0.3)`, background: "transparent",
                  color: GOLD, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase",
                  fontFamily: SANS, fontWeight: 600, textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.background = "transparent"; }}
              >
                Escolher Base
              </a>
            </motion.div>
          </Fade>

          {/* PREMIUM card */}
          <Fade delay={100}>
            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(201,168,76,0.4)" }}
              transition={{ duration: 0.2 }}
              style={{ padding: 24, borderRadius: 12, background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}
            >
              {/* Glow */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", transform: "translate(30%, -30%)", pointerEvents: "none" }} />

              {/* Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>
                <span style={{ display: "inline-flex", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 9999, border: `1px solid ${GOLD}`, background: "rgba(201,168,76,0.1)", color: GOLD, fontFamily: SANS }}>Premium</span>
                <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>★ Mais popular</span>
              </div>

              <div style={{ marginTop: 20, marginBottom: 4 }}>
                <span style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 600, fontFamily: SANS, color: GOLD }}>US$29</span>
                <span style={{ fontSize: 14, marginLeft: 4, color: "rgba(201,168,76,0.5)" }}>/mês</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(201,168,76,0.35)", marginBottom: 24, marginTop: 0 }}>aprox. R$149/mês</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1 }}>
                {premiumFeatures.map(([n, s]) => featureRow(n, s, true))}
              </div>

              {/* Gold CTA */}
              <a
                href="https://app.duckduck.club/checkout/premium-access"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "100%", padding: "14px 0", borderRadius: 12,
                  border: "none", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`,
                  color: "#0A0A0A", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase",
                  fontFamily: SANS, fontWeight: 600, textDecoration: "none",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                Garantir meu acesso
              </a>
            </motion.div>
          </Fade>
        </div>

        {/* Payment note */}
        <Fade delay={200}>
          <p className="pricing-note" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: "24px 0 0" }}>Cobrança via Stripe · Cancele quando quiser</p>
        </Fade>

        {/* Pix + Crypto inline */}
        <Fade delay={300}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "16px 0 0" }}>
            <span style={{ color: "#32BCAD", fontWeight: 600 }}>Pix</span>
            {" · "}
            <span style={{ color: "#F7931A", fontWeight: 600 }}>Crypto</span>
            {" — Pagamento direto pelo WhatsApp. "}
            <a
              href={`https://wa.me/15615966097?text=${encodeURIComponent("Olá! Quero entrar no DuckDuck Club e pagar com Pix ou crypto.")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#32BCAD", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Falar no WhatsApp →</a>
          </p>
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════
   FAQ SECTION (accordion)
═══════════════════════════════ */
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items = [
    { q: "O que eu recebo ao entrar?", a: "Acesso imediato à plataforma (app e desktop) com: IA e ferramentas, deals e networking, idiomas pra negócios, China ops, crypto e offshore, geopolítica. No Premium, tudo isso mais 2 idiomas completos e acesso avançado." },
    { q: "Como funciona o pagamento?", a: "Cobrança mensal via Stripe (cartão internacional). Também aceita Pix e crypto com atendimento direto via WhatsApp." },
    { q: "Posso cancelar quando quiser?", a: "Sim. Sem contrato, sem multa. Cancela direto na plataforma." },
  ];
  return (
    <section style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Fade>
          <BlurReveal>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 40 }}>
              <TextReveal text="Perguntas" delay={0} />
              {" "}
              <TextReveal text="frequentes" gold italic delay={0.3} />
            </h2>
          </BlurReveal>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => (
            <Fade key={i} delay={i * 40}>
              <FAQItem q={item.q} a={item.a} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [whatsappForm, setWhatsappForm] = useState<{ plan: string; method: string; totalUSD: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollY, scrollYProgress: pageProgress } = useScroll();
  const heroGlowY = useTransform(scrollY, [0, 600], [0, 100]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const dot = (gold = false) => <div style={{ width: 6, height: 6, borderRadius: 3, background: gold ? GOLD : "rgba(255,255,255,0.25)", flexShrink: 0 }} />;

  if (!mounted) return null;

  return (
    <>
      <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #C9A84C, #E8D48B)", zIndex: 50, scaleX: pageProgress, transformOrigin: "left" }} />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <div className="grain-overlay" />
          <CursorSpotlight />
          <GoldParticles />
          <FloatingCTA />

          <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
          {checkout && <CheckoutModal plan={checkout} onClose={() => setCheckout(null)} onWhatsApp={(p, m, t) => { setCheckout(null); setTimeout(() => setWhatsappForm({ plan: p, method: m, totalUSD: t }), 200); }} />}
          {whatsappForm && <WhatsAppFormModal plan={whatsappForm.plan} method={whatsappForm.method} totalUSD={whatsappForm.totalUSD} onClose={() => setWhatsappForm(null)} />}

          {/* Ambient glow with parallax */}
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            <motion.div style={{ position: "absolute", top: "-20%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", y: heroGlowY }} />
            <div style={{ position: "absolute", bottom: "-10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.02) 0%, transparent 70%)" }} />
          </div>

          {/* NAV — slide down */}
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, transition: "background 0.5s, backdrop-filter 0.5s, border-color 0.5s", background: scrolled ? "rgba(10,10,10,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "1px solid transparent" }}
          >
            <div style={{ maxWidth: 1152, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Logo size={30} />
                <span style={{ color: "white", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: SANS }}>DuckDuck Club</span>
                <div className="privacy-badge" style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 0, padding: "3px 10px", borderRadius: 20, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.1)" }}>
                  <Lock size={10} color="rgba(74,222,128,0.6)" />
                  <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(74,222,128,0.5)" }}>Private</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }} className="desktop-nav">
                <button onClick={() => scrollTo("pricing")} style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 8, background: "rgba(201,168,76,0.1)", color: GOLD, border: "1px solid rgba(201,168,76,0.2)", fontFamily: SANS, cursor: "pointer", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.15)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}>
                  Ver meu acesso
                </button>
              </div>
              <button onClick={() => setMenuOpen(true)} className="mobile-menu" style={{ background: "none", border: "none", cursor: "pointer", display: "none" }}><Menu size={22} color="rgba(255,255,255,0.6)" /></button>
            </div>
          </motion.nav>

          {/* Responsive CSS */}
          <style>{`
            @media (max-width: 1024px) and (min-width: 769px) {
              .pillar-grid { grid-template-columns: 1fr 1fr !important; }
            }
            @media (max-width: 768px) {
              /* Nav — keep desktop layout, no hamburger */
              .mobile-menu { display: none !important; }

              /* Global */
              html, body { overflow-x: hidden !important; }
              section { padding-left: 16px !important; padding-right: 16px !important; }

              /* Hero */
              .hero-tags { display: grid !important; grid-template-columns: 1fr 1fr !important; flex-direction: unset !important; gap: 6px !important; margin-top: 20px !important; }
              .hero-pill { font-size: 10px !important; padding: 6px 10px !important; text-align: center !important; min-height: 34px !important; }
              .hero-break { display: block; height: 16px; }

              /* Grids → 1 column */
              .pillar-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
              .pillar-card { padding: 16px !important; }
              .pillar-desc { display: none !important; }
              .pillar-card > div:first-child { margin-bottom: 0 !important; }
              .for-you-grid { grid-template-columns: 1fr !important; }
              .pricing-grid { grid-template-columns: 1fr !important; }
              .pricing-grid > div:last-child { order: -1; }
              .problem-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
              .problem-grid > div > div { padding: 16px !important; }
              .founder-grid { grid-template-columns: 1fr !important; text-align: center; }
              .redacted-grid { grid-template-columns: 1fr !important; }

              /* Founder */
              .founder-photo { width: 150px !important; height: 150px !important; min-width: 150px !important; }

              /* Screenshots — horizontal scroll */
              .screenshots-row { gap: 8px !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory !important; -webkit-overflow-scrolling: touch; padding-bottom: 8px !important; }
              .screenshots-row > div { flex-shrink: 0 !important; width: 70% !important; border-radius: 12px !important; transform: none !important; scroll-snap-align: center !important; }

              /* Pricing */
              .pricing-note { font-size: 10px !important; }

              /* Checkout modal */
              .checkout-modal { max-width: 100% !important; margin: 0 !important; border-radius: 20px 20px 0 0 !important; position: fixed !important; bottom: 0 !important; padding: 24px !important; max-height: 90vh !important; overflow-y: auto !important; }

              /* Privacy */
              .privacy-badge { display: none !important; }

              /* Hero CTA normal size */
              .cta-glow { width: auto !important; max-width: fit-content !important; display: inline-flex !important; padding: 14px 40px !important; margin: 0 auto !important; }

              /* FAQ tighter padding */
              .faq-item > div:first-child { padding: 16px 16px !important; }
              .faq-item > div:last-child { padding: 0 16px 16px !important; }

              /* Pricing cards full-width buttons */
              .pricing-grid a { width: 100% !important; }

              /* Mobile hide */
              .mobile-hide { display: none !important; }

              /* Founder mobile — stats visible */
              .founder-stats { font-size: 11px !important; }
            }
            .hero-break { display: none; }
            input::placeholder { color: rgba(255,255,255,0.25) !important; }
            input:focus { border-color: rgba(201,168,76,0.3) !important; outline: none !important; }
          `}</style>

          {/* ═══ 1. HERO ═══ */}
          <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", zIndex: 1, overflow: "hidden" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}
            >
              <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", background: "#0A0A0A" }}>
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,1) 100%)" }} />
            <div style={{ maxWidth: 896, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
              <GeoIntel />
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                style={{ marginTop: 40, marginBottom: 28, fontSize: "clamp(28px, 8vw, 72px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF }}
              >
                <DecryptText text="Você não está atrasado." delay={800} />
                <br />
                <span className="gold-shimmer" style={{ fontStyle: "italic" }}>
                  <DecryptText text="Você está no grupo errado." delay={2200} />
                </span>
              </motion.h1>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 3.8 }}>
                <p style={{ maxWidth: 640, margin: "0 auto 40px", fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)" }}>
                  Um ecossistema privado pra quem quer operar no mundo com mais direção, mais linguagem e mais acesso.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 4.2 }} style={{ textAlign: "center" }}>
                <GoldButton href="pricing" className="cta-glow">Ver meu acesso</GoldButton>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 4.6 }}
                className="hero-tags"
                style={{ marginTop: 48, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}
              >
                {["Inteligência Artificial", "Deals & Networking", "Idiomas pra negócios", "China Ops", "Crypto & Offshore", "Geopolítica"].map(t => (
                  <span key={t} className="hero-pill" style={{ fontSize: 12, padding: "8px 16px", borderRadius: 9999, border: "1px solid rgba(201,168,76,0.12)", background: "rgba(201,168,76,0.03)", color: "rgba(255,255,255,0.45)", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{t}</span>
                ))}
              </motion.div>
            </div>
          </section>

          <AnimatedDivider />
          <IntelTicker />

          {/* ═══ 2. O PROBLEMA ═══ */}
          <section id="about" style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Fade>
                <Badge>O problema</Badge>
                <BlurReveal>
                  <h2 style={{ marginTop: 20, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 40 }}>
                    <TextReveal text="Todo mundo quer crescer." delay={0} />
                    <br />
                    <TextReveal text="Quase ninguém sabe como." gold italic delay={0.4} />
                  </h2>
                </BlurReveal>
              </Fade>
              <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { t: "Conteúdo Sem Direção", d: "Consome o dia inteiro mas não sabe o que fazer com tanta informação. Falta filtro, falta contexto." },
                  { t: "Network Sem Valor", d: "Seguidores não são conexões. Sem as pessoas certas por perto, as oportunidades não chegam." },
                  { t: "Sem Idioma, Sem Mesa", d: "O mundo opera em inglês, mandarim e espanhol. Quem só fala português fica de fora das melhores mesas." },
                  { t: "IA Passou e Você Não Viu", d: "Quem domina IA já opera 10x mais rápido. A distância entre quem usa e quem não usa só aumenta." },
                ].map((item, i) => (
                  <Fade key={item.t} delay={i * 80}>
                    <div style={{ padding: 24, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)", borderLeft: "3px solid rgba(201,168,76,0.5)", height: "100%" }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: SANS, margin: "0 0 8px", color: "white" }}>{item.t}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.4)", margin: 0 }}>{item.d}</p>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ 3. POR DENTRO ═══ */}
          <section id="inside" style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Fade>
                <Badge>Por dentro</Badge>
                <BlurReveal>
                  <h2 style={{ marginTop: 20, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 12 }}>
                    <TextReveal text="O que você encontra" delay={0} />
                    {" "}
                    <TextReveal text="ao entrar" gold italic delay={0.4} />
                  </h2>
                </BlurReveal>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginBottom: 40, maxWidth: 600 }}>
                  Seis frentes. Uma posição melhor que ontem.
                </p>
              </Fade>
              <div className="pillar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { num: "01", icon: Cpu, title: "Inteligência Artificial", desc: "IA pra negócios, vibe coding, automação, análise de mercado e construção de produtos. Workflows reais, não teoria." },
                  { num: "02", icon: Handshake, title: "Deals & Networking", desc: "Parcerias, rev share, oportunidades e conexão direta com operadores. Membros fechando deals entre si toda semana." },
                  { num: "03", icon: BookOpen, title: "Idiomas", desc: "8 idiomas com material curado pra negócios. Vocabulário de negociação, contratos e operação real." },
                  { num: "04", icon: Globe, title: "China Ops", desc: "Sourcing, fornecedores, feiras, importação e abertura de empresa em Hong Kong. Por quem está lá." },
                  { num: "05", icon: Shield, title: "Crypto & Offshore", desc: "Estruturas internacionais, proteção patrimonial, OPSEC e operações com privacidade real." },
                  { num: "06", icon: Compass, title: "Geopolítica", desc: "Leitura de cenário e contexto estratégico pra antecipar enquanto a maioria ainda está reagindo." },
                ].map((item, i) => (
                  <PillarCard key={item.title} num={item.num} icon={item.icon} title={item.title} desc={item.desc} delay={i * 60} />
                ))}
              </div>
              <Fade delay={350}><div style={{ marginTop: 48 }}><GoldButton href="pricing">Entrar no ecossistema</GoldButton></div></Fade>
            </div>
          </section>

          <AnimatedDivider />

          {/* ═══ 5. COMMUNITY SCREENSHOTS ═══ */}
          <section style={{ position: "relative", padding: "80px 24px", overflow: "hidden", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Fade>
                <Badge>O ambiente</Badge>
                <BlurReveal>
                  <h2 style={{ marginTop: 20, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 12 }}>
                    <TextReveal text="Um ecossistema" delay={0} />
                    {" "}
                    <TextReveal text="real e organizado." gold italic delay={0.3} />
                  </h2>
                </BlurReveal>
                <p style={{ fontSize: 15, maxWidth: 600, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>É assim que o clube é organizado por dentro.</p>
              </Fade>
              <Fade delay={200}><CommunityShowcase /></Fade>
              <Fade delay={350}><p style={{ marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Plataforma via app e desktop · Acesso imediato após checkout</p></Fade>
            </div>
          </section>

          <AnimatedDivider />

          {/* ═══ 5. CLASSIFICADO — REDACTED INTEL ═══ */}
          <section style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Fade>
                <Badge>Classificado</Badge>
                <h2 style={{ marginTop: 20, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 12 }}>
                  O que está sendo discutido <span className="gold-shimmer" style={{ fontStyle: "italic" }}>agora lá dentro.</span>
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginBottom: 40, maxWidth: 600 }}>
                  Teasers reais do ecossistema. O conteúdo completo é exclusivo para membros.
                </p>
              </Fade>
              <div className="redacted-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <Fade delay={0}><RedactedCard classification="AI OPS" title="10 workflows de IA que economizam 10+ horas por semana" preview="Prompts, estruturas e sistemas reais que uso pra pesquisa, análise, conteúdo e automação." expires="3 dias" /></Fade>
                <Fade delay={100}><div className="mobile-hide"><RedactedCard classification="OPSEC · Crypto" title="Como receber pagamentos em carteira descentralizada com privacidade" preview="Sem Pix, sem CPF, sem rastreio. O protocolo completo pra operar com privacidade real." expires="2 dias" /></div></Fade>
                <Fade delay={200}><div className="mobile-hide"><RedactedCard classification="Intel · Decisão" title="A matemática invisível por trás de quase toda decisão" preview="O framework pra parar de decidir no instinto e começar a decidir com dados." expires="6 dias" /></div></Fade>
              </div>
            </div>
          </section>

          <AnimatedDivider />

          {/* ═══ 6. SOBRE O CRIADOR ═══ */}
          <section style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Fade>
                <Badge>Sobre o criador</Badge>
                <div className="founder-grid" style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src="/founder-photo.jpeg" alt="Nando Voyager — Founder" className="founder-photo" style={{ width: 320, height: 320, minWidth: 320, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(201,168,76,0.3)" }} />
                    <p style={{ fontSize: 18, fontWeight: 500, fontFamily: SANS, color: "white", marginTop: 20, marginBottom: 4 }}>Nando Voyager</p>
                    <a href="https://instagram.com/nandovoyager" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: GOLD, textDecoration: "none", opacity: 0.85, transition: "opacity 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}>@nandovoyager</a>
                  </div>
                  <div>
                    <BlurReveal>
                      <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 300, lineHeight: 1.2, fontFamily: SERIF, marginBottom: 20 }}>
                        <TextReveal text="A DuckDuck Club nasceu da interseção entre" delay={0} />
                        {" "}
                        <TextReveal text="contexto global, operação real e construção de valor." gold italic delay={0.5} />
                      </h2>
                    </BlurReveal>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 0 }}>
                      Saí do Brasil aos 18. Morei nos EUA, Itália, Austrália, China e Coreia. Abri empresa em Hong Kong. Tudo antes dos 22. Criei esse ecossistema pra quem quer parar de improvisar e começar a operar de verdade.
                    </p>
                    <p className="founder-stats" style={{ fontSize: 13, color: GOLD, letterSpacing: "0.08em", marginTop: 16, marginBottom: 0, opacity: 0.7 }}>22 anos · 6 países · 4 idiomas · 30+ países visitados</p>
                  </div>
                </div>
              </Fade>
            </div>
          </section>

          <AnimatedDivider />

          {/* ═══ 6. PARA VOCÊ SE... ═══ */}
          <section style={{ position: "relative", padding: "80px 24px", zIndex: 1 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Fade>
                <BlurReveal>
                  <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, fontFamily: SERIF, marginBottom: 40 }}>
                    <TextReveal text="Isso é para você se" delay={0} />
                    <span className="gold-shimmer">...</span>
                  </h2>
                </BlurReveal>
              </Fade>
              <div className="for-you-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Fade>
                  <div style={{ padding: 24, borderRadius: 12, background: "rgba(201,168,76,0.02)", border: "1px solid rgba(201,168,76,0.12)", height: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {["Quer usar IA pra construir e operar mais rápido", "Quer networking real — deals, parcerias e rev share", "Quer aprender idiomas pra fechar negócios, não pra turismo", "Quer operar global — China, offshore e crypto"].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><Check size={16} color={GOLD} style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>{item}</span></div>
                      ))}
                    </div>
                  </div>
                </Fade>
                <Fade delay={100}>
                  <div style={{ padding: 24, borderRadius: 12, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(201,168,76,0.12)", height: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {["Quer fórmula mágica e resultado sem esforço", "Quer só consumir conteúdo sem aplicar nada", "Acha que um curso de R$29 resolve tudo", "Não quer investir tempo em aprender e executar"].map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><X size={16} color="rgba(255,255,255,0.1)" style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.15)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.08)" }}>{item}</span></div>
                      ))}
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </section>

          <AnimatedDivider />
          <div className="mobile-hide"><IntelTicker /></div>

          {/* ═══ 7. PRICING ═══ */}
          <PricingSection />

          {/* ═══ 8. FAQ ═══ */}
          <FAQSection />

          {/* PRIVACY STATEMENT */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(74,222,128,0.04)", background: "rgba(74,222,128,0.01)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Lock size={12} color="rgba(74,222,128,0.4)" />
            <span style={{ fontSize: 11, letterSpacing: "0.06em", color: "rgba(255,255,255,0.2)" }}>
              Este site não rastreia você. Sem cookies de terceiros. Sua privacidade é o padrão.
            </span>
          </div>

          {/* FOOTER */}
          <footer style={{ position: "relative", padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", zIndex: 1 }}>
            <div style={{ maxWidth: 1024, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>DuckDuck Club · Encrypted · Private · International</span>
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  { label: "Instagram", href: "https://instagram.com/duckduck.club" },
                  { label: "WhatsApp", href: "https://wa.me/15615966097?text=" + encodeURIComponent("Olá, tenho uma dúvida sobre o DuckDuck Club.") },
                ].map(item => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                  >{item.label}</a>
                ))}
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.1)" }}>© 2026 DuckDuck Club · <a href="/termos" style={{ color: "inherit", textDecoration: "none" }}>Termos</a></span>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  );
}
