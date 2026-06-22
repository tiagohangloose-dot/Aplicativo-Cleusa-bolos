import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cake,
  Calendar,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  Heart,
  ListTodo,
  Info,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Trash2
} from 'lucide-react';

// Static assets and default structures
import { BoloSabor, BoloTamanho, AdicionalExtra, Pedido } from './types';
import { INITIAL_FLAVORS, INITIAL_SIZES, INITIAL_EXTRAS, INITIAL_ORDERS } from './initialData';

// Modular Component files
import OrderForm from './components/OrderForm';
import SuccessView from './components/SuccessView';
import AgendaView from './components/AgendaView';
import LoginView from './components/LoginView';
import ConfigView from './components/ConfigView';

export default function App() {
  // 1. Core Databases matching storage specs
  const [sabores, setSabores] = useState<BoloSabor[]>(() => {
    const local = localStorage.getItem('cleusabolos_sabores');
    return local ? JSON.parse(local) : INITIAL_FLAVORS;
  });

  const [extras, setExtras] = useState<AdicionalExtra[]>(() => {
    const local = localStorage.getItem('cleusabolos_extras');
    return local ? JSON.parse(local) : INITIAL_EXTRAS;
  });

  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const local = localStorage.getItem('cleusabolos_pedidos');
    const parsed: Pedido[] = local ? JSON.parse(local) : INITIAL_ORDERS;
    // Filter out old pre-loaded examples so the user gets a fully clean start
    return parsed.filter(item => !['ord-1', 'ord-2', 'ord-3', 'ord-4', 'ord-5'].includes(item.id));
  });

  // Track only the order IDs placed during active user session
  const [meusPedidosIds, setMeusPedidosIds] = useState<string[]>(() => {
    const local = localStorage.getItem('cleusabolos_meus_pedidos_ids');
    return local ? JSON.parse(local) : [];
  });

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<'menu' | 'agenda' | 'pedidos' | 'perfil'>('menu');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Pedido | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  
  // Administrator login session
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cleusabolos_admin_session') === 'true';
  });

  // 3. Keep local storage in sync
  useEffect(() => {
    localStorage.setItem('cleusabolos_sabores', JSON.stringify(sabores));
  }, [sabores]);

  useEffect(() => {
    localStorage.setItem('cleusabolos_extras', JSON.stringify(extras));
  }, [extras]);

  useEffect(() => {
    localStorage.setItem('cleusabolos_pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    localStorage.setItem('cleusabolos_meus_pedidos_ids', JSON.stringify(meusPedidosIds));
  }, [meusPedidosIds]);

  // Handle placing a new custom order in cake customizer mode
  const handlePlaceOrder = (newOrderFields: Omit<Pedido, 'id' | 'codigo' | 'dataCriacao'>) => {
    const orderId = 'ord-' + Date.now();
    const orderCode = 'CB-' + Math.floor(1000 + Math.random() * 9000);
    const newPedido: Pedido = {
      ...newOrderFields,
      id: orderId,
      codigo: orderCode,
      dataCriacao: new Date().toISOString()
    };

    const updatedPedidos = [newPedido, ...pedidos];
    setPedidos(updatedPedidos);
    
    // Store order ID to remember user placed this order
    setMeusPedidosIds(prev => [...prev, orderId]);

    setLastPlacedOrder(newPedido);
  };

  // Status alteration for booking lists
  const handleUpdatePedidoStatus = (pedidoId: string, newStatus: Pedido['status']) => {
    const updated = pedidos.map(p => {
      if (p.id === pedidoId) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    setPedidos(updated);
  };

  const handleAddManualPedido = (newPedido: Pedido) => {
    setPedidos([newPedido, ...pedidos]);
  };

  const handleDeletePedido = (pedidoId: string) => {
    setPedidos(prev => prev.filter(p => p.id !== pedidoId));
    setMeusPedidosIds(prev => prev.filter(id => id !== pedidoId));
    if (lastPlacedOrder && lastPlacedOrder.id === pedidoId) {
      setLastPlacedOrder(null);
    }
  };

  // Config actions
  const handleAddSabor = (newSabor: BoloSabor) => {
    setSabores([...sabores, newSabor]);
  };

  const handleUpdateSabor = (id: string, updatedFields: Partial<BoloSabor>) => {
    const updated = sabores.map(s => {
      if (s.id === id) {
        return { ...s, ...updatedFields };
      }
      return s;
    });
    setSabores(updated);
  };

  const handleAddExtra = (newExtra: AdicionalExtra) => {
    setExtras([...extras, newExtra]);
  };

  const handleDeleteExtra = (id: string) => {
    setExtras(extras.filter(e => e.id !== id));
  };

  const handleSaveAllConfig = () => {
    // Persist completely
    localStorage.setItem('cleusabolos_sabores', JSON.stringify(sabores));
    localStorage.setItem('cleusabolos_extras', JSON.stringify(extras));
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    localStorage.setItem('cleusabolos_admin_session', 'false');
  };

  const handleAdminLoginSuccess = () => {
    setAdminLoggedIn(true);
    localStorage.setItem('cleusabolos_admin_session', 'true');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased relative">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 bg-pattern -z-10 pointer-events-none"></div>

      {/* Top Header Navigation matching Screen 1, Screen 3, Screen 5 layouts */}
      <header className="fixed top-0 left-0 w-full z-50 h-16 bg-surface/85 backdrop-blur-md border-b border-outline-variant/10 shadow-[0px_4px_20px_rgba(75,54,33,0.04)] px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Cleusa Bolos - Delícias artesanais feitas à mão com muito carinho. Desde 1998.')}
            className="text-primary hover:opacity-80 transition-opacity p-1.5 rounded-lg"
          >
            <Menu className="w-5 h-5 text-secondary" />
          </button>
          <h1 className="font-serif italic text-xl md:text-2xl font-bold text-primary cursor-pointer select-none" onClick={() => { setLastPlacedOrder(null); setActiveTab('menu'); }}>
            Cleusa Bolos
          </h1>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {adminLoggedIn && (
            <button
              onClick={handleAdminLogout}
              className="text-xs text-primary hover:text-error hover:bg-error-container/30 transition-all font-semibold font-sans py-1.5 px-3 rounded-full flex items-center gap-1 cursor-pointer border border-primary-container/40"
              title="Sair do painel administrativo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair Admin</span>
            </button>
          )}
          <button
            onClick={() => {
              // Direct navigation to admin options or orders shortcut
              if (adminLoggedIn) {
                setActiveTab('perfil');
              } else {
                setActiveTab('perfil');
              }
            }}
            className="text-primary p-2 hover:bg-primary-container/20 rounded-full transition-all cursor-pointer relative"
            title="Carrinho / Encomendas"
          >
            <ShoppingBag className="w-5 h-5 text-secondary" />
            {pedidos.filter(p => p.status === 'pendente').length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-tertiary text-on-tertiary text-[10px] w-4.5 h-4.5 font-bold rounded-full flex items-center justify-center border border-surface">
                {pedidos.filter(p => p.status === 'pendente').length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-xl mx-auto pt-24 pb-28 px-4 md:px-0">
        
        {/* Animated slide transitions using AnimatePresence from motion/react */}
        <AnimatePresence mode="wait">
          
          {/* USER CUSTOMIZOR VIEWS OR SUCCESS TICKERS */}
          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {lastPlacedOrder ? (
                // Success screen 2 triggered instantly on place order
                <SuccessView
                  pedido={lastPlacedOrder}
                  onReset={() => {
                    setLastPlacedOrder(null);
                    // auto redirect
                    setActiveTab('menu');
                  }}
                />
              ) : (
                // Customize cake screen 1
                <div>
                  <div className="mb-6">
                    <h2 className="font-serif text-3xl md:text-4xl text-secondary font-bold tracking-tight mb-2 italic">
                      Monte seu Bolo
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      Crie momentos inesquecíveis com nossos bolos artesanais, feitos com ingredientes selecionados e muito amor.
                    </p>
                  </div>

                  <OrderForm
                    sabores={sabores}
                    tamanhos={INITIAL_SIZES}
                    extras={extras}
                    onPlaceOrder={handlePlaceOrder}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ADMIN SCHEDULING CALENDAR VIEW (Screen 3) */}
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {!adminLoggedIn ? (
                // Falls back to Admin Login if trying to access calendar
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary-container/20 border border-primary-container/50 rounded-xl mb-4">
                    <p className="text-xs font-sans text-secondary italic font-semibold">
                      🔒 A Agenda de Encomendas é reservada para a Dona Cleusa. Por favor, faça login para acessar!
                    </p>
                  </div>
                  <LoginView onSuccessLogin={handleAdminLoginSuccess} />
                </div>
              ) : (
                // Screen 3: Scheduling calendar
                <div>
                  <div className="mb-4">
                    <h2 className="font-serif text-2xl text-secondary font-bold italic">
                      Minha Agenda
                    </h2>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Acompanhe as encomendas programadas e mude o status de produção em tempo real.
                    </p>
                  </div>

                  <AgendaView
                    pedidos={pedidos}
                    sabores={sabores}
                    onUpdatePedidoStatus={handleUpdatePedidoStatus}
                    onAddPedido={handleAddManualPedido}
                    onDeletePedido={handleDeletePedido}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* USER PERSONAL ORDER TRACKER VIEW */}
          {activeTab === 'pedidos' && (
            <motion.div
              key="pedidos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <div>
                <div className="mb-6">
                  <h2 className="font-serif text-2xl text-secondary font-bold italic">
                    Minhas Encomendas
                  </h2>
                  <p className="font-sans text-xs text-on-surface-variant">
                    Consulte os pedidos que você inseriu na sessão atual para acompanhamento de produção.
                  </p>
                </div>

                {(() => {
                  const meusPedidos = pedidos.filter(p => meusPedidosIds.includes(p.id));
                  if (meusPedidos.length === 0) {
                    return (
                      <div className="bg-surface-container-lowest p-8 text-center rounded-xl border border-outline-variant/15 text-on-surface">
                        <ListTodo className="w-10 h-10 text-outline/30 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-secondary">Nenhum pedido feito ainda nesta sessão!</p>
                        <p className="text-xs text-on-surface-variant mt-1">Vá em "Menu" para montar seu bolo personalizado.</p>
                        <button
                          onClick={() => setActiveTab('menu')}
                          className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:opacity-90 cursor-pointer"
                        >
                          Montar Meu Bolo
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {meusPedidos.map((ped) => (
                        <div
                          key={ped.id}
                          className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/15 flex flex-col gap-3 relative animate-in fade-in duration-300"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] bg-primary-container px-2 py-0.5 rounded text-secondary font-mono mr-2 font-bold">
                                {ped.codigo}
                              </span>
                              <h4 className="font-serif text-base font-bold mt-1 text-on-surface inline-block">{ped.clienteNome}</h4>
                            </div>
                            
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                ped.status === 'pendente'
                                  ? 'bg-rose-50 text-error border border-error/10'
                                  : ped.status === 'producao'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {ped.status === 'pendente' ? 'Pendente' : ped.status === 'producao' ? 'No Forno' : 'Pronto!'}
                            </span>
                          </div>

                          <div className="bg-surface-container-low p-3 rounded text-xs text-on-surface leading-loose">
                            <p><strong>Bolo Escolhido:</strong> {ped.saborNome} ({ped.tamanhoLabel})</p>
                            <p><strong>Agendamento:</strong> {new Date(ped.data + 'T12:00:00').toLocaleDateString('pt-BR')} às {ped.horario}</p>
                            <p><strong>Tipo de Encomenda:</strong> {ped.tipoEntrega === 'entrega' ? '🚚 Receber em Casa' : '🏪 Buscar com a Cleusa'}</p>
                            <p><strong>Forma de Pagamento:</strong> <span className="font-semibold text-secondary uppercase text-[11px]">{ped.formaPagamento === 'pix' ? '📱 Pix' : ped.formaPagamento === 'cartao' ? '💳 Cartão' : '💵 Dinheiro'}</span></p>
                            {ped.tipoEntrega === 'retirada' && ped.nomeRetirada && (
                              <p><strong>Retirada por:</strong> <span className="font-semibold text-secondary">{ped.nomeRetirada}</span></p>
                            )}
                            {ped.tipoEntrega === 'entrega' && ped.rua && (
                              <p className="bg-white/50 p-2 rounded border border-outline-variant/10 text-[11px] mt-1.5 leading-normal">
                                📍 <strong>Endereço de Entrega:</strong> {ped.rua}, {ped.numero} - {ped.bairro}, {ped.cidade}/{ped.estado}
                              </p>
                            )}
                            {ped.adicionais.length > 0 && <p className="italic text-on-surface-variant leading-relaxed text-[11px] mt-1 p-1 bg-white/20 rounded"><strong>Notas:</strong> {ped.adicionais.join(', ')}</p>}
                          </div>

                          <div className="flex justify-between items-center text-xs border-t border-outline-variant/10 pt-2.5 mt-1">
                            {confirmingDeleteId === ped.id ? (
                              <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-1.5 rounded-lg animate-in fade-in duration-200">
                                <span className="text-[10px] font-bold text-[#ba1a1a]">Excluir mesmo?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeletePedido(ped.id);
                                    setConfirmingDeleteId(null);
                                  }}
                                  className="text-[10px] bg-[#ba1a1a] text-white font-bold px-2.5 py-1 rounded hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                  Sim
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded hover:bg-slate-300 transition-colors cursor-pointer"
                                >
                                  Não
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmingDeleteId(ped.id)}
                                className="text-[11px] text-[#ba1a1a] hover:underline flex items-center gap-1 cursor-pointer font-medium bg-rose-50/50 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Excluir Encomenda</span>
                              </button>
                            )}
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-on-surface-variant">Valor Total</span>
                              <span className="font-serif font-bold text-tertiary text-sm">
                                R$ {ped.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="p-4 bg-tertiary-container/30 border border-tertiary-container rounded-xl flex items-start gap-2.5 text-xs text-on-tertiary-container">
                        <Info className="w-4.5 h-4.5 text-tertiary shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Este painel exibe e monitora as encomendas que você acabou de realizar. Acompanhe a produção real nos cartões acima.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {/* USER ADMIN LOGIN OR SETTINGS CONFIG PANEL (Screen 5) */}
          {activeTab === 'perfil' && (
            <motion.div
              key="perfil"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {!adminLoggedIn ? (
                // Show clean admin authentication credentials
                <LoginView onSuccessLogin={handleAdminLoginSuccess} />
              ) : (
                // Show full dynamic cake settings panel (Screen 5)
                <div>
                  <div className="mb-4">
                    <h2 className="font-serif text-2xl text-secondary font-bold italic">
                      Configurações do Cardápio
                    </h2>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Gerencie sabores ativos, pesos base, preços e opcionais adicionais da sua confeitaria.
                    </p>
                  </div>

                  <ConfigView
                    sabores={sabores}
                    extras={extras}
                    onAddSabor={handleAddSabor}
                    onUpdateSabor={handleUpdateSabor}
                    onAddExtra={handleAddExtra}
                    onDeleteExtra={handleDeleteExtra}
                    onSaveAll={handleSaveAllConfig}
                    onLogout={handleAdminLogout}
                  />
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Persistent Bottom Bar Navigation with touch targets of at least 44px height */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md rounded-t-2xl shadow-[0px_-4px_25px_rgba(75,54,33,0.06)] border-t border-outline-variant/10 py-3.5 px-6 flex justify-around items-center">
        
        {/* TAB 1: MENU */}
        <button
          onClick={() => { setLastPlacedOrder(null); setActiveTab('menu'); }}
          className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer h-12 w-16 ${
            activeTab === 'menu'
              ? 'text-primary scale-105 font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'menu' ? 'bg-primary-container' : 'bg-transparent'}`}>
            <Cake className={`w-5 h-5 ${activeTab === 'menu' ? 'text-secondary' : 'text-outline/70'}`} />
          </div>
          <span className="text-[10px] tracking-wide font-sans font-semibold">Menu</span>
        </button>

        {/* TAB 2: AGENDA */}
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer h-12 w-16 ${
            activeTab === 'agenda'
              ? 'text-primary scale-105 font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'agenda' ? 'bg-primary-container' : 'bg-transparent'}`}>
            <Calendar className={`w-5 h-5 ${activeTab === 'agenda' ? 'text-secondary' : 'text-outline/70'}`} />
          </div>
          <span className="text-[10px] tracking-wide font-sans font-semibold">Agenda</span>
        </button>

        {/* TAB 3: PEDIDOS TRACKER */}
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer h-12 w-16 ${
            activeTab === 'pedidos'
              ? 'text-primary scale-105 font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'pedidos' ? 'bg-primary-container' : 'bg-transparent'}`}>
            <ListTodo className={`w-5 h-5 ${activeTab === 'pedidos' ? 'text-secondary' : 'text-outline/70'}`} />
          </div>
          <span className="text-[10px] tracking-wide font-sans font-semibold">Pedidos</span>
        </button>

        {/* TAB 4: PERFIL / ADMINISTRATIVE SETTINGS */}
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer h-12 w-16 ${
            activeTab === 'perfil'
              ? 'text-primary scale-105 font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'perfil' ? 'bg-primary-container' : 'bg-transparent'}`}>
            <User className={`w-5 h-5 ${activeTab === 'perfil' ? 'text-secondary' : 'text-outline/70'}`} />
          </div>
          <span className="text-[10px] tracking-wide font-sans font-semibold">Perfil</span>
        </button>

      </nav>
    </div>
  );
}
