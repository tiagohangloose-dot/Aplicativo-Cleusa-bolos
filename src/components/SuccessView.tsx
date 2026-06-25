import { useState } from 'react';
import { Pedido } from '../types';
import Confetti from './Confetti';
import { CheckCircle, ArrowLeft, Send, Home, Info, ExternalLink } from 'lucide-react';
import CleusaLogo from './CleusaLogo';
import { generatePixCopyPaste } from '../lib/pix';

interface SuccessViewProps {
  pedido: Pedido;
  onReset: () => void;
}

export default function SuccessView({ pedido, onReset }: SuccessViewProps) {
  const [showSimulatedMessage, setShowSimulatedMessage] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const showToast = (message: string) => {
    setCopyFeedback(message);
    setTimeout(() => {
      setCopyFeedback(null);
    }, 3000);
  };

  const total = pedido.total;
  const sinal = total * 0.3;
  const restante = total * 0.7;

  // Generate a beautiful formatted whatsapp message text for Cleusa
  const customMessage = `Olá Dona Cleusa! Acabei de enviar um pedido pelo aplicativo:
*Código:* ${pedido.codigo}
*Cliente:* ${pedido.clienteNome}
${pedido.massa ? `*Massa:* ${pedido.massa === 'preta' ? 'Preta (Chocolate) 🍫' : 'Branca 🍞'}` : ''}
*Recheio/Bolo:* ${pedido.saborNome}
*Tamanho:* ${pedido.tamanhoLabel}
*Entrega:* ${pedido.tipoEntrega === 'entrega' ? '🚚 Entrega' : '🏪 Retirada'}
*Data/Hora:* ${new Date(pedido.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às ${pedido.horario}
*Total:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
*Sinal de 30% (Pago via Pix):* R$ ${sinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 💸
*Restante (70%):* R$ ${restante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (na ${pedido.formaPagamento === 'pix' ? 'entrega via Pix' : pedido.formaPagamento === 'cartao' ? 'entrega via Cartão' : 'entrega em Dinheiro'})
*Detalhes:* ${pedido.detalhes || 'Nenhum'}

_(Vou enviar o comprovante do sinal de 30% em seguida!)_`;


  const handleWhatsAppAction = () => {
    // Standard URL format targeting Dona Cleusa's number
    const encodedText = encodeURIComponent(customMessage);
    const url = `https://api.whatsapp.com/send?phone=5512988275469&text=${encodedText}`;
    
    // Attempt opening in a secure new tab
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn("Iframe blocked direct window.open redirection.", e);
    }
    
    // Open internal beautiful simulator popup as a backup
    setShowSimulatedMessage(true);
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-700">
      <Confetti />

      {/* Floating Toast notification */}
      {copyFeedback && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-secondary text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-outline/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span>✨</span>
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* Success Hero Title with Cleusa Logo */}
      <div className="text-center mb-8 flex flex-col items-center">
        <CleusaLogo variant="vertical" size="sm" className="mb-4" />
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-container text-secondary mb-3 shadow-[0px_4px_15px_rgba(97,21,42,0.1)]">
          <CheckCircle className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-secondary font-bold tracking-tight mb-2">
          Pedido Recebido!
        </h2>
        <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          Obrigado pelo seu pedido. Ele já foi registrado na nossa agenda e está pronto para ser enviado por você pelo WhatsApp para a Dona Cleusa.
        </p>
      </div>

      {/* Structured Order Summary Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-primary-container/20 rounded-full blur-2xl"></div>
        
        <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-2">
          Resumo do Pedido
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
            <span className="text-on-surface-variant text-sm">Cliente</span>
            <span className="font-label-md text-on-surface font-semibold">{pedido.clienteNome}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
            <span className="text-on-surface-variant text-sm">Sabor (Recheio)</span>
            <span className="font-label-md text-on-surface text-right font-semibold">{pedido.saborNome}</span>
          </div>

          {pedido.massa && (
            <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
              <span className="text-on-surface-variant text-sm">Massa do Bolo</span>
              <span className="font-label-md text-on-surface font-semibold capitalize">
                {pedido.massa === 'preta' ? '🍫 Preta (Chocolate)' : '🍞 Branca'}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
            <span className="text-on-surface-variant text-sm">Tamanho</span>
            <span className="font-label-md text-on-surface font-semibold">{pedido.tamanhoLabel}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
            <span className="text-on-surface-variant text-sm">Data/Hora</span>
            <span className="font-label-md text-on-surface font-semibold">
              {new Date(pedido.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {pedido.horario}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-outline-variant/5">
            <span className="text-on-surface-variant text-sm">Forma de Pagamento</span>
            <span className="font-label-md text-on-surface font-semibold uppercase text-xs">
              {pedido.formaPagamento === 'pix' ? '📱 Pix' : pedido.formaPagamento === 'cartao' ? '💳 Cartão' : '💵 Dinheiro'}
            </span>
          </div>

          {pedido.detalhes && (
            <div className="flex justify-between items-start py-1 border-b border-outline-variant/5">
              <span className="text-on-surface-variant text-sm shrink-0">Observação</span>
              <span className="font-sans text-xs text-on-surface-variant text-right italic max-w-[200px] break-words">
                "{pedido.detalhes}"
              </span>
            </div>
          )}

          <div className="pt-4 flex justify-between items-center">
            <span className="font-serif text-2xl text-secondary">Total</span>
            <span className="font-serif text-2xl font-bold text-tertiary">
              R$ {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 30% Advance PIX Payment Card (Required for everyone to secure reservation) */}
      <div className="bg-primary-container/20 border-2 border-primary rounded-xl p-5 mb-8 space-y-4 animate-in fade-in duration-300 shadow-[0px_4px_20px_rgba(75,54,33,0.05)] text-on-surface">
        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span> Sinal de Reserva Requerido (30%)
          </span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            Aguardando Sinal
          </span>
        </div>
        
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Para confirmar a sua reserva na agenda da Dona Cleusa e iniciarmos a produção do seu bolo, <strong>é necessário realizar o pagamento do sinal de 30% do valor total via Pix agora</strong>. O valor restante poderá ser pago na entrega ou retirada.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-1">
          <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 flex flex-col justify-between">
            <span className="text-[10px] text-outline/80 font-bold uppercase tracking-wider">Chave Pix Celular</span>
            <span className="text-[11px] font-bold text-on-surface font-mono mt-1">(12) 98827-5469</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("12988275469");
                showToast("Chave Pix de Celular copiada!");
              }}
              className="mt-2 text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1 self-start text-left"
            >
              <span>Copiar Celular</span>
            </button>
          </div>

          <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 flex flex-col justify-between">
            <span className="text-[10px] text-outline/80 font-bold uppercase tracking-wider">Sinal de 30% (Pagar Agora)</span>
            <span className="text-sm font-black text-tertiary mt-1">
              R$ {sinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] text-outline mt-1.5 leading-none">30% de R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 flex flex-col justify-between">
            <span className="text-[10px] text-outline/80 font-bold uppercase tracking-wider">Restante (Pagar depois)</span>
            <span className="text-sm font-bold text-on-surface mt-1">
              R$ {restante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] text-outline mt-1.5 leading-none">
              Via {pedido.formaPagamento === 'pix' ? 'Pix' : pedido.formaPagamento === 'cartao' ? 'Cartão' : 'Dinheiro'}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/20 relative">
          <span className="text-[10px] text-outline/80 font-bold uppercase tracking-wider block mb-1.5">
            Código Pix Copia e Cola do Sinal (30%):
          </span>
          <div className="font-mono text-[10px] text-on-surface break-all bg-white/55 p-2 rounded-md border border-outline-variant/10 max-h-[85px] overflow-y-auto select-all leading-normal">
            {generatePixCopyPaste(sinal)}
          </div>
          <div className="flex justify-end mt-2.5">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(generatePixCopyPaste(sinal));
                showToast("Código Pix do Sinal (30%) copiado!");
              }}
              className="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-95 cursor-pointer flex items-center gap-1.5 active:scale-[0.98] transition-all"
            >
              <span>Copiar Pix do Sinal (30%)</span>
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 leading-normal space-y-1">
          <p className="font-bold font-sans">📋 Como confirmar seu pedido em 2 passos rápidos:</p>
          <ol className="list-decimal pl-4 space-y-1 text-[11px] text-amber-800 font-sans">
            <li>Copie e pague o <strong>Pix do Sinal (30%)</strong> acima no app do seu banco.</li>
            <li>Clique no botão verde abaixo <strong>"Enviar para o WhatsApp Cleusa Bolos"</strong> para enviar os dados da reserva. Em seguida, envie o comprovante Pix do adiantamento na conversa!</li>
          </ol>
        </div>
      </div>

      {/* WhatsApp Message Confirmation Alert */}
      <div className="bg-amber-500/15 border-2 border-amber-500 rounded-xl p-4 mb-4 text-xs text-amber-900 leading-normal animate-pulse">
        <div className="flex items-center gap-2 font-black mb-1 text-amber-950">
          <span>🚨</span> IMPORTANTE: SEU PEDIDO NÃO ESTÁ CONFIRMADO AINDA!
        </div>
        <p className="font-medium">
          Dona Cleusa precisa receber a mensagem no WhatsApp para iniciar a produção do bolo. Por favor, clique no botão <strong className="underline text-amber-950">"Enviar para o WhatsApp Cleusa Bolos"</strong> abaixo e clique em "Enviar" no aplicativo do WhatsApp.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handleWhatsAppAction}
          className="w-full h-14 bg-tertiary text-white font-label-md rounded-full flex items-center justify-center gap-2 shadow-md hover:bg-tertiary/90 active:scale-95 transition-all cursor-pointer border border-tertiary/10 font-bold"
        >
          <Send className="w-5 h-5 fill-white text-tertiary" />
          <span>Enviar para o WhatsApp Cleusa Bolos</span>
        </button>

        <button
          onClick={onReset}
          className="w-full h-14 bg-secondary-container text-on-secondary-container font-label-md rounded-full flex items-center justify-center gap-2 hover:bg-secondary-container/80 active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
        >
          <Home className="w-5 h-5 text-secondary" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Simulated Preview Box Modal */}
      {showSimulatedMessage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface p-6 rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant/20 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <Info className="w-6 h-6 text-tertiary" />
              <h3 className="font-serif text-lg font-bold">Comprovante do Pedido</h3>
            </div>
            
            <p className="text-xs text-on-surface-variant mb-4">
              A janela de envio automático do WhatsApp foi aberta numa nova aba! Caso tenha sido bloqueada ou queira ver os detalhes estruturados, aqui está a mensagem enviada de forma idêntica:
            </p>

            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 font-mono text-xs text-on-surface whitespace-pre-wrap leading-relaxed select-all">
              {customMessage}
            </div>

            <p className="text-[10px] text-tertiary mt-2">💡 Dica: Clique no botão abaixo para abrir diretamente o WhatsApp de Dona Cleusa (+55 12 98827-5469).</p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={handleWhatsAppAction}
                className="flex-1 py-3 bg-tertiary text-white text-xs font-bold rounded-lg hover:bg-tertiary/90 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 fill-white text-tertiary" />
                <span>Enviar no WhatsApp</span>
              </button>
              <button
                onClick={() => setShowSimulatedMessage(false)}
                className="px-5 py-3 bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-highest transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artistic Bottom Banner Image */}
      <div className="mt-8 rounded-xl overflow-hidden shadow-lg aspect-[16/9] relative group border border-outline-variant/10">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgm8Ww9FF4UuIIV4mS5CCF1rzWZ-TpARtIhG-Q5ZoiqvPuZ3W2BatsiIeYhoq1LrFPjUqDo5eSLxClwZ2RpmjXLkcHNPkEdYwBIMfod0OKPIhC_7bOnVqRCMp3yF-sLGdAYwqpHfQUChex6La0BHwWe642yGrol6f7Ivq95C9UrNm-D7sDjSXgkJDLrXmf8o4zAMVxdchfs2Y1FK7Xk6hr4y2ODbctk93w0SNa35rHexu3VB-km660W5gljd1HxBd37tUZRYUW7rye"
          alt="Dona Cleusa premium cake showcase"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="text-on-secondary bg-secondary/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
            Feito com Amor
          </span>
        </div>
      </div>
    </div>
  );
}
