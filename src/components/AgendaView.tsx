import React, { useState } from 'react';
import { Pedido, BoloSabor } from '../types';
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  Clock3,
  Check,
  Plus,
  X,
  Search,
  ExternalLink,
  ChefHat,
  MessageSquare,
  Trash2
} from 'lucide-react';

interface AgendaViewProps {
  pedidos: Pedido[];
  sabores: BoloSabor[];
  onUpdatePedidoStatus: (pedidoId: string, newStatus: Pedido['status']) => void;
  onAddPedido: (newPedido: Pedido) => void;
  onDeletePedido?: (pedidoId: string) => void;
}

export default function AgendaView({
  pedidos,
  sabores,
  onUpdatePedidoStatus,
  onAddPedido,
  onDeletePedido
}: AgendaViewProps) {
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<'fds' | 'proxima' | 'mes'>('fds');
  // Day filter (Sexta, Sábado, Domingo, or All)
  const [selectedDay, setSelectedDay] = useState <'sexta' | 'sabado' | 'domingo'>('sexta');
  
  // Detalhes modal state
  const [detailedPedidoId, setDetailedPedidoId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  
  // Quick manual add form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNome, setAddNome] = useState('');
  const [addWhats, setAddWhats] = useState('');
  const [addSabor, setAddSabor] = useState(sabores[0]?.nome || '');
  const [addTamanho, setAddTamanho] = useState('M (2kg)');
  const [addData, setAddData] = useState('2026-06-26');
  const [addHora, setAddHora] = useState('14:30');
  const [addTotal, setAddTotal] = useState('145.00');
  const [addNotas, setAddNotas] = useState('');
  const [addFormaPagamento, setAddFormaPagamento] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');

  // 1. Calculate stats based on active calendar segment
  // Mock filter: Weekend of 26-28 June 2026
  const weekendPedidos = pedidos.filter(p => ['2026-06-26', '2026-06-27', '2026-06-28'].includes(p.data));
  const activeWeekendCount = weekendPedidos.length;

  // Day calculations for display badges
  const sextaPedidos = pedidos.filter(p => p.data === '2026-06-26');
  const sabadoPedidos = pedidos.filter(p => p.data === '2026-06-27');
  const domingoPedidos = pedidos.filter(p => p.data === '2026-06-28');

  // Filter current list of orders to display based on active sub-tab
  let displayedPedidos = weekendPedidos;
  if (activeSegmentFilter === 'fds') {
    if (selectedDay === 'sexta') {
      displayedPedidos = sextaPedidos;
    } else if (selectedDay === 'sabado') {
      displayedPedidos = sabadoPedidos;
    } else {
      displayedPedidos = domingoPedidos;
    }
  } else if (activeSegmentFilter === 'proxima') {
    // Mock showing any next week items or a wider window
    displayedPedidos = pedidos.filter(p => !['2026-06-26', '2026-06-27', '2026-06-28'].includes(p.data));
  } else {
    // "Mês" - show all
    displayedPedidos = pedidos;
  }

  const handleOpenWhats = (ped: Pedido) => {
    const text = `Olá ${ped.clienteNome}! Aqui é a Dona Cleusa Bolos. Referente ao seu pedido de ${ped.saborNome} para o dia ${new Date(ped.data + 'T12:00:00').toLocaleDateString('pt-BR')}: o status atual é *${ped.status === 'pendente' ? 'Pendente' : ped.status === 'producao' ? 'Em Produção 👩‍🍳' : 'Entregue / Concluído ✅'}*. Qualquer dúvida nos chame!`;
    window.open(`https://api.whatsapp.com/send?phone=+55${ped.whatsapp}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const detailedPedido = pedidos.find(p => p.id === detailedPedidoId);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addNome || !addWhats) {
      alert("Por favor, preencha o nome e o WhatsApp!");
      return;
    }

    const uniqueCode = "CB-" + Math.floor(1000 + Math.random() * 9000);
    const newPed: Pedido = {
      id: "ord-manual-" + Date.now(),
      codigo: uniqueCode,
      clienteNome: addNome,
      whatsapp: addWhats,
      tipoEntrega: 'retirada',
      data: addData,
      horario: addHora,
      saborId: 'custom',
      saborNome: addSabor,
      tamanhoId: 'custom',
      tamanhoLabel: addTamanho,
      adicionais: addNotas ? [addNotas] : [],
      adicionaisPreco: 0,
      total: parseFloat(addTotal) || 120.00,
      formaPagamento: addFormaPagamento,
      status: 'pendente',
      dataCriacao: new Date().toISOString(),
      detalhes: addNotas
    };

    onAddPedido(newPed);
    setShowAddModal(false);
    
    // reset form
    setAddNome('');
    setAddWhats('');
    setAddNotas('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Dynamic Summary Stats Box (Screen 3 Title Alert) */}
      <div className="bg-amber-100 border border-amber-200/50 p-5 rounded-xl shadow-inner flex items-center gap-4 text-secondary">
        <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
          <ChefHat className="w-6 h-6 text-tertiary" />
        </div>
        <div>
          <span className="block text-[10px] tracking-wider uppercase font-semibold text-on-surface-variant font-sans">
            Status Atual
          </span>
          <h3 className="font-serif text-xl font-bold md:text-2xl text-secondary">
            Total para este FDS: {activeWeekendCount} bolos
          </h3>
        </div>
      </div>

      {/* Main Segment Filter Header */}
      <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/10 text-xs">
        <button
          onClick={() => setActiveSegmentFilter('fds')}
          className={`flex-1 py-2.5 text-center font-label-md rounded-lg transition-all cursor-pointer ${
            activeSegmentFilter === 'fds'
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Fim de Semana
        </button>
        <button
          onClick={() => {
            setActiveSegmentFilter('proxima');
            setSelectedDay('sexta'); // reset
          }}
          className={`flex-1 py-2.5 text-center font-label-md rounded-lg transition-all cursor-pointer ${
            activeSegmentFilter === 'proxima'
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Próxima Semana
        </button>
        <button
          onClick={() => {
            setActiveSegmentFilter('mes');
            setSelectedDay('sexta');
          }}
          className={`flex-1 py-2.5 text-center font-label-md rounded-lg transition-all cursor-pointer ${
            activeSegmentFilter === 'mes'
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Filtrar Mês
        </button>
      </div>

      {/* Sub-day Tab Bar (Only active when weekend mode is selected) */}
      {activeSegmentFilter === 'fds' && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedDay('sexta')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedDay === 'sexta'
                ? 'bg-secondary text-white border-secondary'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-outline bg-surface-container-low'
            }`}
          >
            Sexta-feira ({sextaPedidos.length})
          </button>
          <button
            onClick={() => setSelectedDay('sabado')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedDay === 'sabado'
                ? 'bg-secondary text-white border-secondary'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-outline bg-surface-container-low'
            }`}
          >
            Sábado ({sabadoPedidos.length})
          </button>
          <button
            onClick={() => setSelectedDay('domingo')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedDay === 'domingo'
                ? 'bg-secondary text-white border-secondary'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-outline bg-surface-container-low'
            }`}
          >
            Domingo ({domingoPedidos.length})
          </button>
        </div>
      )}

      {/* Order Cards Flow */}
      <div className="space-y-4">
        {displayedPedidos.length === 0 ? (
          <div className="bg-surface p-8 text-center rounded-xl border border-dashed border-outline-variant/30">
            <ChefHat className="w-8 h-8 text-outline/30 mx-auto mb-2" />
            <p className="text-sm font-sans text-on-surface-variant italic">Nenhuma encomenda registrada para este período.</p>
          </div>
        ) : (
          displayedPedidos.map((ped) => (
            <div
              key={ped.id}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_25px_rgba(75,54,33,0.04)] border-l-4 border-secondary border-t border-r border-b border-outline-variant/10 flex flex-col gap-3 relative animate-in fade-in-50 duration-300"
              style={{
                borderLeftColor:
                  ped.status === 'pendente'
                    ? '#ba1a1a'
                    : ped.status === 'producao'
                    ? '#e0a800'
                    : '#2e7d32'
              }}
            >
              {/* Header inside row card */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif text-lg font-bold text-on-surface">{ped.clienteNome}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(ped.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })},{' '}
                      {ped.horario}
                    </span>
                    <span className="font-semibold text-[10px] bg-primary-container px-1.5 py-0.5 rounded text-secondary">
                      {ped.codigo}
                    </span>
                  </div>
                </div>

                {/* status indicator tag */}
                <span
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    ped.status === 'pendente'
                      ? 'bg-rose-100 text-[#ba1a1a]'
                      : ped.status === 'producao'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {ped.status === 'pendente'
                    ? 'Pendente'
                    : ped.status === 'producao'
                    ? 'No Forno'
                    : 'Pronto!'}
                </span>
              </div>

              {/* Order quick specs block */}
              <div className="bg-surface-container-low/70 p-3 rounded-lg text-xs flex flex-col gap-1.5 text-on-surface">
                <div className="flex justify-between">
                  <span className="font-bold text-secondary">
                    {ped.saborNome} ({ped.tamanhoLabel})
                  </span>
                  <span className="font-bold text-tertiary">
                    R$ {ped.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {ped.massa && (
                  <div className="text-[10px] text-on-surface-variant font-medium">
                    🎂 Massa: <span className="font-bold capitalize">{ped.massa === 'preta' ? 'Preta (Chocolate) 🍫' : 'Branca 🍞'}</span>
                  </div>
                )}

                {/* Method info (Retirada vs Entrega) and Payment details */}
                <div className="text-[10px] font-semibold text-on-surface flex flex-wrap gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    ped.tipoEntrega === 'entrega' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ped.tipoEntrega === 'entrega' ? '🚚 Entrega Solicitada' : '🏪 Retirada na Loja'}
                  </span>

                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    ped.formaPagamento === 'pix' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : ped.formaPagamento === 'cartao'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-800'
                  }`}>
                    {ped.formaPagamento === 'pix' ? '📱 Pix' : ped.formaPagamento === 'cartao' ? '💳 Cartão' : '💵 Dinheiro'}
                  </span>
                </div>

                {/* Display pick-up person */}
                {ped.tipoEntrega === 'retirada' && ped.nomeRetirada && (
                  <div className="text-[11px] bg-sky-50 text-sky-900 border border-sky-150 rounded-lg p-2 mt-1 font-sans leading-normal">
                    👤 <strong>Retirada por:</strong> {ped.nomeRetirada}
                  </div>
                )}

                {/* Address block if Delivery */}
                {ped.tipoEntrega === 'entrega' && ped.rua && (
                  <div className="text-[11px] bg-white/60 border border-outline-variant/10 rounded-lg p-2.5 mt-1 font-sans text-on-surface space-y-0.5 leading-normal">
                    <p>📍 <strong>CEP:</strong> {ped.cep}</p>
                    <p>🛣️ <strong>Endereço:</strong> {ped.rua}, Nº {ped.numero}</p>
                    {ped.complemento && <p>🏢 <strong>Complemento:</strong> {ped.complemento}</p>}
                    <p>🏘️ <strong>Bairro:</strong> {ped.bairro} - {ped.cidade}/{ped.estado}</p>
                  </div>
                )}

                {ped.adicionais.length > 0 && (
                  <p className="text-on-surface-variant italic mt-1 leading-normal text-[11px] p-1 bg-white/20 rounded">
                    <strong>Notas:</strong> {ped.adicionais.join(', ')}
                  </p>
                )}
              </div>

              {/* Dynamic Status Toggles Directly inside each Card */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-outline-variant/5 pt-2.5 mt-1">
                <span className="text-[10px] font-bold text-on-surface-variant font-sans uppercase">
                  Alterar Produção:
                </span>
                
                <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onUpdatePedidoStatus(ped.id, 'pendente')}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      ped.status === 'pendente'
                        ? 'bg-[#ba1a1a] text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    Pendente
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePedidoStatus(ped.id, 'producao')}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      ped.status === 'producao'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    No Forno
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePedidoStatus(ped.id, 'entregue')}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      ped.status === 'entregue'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    Pronto!
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/5">
                <button
                  onClick={() => handleOpenWhats(ped)}
                  className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1.5 cursor-pointer font-medium px-1.5 py-1 hover:bg-surface-container rounded transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-secondary font-semibold" />
                  <span>WhatsApp</span>
                </button>

                {onDeletePedido && (
                  confirmingDeleteId === ped.id ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 p-1 rounded animate-in fade-in duration-200">
                      <span className="text-[10px] font-bold text-[#ba1a1a]">Excluir?</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeletePedido(ped.id);
                          setConfirmingDeleteId(null);
                        }}
                        className="text-[9px] bg-[#ba1a1a] text-white font-bold px-2 py-1 rounded hover:opacity-90 cursor-pointer"
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(null)}
                        className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded hover:bg-slate-300 cursor-pointer"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(ped.id)}
                      className="text-xs text-[#ba1a1a] hover:text-[#ba1a1a]/80 flex items-center gap-1 cursor-pointer font-medium px-1.5 py-1 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
                    </button>
                  )
                )}

                <button
                  onClick={() => setDetailedPedidoId(ped.id)}
                  className="px-4 py-1.5 bg-secondary text-white text-[11px] rounded transition-all hover:bg-secondary/90 font-semibold cursor-pointer shadow-sm"
                >
                  Detalhes
                </button>
              </div>
            </div>
          ))
        )}

        {/* Quick add agenda outlined section (Screen 3 Empty Card) */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-6 rounded-xl border-2 border-dashed border-outline-variant/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low/30 cursor-pointer p-4"
        >
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary mb-2 shadow-sm">
            <Plus className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-label-md text-sm text-secondary font-bold">Agendar novo pedido para hoje</span>
        </button>
      </div>

      {/* Floating Action Button (FAB) at footer right corner */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:bg-[#59422c] transition-all cursor-pointer"
        >
          <Plus className="w-8 h-8 font-bold" />
        </button>
      </div>

      {/* MODAL 1: ORDER DETAILS & STATUS UPDATE */}
      {detailedPedido && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface p-6 rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant/30 relative animate-in zoom-in-95 duration-200 text-on-surface">
            {/* Close button */}
            <button
              onClick={() => setDetailedPedidoId(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-secondary mb-1">
              Detalhes do Pedido
            </h3>
            <span className="text-[10px] bg-primary-container px-2 py-0.5 rounded text-secondary font-mono">
              {detailedPedido.codigo}
            </span>

            <div className="mt-4 space-y-3 text-xs leading-relaxed font-sans pb-4 border-b border-outline-variant/15">
              <p>
                <strong className="text-secondary text-xs uppercase font-sans tracking-wide mr-2 block">Cliente:</strong>
                <span className="text-sm font-semibold">{detailedPedido.clienteNome}</span>
              </p>
              <p>
                <strong className="text-secondary text-xs uppercase font-sans tracking-wide mr-2 block">Sabor do Bolo (Recheios):</strong>
                <span className="text-sm font-semibold text-primary">{detailedPedido.saborNome} ({detailedPedido.tamanhoLabel})</span>
              </p>
              {detailedPedido.massa && (
                <p>
                  <strong className="text-secondary text-xs uppercase font-sans tracking-wide mr-2 block">Massa:</strong>
                  <span className="text-xs font-semibold capitalize bg-primary/10 text-secondary px-2 py-0.5 rounded-full inline-block">
                    {detailedPedido.massa === 'preta' ? '🍫 Preta (Chocolate)' : '🍞 Branca'}
                  </span>
                </p>
              )}
              <p>
                <strong className="text-secondary text-xs uppercase font-sans tracking-wide mr-2 block">WhatsApp de Contato:</strong>
                <span className="text-xs font-mono">{detailedPedido.whatsapp}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 bg-surface-container rounded-lg p-2.5">
                <p>
                  <strong className="text-secondary text-[10px] uppercase font-semibold block">Entrega:</strong>
                  <span className="capitalize text-sm font-medium">{detailedPedido.tipoEntrega === 'entrega' ? '🚚 Entrega' : '🏪 Retirada'}</span>
                </p>
                <p>
                  <strong className="text-secondary text-[10px] uppercase font-semibold block">Data/Hora:</strong>
                  <span className="text-sm font-medium">
                    {new Date(detailedPedido.data + 'T12:00:00').toLocaleDateString('pt-BR')} às {detailedPedido.horario}
                  </span>
                </p>
              </div>

              {detailedPedido.tipoEntrega === 'entrega' && detailedPedido.rua && (
                <div className="bg-surface-container-low p-2.5 border border-outline-variant/15 rounded-lg leading-relaxed text-[11px]">
                  📍 <strong>Endereço de Entrega:</strong> {detailedPedido.rua}, {detailedPedido.numero} {detailedPedido.complemento ? `- ${detailedPedido.complemento}` : ''} - {detailedPedido.bairro}, {detailedPedido.cidade}/{detailedPedido.estado}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${detailedPedido.rua}, ${detailedPedido.numero}, ${detailedPedido.bairro}, ${detailedPedido.cidade}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold mt-1.5 block"
                  >
                    🗺️ Traçar rota de entrega no Google Maps
                  </a>
                </div>
              )}

              {detailedPedido.tipoEntrega === 'retirada' && (
                <div className="bg-surface-container-low p-2.5 border border-outline-variant/15 rounded-lg leading-normal text-[11px] space-y-1">
                  <p>📍 <strong>Local de Retirada (Dona Cleusa):</strong> Rua Uiramirins, 70, Jardim Uirá, São José dos Campos - SP</p>
                  {detailedPedido.nomeRetirada && (
                    <p>👤 <strong>Responsável por Retirar:</strong> <span className="font-semibold text-secondary">{detailedPedido.nomeRetirada}</span></p>
                  )}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Rua+Uiramirins,+70,+Jardim+Uir%C3%A1,+S%C3%A3o+Jos%C3%A9+dos+Campos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold mt-1.5"
                  >
                    🗺️ Ver endereço no Google Maps
                  </a>
                </div>
              )}

              {detailedPedido.adicionais.length > 0 && (
                <div>
                  <strong className="text-secondary text-xs uppercase font-sans tracking-wide mr- block">Especificações Extras:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 pl-1 italic text-on-surface-variant">
                    {detailedPedido.adicionais.map((ad, i) => (
                      <li key={i}>{ad}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="flex justify-between items-center text-sm bg-primary-container/35 px-3 py-2 rounded-lg mt-2">
                <span className="font-bold text-secondary">Valor Líquido:</span>
                <span className="font-bold text-tertiary">
                  R$ {detailedPedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>

            {/* Dynamic Status Toggle */}
            <div className="mt-4">
              <label className="block text-secondary text-xs font-semibold mb-2 uppercase select-none">
                Mudar Status da Encomenda:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    onUpdatePedidoStatus(detailedPedido.id, 'pendente');
                  }}
                  className={`py-2 px-1 text-center font-semibold rounded text-[10px] uppercase cursor-pointer ${
                    detailedPedido.status === 'pendente'
                      ? 'bg-red-100 text-[#ba1a1a] ring-2 ring-red-300'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  Pendente
                </button>
                <button
                  onClick={() => {
                    onUpdatePedidoStatus(detailedPedido.id, 'producao');
                  }}
                  className={`py-2 px-1 text-center font-semibold rounded text-[10px] uppercase cursor-pointer ${
                    detailedPedido.status === 'producao'
                      ? 'bg-orange-100 text-[#85530b] ring-2 ring-amber-300'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  Em Produção
                </button>
                <button
                  onClick={() => {
                    onUpdatePedidoStatus(detailedPedido.id, 'entregue');
                  }}
                  className={`py-2 px-1 text-center font-semibold rounded text-[10px] uppercase cursor-pointer ${
                    detailedPedido.status === 'entregue'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  Entregue
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => handleOpenWhats(detailedPedido)}
                className="flex-1 py-2.5 bg-secondary text-white rounded text-xs font-semibold flex items-center justify-center gap-1 shadow hover:bg-secondary/90 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-white text-secondary" />
                <span>Atualizar Cliente</span>
              </button>
              <button
                onClick={() => setDetailedPedidoId(null)}
                className="px-4 py-2.5 bg-surface-container-high text-on-surface rounded text-xs font-semibold hover:bg-surface-container-highest transition-all cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK BOOKING ADD */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-surface p-6 rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant/30 my-8 relative animate-in zoom-in-95 duration-200 text-on-surface">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-secondary mb-4">
              Agendar Nova Encomenda
            </h3>

            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Mendonça"
                  className="w-full h-10 px-3 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                  value={addNome}
                  onChange={(e) => setAddNome(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-on-surface-variant">WhatsApp do Cliente</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 11988887777"
                  className="w-full h-10 px-3 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                  value={addWhats}
                  onChange={(e) => setAddWhats(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Sabor do Bolo</label>
                  <select
                    className="w-full h-10 px-2 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                    value={addSabor}
                    onChange={(e) => setAddSabor(e.target.value)}
                  >
                    {sabores.map((s, index) => (
                      <option key={index} value={s.nome}>{s.nome}</option>
                    ))}
                    <option value="Personalizado">Outro Sabor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Peso / Tamanho</label>
                  <select
                    className="w-full h-10 px-2 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                    value={addTamanho}
                    onChange={(e) => setAddTamanho(e.target.value)}
                  >
                    <option value="P (1kg)">P (1kg)</option>
                    <option value="M (2kg)">M (2kg)</option>
                    <option value="G (3kg)">G (3kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Data da Encomenda</label>
                  <input
                    type="date"
                    required
                    className="w-full h-10 px-2 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                    value={addData}
                    onChange={(e) => setAddData(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Horário</label>
                  <input
                    type="time"
                    required
                    className="w-full h-10 px-2 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                    value={addHora}
                    onChange={(e) => setAddHora(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Preço Cobrado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full h-10 px-3 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none"
                    value={addTotal}
                    onChange={(e) => setAddTotal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Forma de Pagamento</label>
                  <select
                    className="w-full h-10 px-2 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                    value={addFormaPagamento}
                    onChange={(e) => setAddFormaPagamento(e.target.value as any)}
                  >
                    <option value="pix">Pix</option>
                    <option value="cartao">Cartão</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-on-surface-variant">Notas Adicionais / Velas</label>
                <textarea
                  className="w-full p-2.5 rounded bg-surface-container border border-outline-variant/35 text-xs focus:ring-1 focus:ring-primary outline-none h-12"
                  placeholder="Ex: Escrever parabéns, retirar ovo"
                  value={addNotas}
                  onChange={(e) => setAddNotas(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-secondary text-white font-semibold rounded text-xs shadow hover:bg-secondary/90 transition-all cursor-pointer"
                >
                  Agendar Pedido
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 bg-surface-container-high text-on-surface rounded text-xs hover:bg-surface-container-highest transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
