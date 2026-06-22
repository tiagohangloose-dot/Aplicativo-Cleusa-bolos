import React, { useState } from 'react';
import { Cake, Info, Wallet, CheckCircle } from 'lucide-react';
import { BoloSabor, BoloTamanho, BoloSalgadoTamanho, BoloPiscinaSabor } from '../types';

interface OfficialMenuProps {
  sabores: BoloSabor[];
  tamanhos: BoloTamanho[];
  tamanhosSalgado: BoloSalgadoTamanho[];
  saboresPiscina: BoloPiscinaSabor[];
  precoPiscina: number;
}

export default function OfficialMenu({
  sabores,
  tamanhos,
  tamanhosSalgado,
  saboresPiscina,
  precoPiscina
}: OfficialMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'doce' | 'salgado' | 'piscina' | 'regras'>('doce');

  const disponivelSabores = sabores.filter(s => s.status === 'disponivel');
  const tradicionais = disponivelSabores.filter(s => s.precoBase <= 180.00);
  const especiais = disponivelSabores.filter(s => s.precoBase > 180.00);

  // We find standard base price (typically 180 or the lowest traditional filling)
  const baseCakePreco = tradicionais.length > 0 ? Math.min(...tradicionais.map(s => s.precoBase)) : 180.00;

  return (
    <div id="cardapio-oficial" className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 shadow-[0px_8px_30px_rgba(97,21,42,0.04)] overflow-hidden mb-6 animate-in fade-in duration-300">
      {/* Header Button to Toggle Menu */}
      <button
        id="toggle-menu-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-secondary-container/10 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-container text-primary group-hover:scale-105 transition-transform duration-300">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-secondary group-hover:text-primary transition-colors">
              📖 Visualizar Cardápio Oficial
            </h3>
            <p className="font-sans text-[11px] text-on-surface-variant/80">
              Clique para abrir a tabela de preços, tamanhos, fatias e sabores
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-surface-container-low text-primary border border-outline-variant/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
          {isOpen ? 'Fechar ✕' : 'Ver Cardápio'}
        </span>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div id="cardapio-collapsed-body" className="px-5 pb-5 border-t border-outline-variant/10 bg-surface-container-low/20 animate-in slide-in-from-top-3 duration-300">
          {/* Subtabs for types of cakes */}
          <div className="flex gap-1 overflow-x-auto pb-2 pt-4 scrollbar-none border-b border-outline-variant/10">
            <button
              id="subtab-doce"
              type="button"
              onClick={() => setActiveSubTab('doce')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                activeSubTab === 'doce'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-medium'
              }`}
            >
              🍰 Bolo Doce
            </button>
            <button
              id="subtab-salgado"
              type="button"
              onClick={() => setActiveSubTab('salgado')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                activeSubTab === 'salgado'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-medium'
              }`}
            >
              🥪 Bolo Salgado
            </button>
            <button
              id="subtab-piscina"
              type="button"
              onClick={() => setActiveSubTab('piscina')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                activeSubTab === 'piscina'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-medium'
              }`}
            >
              🌋 Piscina/Vulcão
            </button>
            <button
              id="subtab-regras"
              type="button"
              onClick={() => setActiveSubTab('regras')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                activeSubTab === 'regras'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-medium'
              }`}
            >
              📋 Informações
            </button>
          </div>

          <div className="pt-4 space-y-4">
            {/* SUBTAB 1: BOLO DOCE */}
            {activeSubTab === 'doce' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-3 gap-2">
                  {tamanhos.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-center shadow-sm">
                      <span className="block text-[10px] text-primary font-bold uppercase tracking-wider">{t.label}</span>
                      <span className="block font-serif text-base font-bold text-secondary mt-0.5">
                        R$ {(baseCakePreco + t.adicionalPreco).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      <span className="block text-[9px] text-outline/80 mt-0.5">{t.fatias}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant/10 pb-1.5">
                      🎂 Recheios Tradicionais (Inclusos na base)
                    </h4>
                    {tradicionais.length > 0 ? (
                      <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1.5 font-medium">
                        {tradicionais.map(t => t.nome).join(' • ')}
                      </p>
                    ) : (
                      <p className="text-[11px] text-on-surface-variant/65 italic mt-1.5">Nenhum recheio tradicional cadastrado.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-tertiary uppercase tracking-wider flex items-center gap-1.5 border-b border-outline-variant/10 pb-1.5 mt-2">
                      ⭐️ Recheios Especiais (+ Adicional)
                    </h4>
                    {especiais.length > 0 ? (
                      <div className="space-y-1 mt-1.5">
                        {especiais.map(esp => {
                          const adicionalUnico = esp.precoBase - baseCakePreco;
                          return (
                            <p key={esp.id} className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                              • <strong>{esp.nome}</strong> (+ R$ {adicionalUnico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-on-surface-variant/65 italic mt-1.5 font-medium">Nenhum recheio especial cadastrado.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: BOLO SALGADO */}
            {activeSubTab === 'salgado' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-3 gap-2">
                  {tamanhosSalgado.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10 text-center shadow-sm">
                      <span className="block text-[10px] text-primary font-bold uppercase tracking-wider">{t.label}</span>
                      <span className="block font-serif text-base font-bold text-secondary mt-0.5">
                        R$ {t.preco.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                      <span className="block text-[9px] text-outline/80 mt-0.5">{t.fatias}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-orange-50/30 border border-orange-100/40 text-on-surface">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-wider border-b border-orange-100/50 pb-1.5 mb-1.5">
                    🍗 Ingredientes do Bolo Salgado Clássico
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-sans font-medium">
                    Pão de forma super macio, recheio generoso de frango desfiado bem temperado, purê de batata artesanal, molho especial da Dona Cleusa, milho verde cozido, azeitonas fatiadas, tomates selecionados, creme de leite leve e cobertura crocante de batata palha fina!
                  </p>
                </div>
              </div>
            )}

            {/* SUBTAB 3: BOLO PISCINA / VULCÃO */}
            {activeSubTab === 'piscina' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-rose-50/20 border border-rose-100/30 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary px-3 py-1 text-white text-[10px] font-bold uppercase rounded-bl-xl tracking-wide">
                    Preço Único
                  </div>
                  <span className="block text-xs text-primary font-bold uppercase tracking-widest">Bolo Piscina / Vulcão</span>
                  <span className="block font-serif text-2xl font-black text-secondary mt-1">R$ {precoPiscina.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="block text-[10px] text-outline/80 mt-1 font-medium">Ideal para um café da tarde especial com farta cobertura fluida e saborosa</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-outline-variant/10 pb-1.5 mb-2">
                    🍩 Sabores Disponíveis
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-on-surface-variant">
                    {saboresPiscina.filter(s => s.status === 'disponivel').map((sab) => (
                      <div key={sab.id} className="p-1.5 bg-surface-container-low/40 rounded flex items-center gap-1.5 font-medium">
                        ✨ {sab.nome}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 4: INFORMAÇÕES */}
            {activeSubTab === 'regras' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-xs font-medium text-on-surface-variant">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 space-y-3 leading-relaxed">
                  <div className="flex gap-2.5">
                    <Wallet className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-secondary font-sans block text-xs">Termos de Entrada</strong>
                      Trabalhamos com 50% de sinal de entrada no ato de confirmação da encomenda e os 50% restantes pagos no ato da entrega ou retirada.
                    </div>
                  </div>

                  <div className="flex gap-2.5 border-t border-outline-variant/10 pt-3 font-medium text-on-surface-variant">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-secondary font-sans block text-xs">Prazos e Planejamento</strong>
                      Todas as encomendas devem ser realizadas com, no mínimo, 3 dias de antecedência para garantir insumos e perfeição.
                    </div>
                  </div>

                  <div className="flex gap-2.5 border-t border-outline-variant/10 pt-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-secondary font-sans block text-xs">Instruções e Observações</strong>
                      • Você pode escolher até 2 recheios no bolo.<br />
                      • Em caso de desistência com menos de 24 horas para a data de entrega, não haverá devolução do sinal do pagamento.<br />
                      • O número de fatias finais é aproximado e depende da espessura que for cortado.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
