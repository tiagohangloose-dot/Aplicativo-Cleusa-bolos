import React, { useState, useEffect } from 'react';
import { BoloSabor, BoloTamanho, AdicionalExtra, Pedido, BoloSalgadoTamanho, BoloPiscinaSabor } from '../types';
import { User, Phone, MapPin, Calendar, Clock, Cake, Check, Info } from 'lucide-react';

interface OrderFormProps {
  sabores: BoloSabor[];
  tamanhos: BoloTamanho[];
  extras: AdicionalExtra[];
  onPlaceOrder: (pedido: Omit<Pedido, 'id' | 'codigo' | 'dataCriacao'>) => void;
  taxaDoisRecheios: number;
  taxaSaborEspecial: number;
  taxaEntrega: number;
  tamanhosSalgado: BoloSalgadoTamanho[];
  saboresPiscina: BoloPiscinaSabor[];
  precoPiscina: number;
  imagemBoloDoce?: string;
  imagemBoloSalgado?: string;
  imagemBoloPiscina?: string;
}

export default function OrderForm({
  sabores,
  tamanhos,
  extras,
  onPlaceOrder,
  taxaDoisRecheios,
  taxaSaborEspecial,
  taxaEntrega,
  tamanhosSalgado,
  saboresPiscina,
  precoPiscina,
  imagemBoloDoce,
  imagemBoloSalgado,
  imagemBoloPiscina
}: OrderFormProps) {
  const disponivelSabores = sabores.filter(s => s.status === 'disponivel');
  const disponivelPiscinas = saboresPiscina.filter(s => s.status === 'disponivel');
  
  // Order Type state
  const [tipoBolo, setTipoBolo] = useState<'doce' | 'salgado' | 'piscina'>('doce');

  // Identification
  const [clienteNome, setClienteNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<'retirada' | 'entrega'>('retirada');
  const [nomeRetirada, setNomeRetirada] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('14:00');
  
  // Custom sweet cake states
  const [saborId, setSaborId] = useState('');
  const [recheio2Id, setRecheio2Id] = useState('');
  const [massa, setMassa] = useState<'branca' | 'preta'>('branca');
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<1 | 2>(1);
  const [tamanhoId, setTamanhoId] = useState('');

  // Salgado states
  const [tamanhoSalgadoId, setTamanhoSalgadoId] = useState('');

  // Piscina states
  const [saborPiscinaId, setSaborPiscinaId] = useState('');

  // Extras
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>([]);
  const [detalhesVal, setDetalhesVal] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');

  // CEP & Address fields
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  // Available business hours from 08:00 to 18:00
  const BUSINESS_HOURS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Set initial selections
  useEffect(() => {
    if (disponivelSabores.length > 0) {
      if (!saborId || !disponivelSabores.some(s => s.id === saborId)) {
        setSaborId(disponivelSabores[0].id);
      }
      if (!recheio2Id || !disponivelSabores.some(s => s.id === recheio2Id)) {
        setRecheio2Id(disponivelSabores[1]?.id || disponivelSabores[0].id);
      }
    }
  }, [sabores, saborId, recheio2Id]);

  useEffect(() => {
    if (tamanhos.length > 0 && !tamanhoId) {
      setTamanhoId(tamanhos[0].id);
    }
  }, [tamanhos, tamanhoId]);

  useEffect(() => {
    if (tamanhosSalgado.length > 0 && !tamanhoSalgadoId) {
      setTamanhoSalgadoId(tamanhosSalgado[0].id);
    }
  }, [tamanhosSalgado, tamanhoSalgadoId]);

  useEffect(() => {
    if (disponivelPiscinas.length > 0 && !saborPiscinaId) {
      setSaborPiscinaId(disponivelPiscinas[0].id);
    }
  }, [saboresPiscina, saborPiscinaId]);

  const toggleExtra = (nome: string) => {
    if (adicionaisSelecionados.includes(nome)) {
      setAdicionaisSelecionados(adicionaisSelecionados.filter(item => item !== nome));
    } else {
      setAdicionaisSelecionados([...adicionaisSelecionados, nome]);
    }
  };

  // ViaCEP lookup
  const fetchCep = async (cepValue: string) => {
    const cleanedCep = cepValue.replace(/\D/g, '');
    if (cleanedCep.length !== 8) return;

    setCepLoading(true);
    setCepError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const resData = await response.json();
      if (resData.erro) {
        setCepError('CEP não encontrado ou inválido.');
      } else {
        setRua(resData.logradouro || '');
        setBairro(resData.bairro || '');
        setCidade(resData.localidade || '');
        setEstado(resData.uf || '');
      }
    } catch (err) {
      setCepError('Erro ao consultar ViaCEP.');
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    let formatted = value;
    if (value.length > 5) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setCep(formatted);

    if (value.length === 8) {
      fetchCep(value);
    }
  };

  // Check if flavor is special
  const checkIsEspecial = (sab: BoloSabor | undefined) => {
    if (!sab) return false;
    return !!sab.isEspecial;
  };

  // Get dynamic individualized flavor surcharge
  const getSaborAdicional = (sab: BoloSabor | undefined) => {
    if (!sab) return 0;
    if (sab.isEspecial) {
      return typeof sab.adicionalPreco === 'number' ? sab.adicionalPreco : taxaSaborEspecial;
    }
    return 0;
  };

  // Pricing selectors
  const recheio1 = sabores.find(s => s.id === saborId) || sabores[0];
  const recheio2 = quantidadeRecheios === 2 ? (sabores.find(s => s.id === recheio2Id) || sabores[0]) : null;
  const selectedTamanho = tamanhos.find(t => t.id === tamanhoId) || tamanhos[0];
  const selectedSalgadoTamanho = tamanhosSalgado.find(t => t.id === tamanhoSalgadoId) || tamanhosSalgado[0];
  const selectedPiscinaSabor = saboresPiscina.find(s => s.id === saborPiscinaId) || saboresPiscina[0];

  // Extras calculations
  const extrasPreco = adicionaisSelecionados.reduce((sum, item) => {
    const matched = extras.find(e => e.nome === item);
    return sum + (matched ? matched.preco : 0);
  }, 0);

  // Dynamic Total Calculation
  let total = 0;
  let summaryLabel = '';
  let finalSaborNome = '';

  if (tipoBolo === 'doce') {
    // Standard sweet cake sizes base
    const basePreco = 180.00 + (selectedTamanho ? selectedTamanho.adicionalPreco : 0);
    const fillingOneAdditional = getSaborAdicional(recheio1);
    const fillingTwoAdditional = (quantidadeRecheios === 2 && recheio2) ? getSaborAdicional(recheio2) : 0;
    const doubleFillingSurcharge = quantidadeRecheios === 2 ? taxaDoisRecheios : 0;

    total = basePreco + fillingOneAdditional + fillingTwoAdditional + doubleFillingSurcharge + extrasPreco;
    summaryLabel = selectedTamanho?.label || 'Tamanho P';
    finalSaborNome = recheio2
      ? `${recheio1?.nome || 'Personalizado'} + ${recheio2?.nome || 'Personalizado'}`
      : (recheio1?.nome || 'Personalizado');
  } else if (tipoBolo === 'salgado') {
    total = (selectedSalgadoTamanho ? selectedSalgadoTamanho.preco : 160.00) + extrasPreco;
    summaryLabel = selectedSalgadoTamanho ? `${selectedSalgadoTamanho.label} (${selectedSalgadoTamanho.fatias})` : 'Tamanho P';
    finalSaborNome = 'Bolo Salgado de Frango Clássico';
  } else if (tipoBolo === 'piscina') {
    total = precoPiscina + extrasPreco;
    summaryLabel = 'Bolo Piscina (Tamanho Único)';
    finalSaborNome = selectedPiscinaSabor ? `Bolo Piscina flavor ${selectedPiscinaSabor.nome}` : 'Bolo Piscina';
  }

  if (tipoEntrega === 'entrega') {
    total += taxaEntrega;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome) {
      alert('Por favor, informe seu nome completo.');
      return;
    }
    if (!whatsapp) {
      alert('Por favor, informe um WhatsApp para contato.');
      return;
    }
    if (tipoEntrega === 'entrega') {
      if (!cep) {
        alert('Por favor, preencha o CEP para entrega.');
        return;
      }
      if (!rua) {
        alert('Por favor, preencha o endereço (rua).');
        return;
      }
      if (!numero) {
        alert('O número da residência é obrigatório para entrega.');
        return;
      }
      if (!bairro) {
        alert('Por favor, preencha o bairro.');
        return;
      }
      if (!cidade) {
        alert('Por favor, preencha a cidade.');
        return;
      }
    }
    if (!data) {
      alert('Por favor, escolha uma data para encomenda.');
      return;
    }

    onPlaceOrder({
      clienteNome,
      whatsapp,
      tipoEntrega,
      data,
      horario,
      saborId: tipoBolo === 'doce' ? saborId : tipoBolo === 'salgado' ? tamanhoSalgadoId : saborPiscinaId,
      saborNome: finalSaborNome,
      tamanhoId: tipoBolo === 'doce' ? tamanhoId : tipoBolo === 'salgado' ? tamanhoSalgadoId : 'piscina-unico',
      tamanhoLabel: summaryLabel,
      adicionais: [...adicionaisSelecionados, ...(detalhesVal ? [detalhesVal] : [])],
      adicionaisPreco: extrasPreco,
      total,
      formaPagamento,
      status: 'pendente',
      detalhes: detalhesVal,
      massa: tipoBolo === 'doce' ? massa : undefined,
      quantidadeRecheios: tipoBolo === 'doce' ? quantidadeRecheios : undefined,
      recheio1Id: tipoBolo === 'doce' ? saborId : undefined,
      recheio1Nome: tipoBolo === 'doce' ? recheio1?.nome : undefined,
      recheio2Id: (tipoBolo === 'doce' && recheio2) ? recheio2Id : undefined,
      recheio2Nome: (tipoBolo === 'doce' && recheio2) ? recheio2.nome : undefined,
      tipoBolo,
      ...(tipoEntrega === 'entrega' ? {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      } : {
        nomeRetirada: nomeRetirada.trim() || clienteNome
      })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* IDENTIFICAÇÃO Card */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/10 pb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-label-md text-label-md text-secondary tracking-wider uppercase">1. Identificação</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="nome">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              required
              className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/40"
              placeholder="Como podemos te chamar?"
              value={clienteNome}
              onChange={(e) => setClienteNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="tel">
              WhatsApp
            </label>
            <input
              id="tel"
              type="tel"
              required
              className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/40"
              placeholder="(00) 00000-0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ENTREGA OU RETIRADA Card */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/10 pb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-label-md text-label-md text-secondary tracking-wider uppercase">2. Entrega ou Retirada</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            type="button"
            onClick={() => setTipoEntrega('retirada')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer h-24 ${
              tipoEntrega === 'retirada'
                ? 'bg-primary-container/40 border-primary text-secondary font-semibold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <MapPin className={`w-6 h-6 mb-2 ${tipoEntrega === 'retirada' ? 'text-primary' : 'text-outline/60'}`} />
            <span className="font-label-md text-xs">Retirada em Loja</span>
          </button>

          <button
            type="button"
            onClick={() => setTipoEntrega('entrega')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer h-24 ${
              tipoEntrega === 'entrega'
                ? 'bg-primary-container/40 border-primary text-secondary font-semibold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <Clock className={`w-6 h-6 mb-2 ${tipoEntrega === 'entrega' ? 'text-primary' : 'text-outline/60'}`} />
            <span className="font-label-md text-xs">Solicitar Entrega</span>
          </button>
        </div>

        {tipoEntrega === 'retirada' && (
          <div className="space-y-4 border-t border-outline-variant/10 pt-4 animate-in fade-in duration-300">
            <div className="bg-primary-container/20 p-3 rounded-lg text-[11px] text-secondary leading-normal space-y-1.5">
              <p>🏪 O bolo estará disponível e reservado para retirada direto no endereço da Dona Cleusa.</p>
              <div className="text-[10px] text-on-surface-variant font-medium bg-white/45 p-2 rounded border border-outline-variant/10 leading-normal">
                📍 <strong>Endereço de Retirada:</strong> Rua Uiramirins, 70, Jardim Uirá, São José dos Campos - SP
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Uiramirins,+70,+Jardim+Uir%C3%A1,+S%C3%A3o+Jos%C3%A9+dos+Campos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold mt-1.5"
              >
                🗺️ Como chegar no Google Maps
              </a>
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="nomeRetirada">
                Nome de quem retira (Opcional)
              </label>
              <input
                id="nomeRetirada"
                type="text"
                className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/40"
                placeholder="Quem vai retirar na Cleusa?"
                value={nomeRetirada}
                onChange={(e) => setNomeRetirada(e.target.value)}
              />
            </div>
          </div>
        )}

        {tipoEntrega === 'entrega' && (
          <div className="space-y-4 border-t border-outline-variant/10 pt-4 animate-in fade-in duration-300">
            <div className="bg-primary-container/15 border border-primary-container/30 p-3 rounded-lg text-[11px] text-[#2c1a00] leading-normal flex items-start gap-2">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>🛵 <strong>Atenção:</strong> As entregas são realizadas exclusivamente na cidade de <strong>São José dos Campos</strong> com uma taxa de entrega fixa de <strong>R$ {taxaEntrega.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (já somada ao total abaixo).</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="cep">
                  CEP
                </label>
                <input
                  id="cep"
                  type="text"
                  required
                  placeholder="12210-000"
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none"
                  value={cep}
                  onChange={handleCepChange}
                />
                {cepLoading && <span className="text-[10px] text-primary mt-1 block">Carregando endereço...</span>}
                {cepError && <span className="text-[10px] text-[#ba1a1a] mt-1 block font-semibold">{cepError}</span>}
              </div>

              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="rua">
                  Logradouro/Rua
                </label>
                <input
                  id="rua"
                  type="text"
                  required
                  placeholder="Rua, Avenida, etc"
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="numero">
                  Número
                </label>
                <input
                  id="numero"
                  type="text"
                  required
                  placeholder="123"
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="complemento">
                  Complemento/Apto
                </label>
                <input
                  id="complemento"
                  type="text"
                  placeholder="Bloco B, Ap 24 (Opcional)"
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="bairro">
                  Bairro
                </label>
                <input
                  id="bairro"
                  type="text"
                  required
                  placeholder="Jardim Uirá"
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="estado">
                  UF
                </label>
                <input
                  id="estado"
                  type="text"
                  required
                  placeholder="SP"
                  maxLength={2}
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-center"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="cidade">
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                required
                placeholder="São José dos Campos"
                className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* DATA & HORÁRIO } */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/10 pb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-label-md text-label-md text-secondary tracking-wider uppercase">3. Data & Horário da Entrega</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="data">
              Data Desejada
            </label>
            <input
              id="data"
              type="date"
              required
              className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="horario">
              Horário Comercial (08h às 18h)
            </label>
            <select
              id="horario"
              className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            >
              {BUSINESS_HOURS.map((hr) => (
                <option key={hr} value={hr}>
                  {hr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PERSONALIZE SEU BOLO (Renamed to Faça seu Pedido) */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex flex-col gap-1 mb-4 border-b border-outline-variant/10 pb-3">
          <div className="flex items-center gap-3">
            <Cake className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-lg font-bold text-secondary">4. Faça seu Pedido</h3>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Escolha o modelo de bolo que deseja encomendar da Dona Cleusa</p>
        </div>

        {/* CATEGORY VISUAL CARDS WITH CUSTOM PHOTOS */}
        <div id="cake-category-cards" className="grid grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setTipoBolo('doce')}
            className={`group relative flex flex-col items-center justify-end rounded-xl overflow-hidden aspect-[4/5] border-2 transition-all cursor-pointer ${
              tipoBolo === 'doce'
                ? 'border-primary ring-2 ring-primary/25 shadow-md scale-[1.02]'
                : 'border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]'
            }`}
          >
            <img 
              src={imagemBoloDoce || "https://lh3.googleusercontent.com/aida-public/AB6AXuDgm8Ww9FF4UuIIV4mS5CCF1rzWZ-TpARtIhG-Q5ZoiqvPuZ3W2BatsiIeYhoq1LrFPjUqDo5eSLxClwZ2RpmjXLkcHNPkEdYwBIMfod0OKPIhC_7bOnVqRCMp3yF-sLGdAYwqpHfQUChex6La0BHwWe642yGrol6f7Ivq95C9UrNm-D7sDjSXgkJDLrXmf8o4zAMVxdchfs2Y1FK7Xk6hr4y2ODbctk93w0SNa35rHexu3VB-km660W5gljd1HxBd37tUZRYUW7rye"} 
              alt="Bolo Doce" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10 p-2 text-center w-full">
              <span className="block text-white text-[11px] font-black uppercase tracking-wide drop-shadow-sm">🍰 Doce</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTipoBolo('salgado')}
            className={`group relative flex flex-col items-center justify-end rounded-xl overflow-hidden aspect-[4/5] border-2 transition-all cursor-pointer ${
              tipoBolo === 'salgado'
                ? 'border-primary ring-2 ring-primary/25 shadow-md scale-[1.02]'
                : 'border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]'
            }`}
          >
            <img 
              src={imagemBoloSalgado || "https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=800&auto=format&fit=crop&q=80"} 
              alt="Bolo Salgado" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10 p-2 text-center w-full">
              <span className="block text-white text-[11px] font-black uppercase tracking-wide drop-shadow-sm">🥪 Salgado</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTipoBolo('piscina')}
            className={`group relative flex flex-col items-center justify-end rounded-xl overflow-hidden aspect-[4/5] border-2 transition-all cursor-pointer ${
              tipoBolo === 'piscina'
                ? 'border-primary ring-2 ring-primary/25 shadow-md scale-[1.02]'
                : 'border-transparent opacity-85 hover:opacity-100 hover:scale-[1.01]'
            }`}
          >
            <img 
              src={imagemBoloPiscina || "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80"} 
              alt="Bolo Piscina" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10 p-2 text-center w-full">
              <span className="block text-white text-[11px] font-black uppercase tracking-wide drop-shadow-sm">🌋 Piscina</span>
            </div>
          </button>
        </div>

        {/* DYNAMIC FORM SEGMENTS ACCORDING TO TIPO BOLO */}
        {tipoBolo === 'doce' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Dynamic Image Showcase */}
            {recheio1 && (
              <div className="mb-4 rounded-xl overflow-hidden shadow-md aspect-[16/9] relative group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={recheio1.imagem || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60'}
                  alt={recheio1.nome}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 items-center">
                  <span className="text-on-secondary bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                    {recheio1.nome}
                  </span>
                  {checkIsEspecial(recheio1) && (
                    <span className="text-white bg-tertiary px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      ⭐ Especial (+R$ {getSaborAdicional(recheio1).toFixed(2)})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Escolha a Massa */}
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-2 font-bold uppercase tracking-wider">
                🍰 Escolha a Massa do Bolo
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMassa('branca')}
                  className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                    massa === 'branca'
                      ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                      : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="font-label-md text-sm">🍞 Massa Branca</span>
                  <span className="text-[10px] mt-0.5 opacity-80">Baunilha tradicional</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMassa('preta')}
                  className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                    massa === 'preta'
                      ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                      : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="font-label-md text-sm">🍫 Massa Preta</span>
                  <span className="text-[10px] mt-0.5 opacity-80">Chocolate cacau</span>
                </button>
              </div>
            </div>

            {/* Quantidade de Recheios */}
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-2 font-bold uppercase tracking-wider">
                🥄 Quantidade de Recheios
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuantidadeRecheios(1)}
                  className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                    quantidadeRecheios === 1
                      ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                      : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="font-label-md text-sm">1 Recheio</span>
                  <span className="text-[10px] mt-0.5 opacity-80">Suave sabor único</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuantidadeRecheios(2)}
                  className={`py-3 px-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                    quantidadeRecheios === 2
                      ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                      : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="font-label-md text-sm">2 Recheios distintos</span>
                  <span className="text-[10px] mt-0.5 font-bold text-primary animate-pulse">+ R$ {taxaDoisRecheios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </button>
              </div>
            </div>

            {/* Primeiro Recheio */}
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-wider" htmlFor="recheio1">
                🧁 {quantidadeRecheios === 2 ? 'Primeiro Recheio' : 'Sabor do Recheio'}
              </label>
              <select
                id="recheio1"
                className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-xs font-semibold"
                value={saborId}
                onChange={(e) => setSaborId(e.target.value)}
              >
                {disponivelSabores.map((sab) => {
                  const isEspecial = checkIsEspecial(sab);
                  const extraPrice = typeof sab.adicionalPreco === 'number' ? sab.adicionalPreco : taxaSaborEspecial;
                  return (
                    <option key={sab.id} value={sab.id}>
                      {sab.nome} {isEspecial ? `⭐️ (Especial +R$ ${extraPrice.toFixed(2)})` : '🍰 (Tradicional sem custo)'}
                    </option>
                  );
                })}
              </select>
              {recheio1?.descricao && (
                <p className="mt-1 text-xs text-on-surface-variant italic font-sans font-medium">{recheio1.descricao}</p>
              )}
            </div>

            {/* Segundo Recheio */}
            {quantidadeRecheios === 2 && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <label className="block font-label-md text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-wider" htmlFor="recheio2">
                  🧁 Segundo Recheio
                </label>
                <select
                  id="recheio2"
                  className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-xs font-semibold"
                  value={recheio2Id}
                  onChange={(e) => setRecheio2Id(e.target.value)}
                >
                  {disponivelSabores.map((sab) => {
                    const isEspecial = checkIsEspecial(sab);
                    const extraPrice = typeof sab.adicionalPreco === 'number' ? sab.adicionalPreco : taxaSaborEspecial;
                    return (
                      <option key={sab.id} value={sab.id}>
                        {sab.nome} {isEspecial ? `⭐️ (Especial +R$ ${extraPrice.toFixed(2)})` : '🍰 (Tradicional sem custo)'}
                      </option>
                    );
                  })}
                </select>
                {recheio2?.descricao && (
                  <p className="mt-1 text-xs text-on-surface-variant italic font-sans font-medium">{recheio2.descricao}</p>
                )}
              </div>
            )}

            {/* Escolha o Tamanho */}
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-2 font-bold uppercase tracking-wider">
                📐 Escolha o Tamanho do Bolo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tamanhos.map((tam) => (
                  <button
                    key={tam.id}
                    type="button"
                    onClick={() => setTamanhoId(tam.id)}
                    className={`py-3 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                      tamanhoId === tam.id
                        ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                        : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="font-label-md text-xs">{tam.label}</span>
                    <span className="text-[10px] mt-0.5 font-sans opacity-85">{tam.fatias}</span>
                    <span className="text-[11px] mt-1 font-bold font-serif text-secondary">
                      R$ {(180.00 + tam.adicionalPreco).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tipoBolo === 'salgado' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* High quality savory cake showcase image */}
            <div className="mb-4 rounded-xl overflow-hidden shadow-md aspect-[16/9] relative group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=60"
                alt="Bolo Salgado Cleusa"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <span className="text-on-secondary bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                  Bolo Salgado Clássico
                </span>
              </div>
            </div>

            {/* Note listing ingredients of chicken pie */}
            <div className="bg-orange-50/25 p-3.5 rounded-xl border border-orange-100/40 text-xs leading-relaxed text-on-surface font-sans font-medium">
              🍗 Pão de forma super macio, frango cozido e temperado desfiado, purê artesanal, milho verde cozido, coberturas decorativas crocantes de batata palha fina!
            </div>

            {/* Sizes of Salgados */}
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-2 font-bold uppercase tracking-wider">
                📐 Escolha o Tamanho do Bolo Salgado
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tamanhosSalgado.map((tam) => (
                  <button
                    key={tam.id}
                    type="button"
                    onClick={() => setTamanhoSalgadoId(tam.id)}
                    className={`py-3.5 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                      tamanhoSalgadoId === tam.id
                        ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                        : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="font-label-md text-xs font-bold text-on-surface">{tam.label}</span>
                    <span className="text-[10px] mt-0.5 opacity-80">{tam.fatias}</span>
                    <span className="text-[11px] mt-1 font-bold text-primary font-serif">R$ {tam.preco.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tipoBolo === 'piscina' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Beautiful Pool Cake representation */}
            <div className="mb-4 rounded-xl overflow-hidden shadow-md aspect-[16/9] relative group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&auto=format&fit=crop&q=60"
                alt="Bolo Piscina"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
              <div className="absolute bottom-3 left-3 flex items-center justify-between w-[92%]">
                <span className="text-on-secondary bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                  Bolo Piscina / Vulcão
                </span>
                <span className="bg-tertiary text-white font-bold text-xs px-2.5 py-1 rounded-full">
                  R$ {precoPiscina.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Select Piscina flavor */}
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1 font-bold uppercase tracking-wider" htmlFor="saborPiscina">
                🍮 Escolha o Sabor da Cobertura Fluida
              </label>
              <select
                id="saborPiscina"
                className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-xs font-semibold"
                value={saborPiscinaId}
                onChange={(e) => setSaborPiscinaId(e.target.value)}
              >
                {disponivelPiscinas.map((sab) => (
                  <option key={sab.id} value={sab.id}>
                    🍮 {sab.nome} (Preço único de R$ {precoPiscina.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <hr className="my-5 border-outline-variant/10" />

        {/* EXTRAS AND DETAIL REMAINING FIELDS */}
        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-2 font-bold uppercase tracking-wider">
              🎁 Adicionais/Extras Opcionais (Dona Cleusa)
            </label>
            <div className="flex flex-wrap gap-2">
              {extras.map((ext) => {
                const isSelected = adicionaisSelecionados.includes(ext.nome);
                return (
                  <button
                    key={ext.id}
                    type="button"
                    onClick={() => toggleExtra(ext.nome)}
                    className={`px-3 py-2 rounded-full border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-white border-secondary shadow-sm'
                        : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{ext.nome}</span>
                    <span className={`font-semibold ${isSelected ? 'text-secondary-container font-mono' : 'text-tertiary font-mono'}`}>
                      +R$ {ext.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-label-md text-xs text-[#0a1e05] mb-1 font-bold uppercase tracking-wider" htmlFor="detalhes">
              ✍️ Informações Adicionais / Velinhas / Observações
            </label>
            <textarea
              id="detalhes"
              className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/40 h-20 text-xs font-semibold"
              placeholder="Ex: Escrever 'Parabéns Cleusa!' no topo do bolo, detalhes das velinhas, etc..."
              value={detalhesVal}
              onChange={(e) => setDetalhesVal(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MÉTODO DE PAGAMENTO Card */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/10 pb-2">
          <span>💵</span>
          <h3 className="font-label-md text-label-md text-secondary tracking-wider uppercase">5. Forma de Pagamento</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFormaPagamento('pix')}
            className={`py-3.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
              formaPagamento === 'pix'
                ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
            }`}
          >
            <span className="text-sm">📱 Pix</span>
            <span className="text-[9px] mt-0.5 opacity-80">Rápido e seguro</span>
          </button>

          <button
            type="button"
            onClick={() => setFormaPagamento('cartao')}
            className={`py-3.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
              formaPagamento === 'cartao'
                ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
            }`}
          >
            <span className="text-sm">💳 Cartão</span>
            <span className="text-[9px] mt-0.5 opacity-80">Na maquininha</span>
          </button>

          <button
            type="button"
            onClick={() => setFormaPagamento('dinheiro')}
            className={`py-3.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
              formaPagamento === 'dinheiro'
                ? 'bg-primary-container border-primary text-secondary font-bold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
            }`}
          >
            <span className="text-sm">💵 Dinheiro</span>
            <span className="text-[9px] mt-0.5 opacity-80">No ato da entrega</span>
          </button>
        </div>
      </div>

      {/* FLOATING SUBMISSION FOOTER WITH TOTAL COUNTER */}
      <div className="fixed bottom-16 left-0 w-full z-40 bg-surface/95 backdrop-blur-md py-3 px-4 shadow-[0px_-8px_25px_rgba(75,54,33,0.08)] border-t border-outline-variant/10 flex justify-between items-center max-w-xl mx-auto left-1/2 -translate-x-1/2 rounded-t-2xl animate-in slide-in-from-bottom-5 duration-400">
        <div className="flex flex-col">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Total Calculado</span>
          <span className="font-serif font-black text-secondary text-lg">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <button
          type="submit"
          className="bg-primary text-white font-serif px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-primary/95 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer border border-primary/25"
        >
          Confirmar Encomenda
        </button>
      </div>
    </form>
  );
}
