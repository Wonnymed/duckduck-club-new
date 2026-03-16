"use client";

import { ArrowLeft } from "lucide-react";

const GOLD = "#C9A84C";
const SERIF = "'Cormorant Garamond', serif";

export default function Termos() {
  return (
    <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 120px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD, textDecoration: "none", fontSize: 13, letterSpacing: "0.1em", marginBottom: 48 }}><ArrowLeft size={16} /> Voltar ao site</a>
        <h1 style={{ fontSize: 36, fontWeight: 300, fontFamily: SERIF, marginBottom: 8 }}>Termos de Uso</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 48 }}>Última atualização: Março 2026</p>
        {[
          { title: "1. Aceitação dos Termos", content: "Ao acessar e utilizar o DuckDuck Club (duckduck.club), incluindo a plataforma da comunidade, conteúdos, materiais e serviços oferecidos, você concorda integralmente com estes Termos de Uso. Se não concordar com qualquer disposição, não utilize a plataforma." },
          { title: "2. Descrição do Serviço", content: "O DuckDuck Club é um ecossistema privado de acesso pago que oferece conteúdo curado, networking, materiais educacionais, inteligência estratégica e recursos relacionados a geopolítica, offshore structures, crypto OPSEC, importação, idiomas e operação global. O serviço é oferecido via plataforma digital com acesso mediante assinatura mensal recorrente." },
          { title: "3. Planos e Pagamento", content: "O DuckDuck Club oferece planos de assinatura mensal (Base e Premium), com possibilidade de add-ons opcionais (idiomas e extensões). Os valores são cobrados em dólares americanos (USD) via Stripe, Pix ou criptomoedas. O valor em reais (BRL) é aproximado e pode variar conforme câmbio e taxas do cartão. A cobrança é recorrente e será realizada mensalmente a partir da data de adesão." },
          { title: "4. Cancelamento", content: "O assinante pode cancelar sua assinatura a qualquer momento diretamente pela plataforma ou entrando em contato via WhatsApp. O cancelamento encerra a renovação automática, mas o acesso permanece ativo até o final do período já pago. Não há reembolso proporcional para períodos parciais." },
          { title: "5. Conteúdo e Propriedade Intelectual", content: "Todo o conteúdo disponibilizado dentro do DuckDuck Club — incluindo textos, análises, cursos, PDFs, materiais de idiomas, vídeos, briefings e qualquer outro material — é de propriedade exclusiva do DuckDuck Club e de seu fundador. É estritamente proibido copiar, reproduzir, distribuir, compartilhar, gravar, baixar ou redistribuir qualquer conteúdo da plataforma, total ou parcialmente, sem autorização expressa por escrito." },
          { title: "6. Conduta do Membro", content: "Ao ingressar no DuckDuck Club, o membro concorda em: manter conduta respeitosa e profissional com outros membros; não compartilhar conteúdo interno fora da plataforma; não utilizar a plataforma para atividades ilegais; não fazer spam, assédio ou qualquer forma de abuso dentro da comunidade. O DuckDuck Club se reserva o direito de remover membros que violem estas regras, sem reembolso." },
          { title: "7. Isenção de Responsabilidade", content: "O conteúdo do DuckDuck Club tem caráter educacional e informativo. Nada do que é compartilhado na plataforma constitui aconselhamento financeiro, jurídico, tributário ou de investimentos. Decisões tomadas com base no conteúdo são de responsabilidade exclusiva do membro. O DuckDuck Club, seu fundador e colaboradores não se responsabilizam por perdas, danos ou prejuízos decorrentes de ações tomadas com base nas informações disponibilizadas." },
          { title: "8. Privacidade e Dados", content: "O DuckDuck Club valoriza a privacidade de seus membros. Não vendemos, compartilhamos ou distribuímos dados pessoais a terceiros. Os dados coletados (nome, email, informações de pagamento) são utilizados exclusivamente para gestão do acesso e comunicação com o membro. O processamento de pagamentos é realizado via Stripe, que opera sob suas próprias políticas de segurança e privacidade. O site duckduck.club não utiliza cookies de terceiros nem ferramentas de rastreamento invasivas." },
          { title: "9. Modificações nos Termos", content: "O DuckDuck Club se reserva o direito de alterar estes Termos a qualquer momento. Alterações relevantes serão comunicadas aos membros. O uso continuado da plataforma após modificações implica aceitação dos novos termos." },
          { title: "10. Jurisdição", content: "Estes termos são regidos pelas leis aplicáveis à jurisdição onde o DuckDuck Club opera. Qualquer disputa será resolvida preferencialmente por negociação direta entre as partes." },
          { title: "11. Contato", content: "Para dúvidas, solicitações ou questões relacionadas a estes Termos, entre em contato via WhatsApp (+1 561-596-6097) ou pelo Instagram @duckduck.club." },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, fontFamily: SERIF, color: GOLD, marginBottom: 12 }}>{section.title}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)" }}>{section.content}</p>
          </div>
        ))}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 DuckDuck Club · Encrypted · Private · International</p>
        </div>
      </div>
    </div>
  );
}
