import React, { useState, useEffect } from 'react';
import { BoloSabor, BoloTamanho, AdicionalExtra, Pedido } from '../types';
import { User, Phone, MapPin, ClipboardList, Calendar, Clock, Cake, Check, DollarSign } from 'lucide-react';

interface OrderFormProps {
  sabores: BoloSabor[];
  tamanhos: BoloTamanho[];
  extras: AdicionalExtra[];
  onPlaceOrder: (pedido: Omit<Pedido, 'id' | 'codigo' | 'dataCriacao'>) => void;
  taxaDoisRecheios: number;
}

export default function OrderForm({ sabores, tamanhos, extras, onPlaceOrder, taxaDoisRecheios }: OrderFormProps) {
  const disponivelSabores = sabores.filter(s => s.status === 'disponivel');
  
  // State variables for form inputs
  const [clienteNome, setClienteNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<'retirada' | 'entrega'>('retirada');
  const [nomeRetirada, setNomeRetirada] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('14:00');
  const [saborId, setSaborId] = useState(disponivelSabores[0]?.id || '1');
  const [recheio2Id, setRecheio2Id] = useState(disponivelSabores[1]?.id || disponivelSabores[0]?.id || '1');
  const [massa, setMassa] = useState<'branca' | 'preta'>('branca');
  const [quantidadeRecheios, setQuantidadeRecheios] = useState<1 | 2>(1);
  const [tamanhoId, setTamanhoId] = useState('p');
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

  // Auto fallback if flavor is changed or deleted
  useEffect(() => {
    if (disponivelSabores.length > 0 && !disponivelSabores.some(s => s.id === saborId)) {
      setSaborId(disponivelSabores[0].id);
    }
  }, [sabores]);

  const selectedSabor = sabores.find(s => s.id === saborId) || sabores[0];
  const selectedTamanho = tamanhos.find(t => t.id === tamanhoId) || tamanhos[0];

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
    
    // Format as 00000-000
    let formatted = value;
    if (value.length > 5) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setCep(formatted);

    if (value.length === 8) {
      fetchCep(value);
    }
  };

  // Math calculation
  const recheio1 = sabores.find(s => s.id === saborId) || sabores[0];
  const recheio2 = quantidadeRecheios === 2 ? (sabores.find(s => s.id === recheio2Id) || sabores[0]) : null;

  // If they choose 2 fillings, we take the highest base price to cover cost, or just recheio1's price. Let's take the highest price.
  const fillingsBasePreco = recheio2
    ? Math.max(recheio1?.precoBase || 0, recheio2?.precoBase || 0)
    : (recheio1?.precoBase || 0);

  const doubleFillingSurcharge = quantidadeRecheios === 2 ? taxaDoisRecheios : 0;
  const tamanhoPreco = selectedTamanho ? selectedTamanho.adicionalPreco : 0;
  
  // Extras calculations
  const extrasPreco = adicionaisSelecionados.reduce((sum, item) => {
    const matched = extras.find(e => e.nome === item);
    return sum + (matched ? matched.preco : 0);
  }, 0);

  const total = fillingsBasePreco + doubleFillingSurcharge + tamanhoPreco + extrasPreco;

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

    const finalSaborNome = recheio2
      ? `${recheio1?.nome || 'Personalizado'} + ${recheio2?.nome || 'Personalizado'}`
      : (recheio1?.nome || 'Personalizado');

    onPlaceOrder({
      clienteNome,
      whatsapp,
      tipoEntrega,
      data,
      horario,
      saborId,
      saborNome: finalSaborNome,
      tamanhoId,
      tamanhoLabel: selectedTamanho?.label || 'P (1kg)',
      adicionais: [...adicionaisSelecionados, ...(detalhesVal ? [detalhesVal] : [])],
      adicionaisPreco: extrasPreco + doubleFillingSurcharge,
      total,
      formaPagamento,
      status: 'pendente',
      detalhes: detalhesVal,
      massa,
      quantidadeRecheios,
      recheio1Id: saborId,
      recheio1Nome: recheio1?.nome,
      recheio2Id: recheio2 ? recheio2Id : undefined,
      recheio2Nome: recheio2 ? recheio2.nome : undefined,
      // Add optional delivery location details
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
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
              tipoEntrega === 'retirada'
                ? 'bg-primary-container/40 border-primary text-secondary font-semibold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <MapPin className={`w-6 h-6 mb-2 ${tipoEntrega === 'retirada' ? 'text-primary' : 'text-outline/60'}`} />
            <span className="font-label-md">Retirada em Loja</span>
          </button>

          <button
            type="button"
            onClick={() => setTipoEntrega('entrega')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
              tipoEntrega === 'entrega'
                ? 'bg-primary-container/40 border-primary text-secondary font-semibold shadow-inner'
                : 'border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface-variant'
            }`}
          >
            <Clock className={`w-6 h-6 mb-2 ${tipoEntrega === 'entrega' ? 'text-primary' : 'text-outline/60'}`} />
            <span className="font-label-md">Solicitar Entrega</span>
          </button>
        </div>

        {tipoEntrega === 'retirada' && (
          <div className="space-y-4 border-t border-outline-variant/10 pt-4 animate-in fade-in duration-300">
            <div className="bg-primary-container/20 p-3 rounded-lg text-[11px] text-secondary leading-normal space-y-1.5">
              <p>🏪 O bolo estará disponivel e reservado para retirada direto no endereço da Dona Cleusa.</p>
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
                Nome de quem vai retirar o bolo (Segurança)
              </label>
              <input
                id="nomeRetirada"
                type="text"
                placeholder="Ex: Deixe em branco se for você mesmo"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                value={nomeRetirada}
                onChange={(e) => setNomeRetirada(e.target.value)}
              />
              <p className="text-[10px] text-outline/65 mt-1">
                * Por segurança, se outra pessoa for realizar a retirada, informe o nome dela aqui.
              </p>
            </div>
          </div>
        )}

        {tipoEntrega === 'entrega' && (
          <div className="space-y-4 border-t border-outline-variant/10 pt-4 animate-in fade-in duration-300">
            <div className="bg-primary-container/20 p-3 rounded-lg text-[11px] text-secondary leading-normal">
              🌟 Digite seu CEP de entrega de 8 dígitos para preencher o endereço automaticamente.
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="cep">
                  CEP
                </label>
                <div className="relative">
                  <input
                    id="cep"
                    type="text"
                    required
                    placeholder="00000-000"
                    className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    value={cep}
                    onChange={handleCepChange}
                  />
                  {cepLoading && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-mono animate-pulse">
                      ...
                    </span>
                  )}
                </div>
                {cepError && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">{cepError}</p>
                )}
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => fetchCep(cep)}
                  disabled={cepLoading || cep.replace(/\D/g, '').length !== 8}
                  className="w-full h-11 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-opacity-95 disabled:bg-outline-variant/30 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="rua">
                Rua / Logradouro <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                id="rua"
                type="text"
                required
                placeholder="Ex: Avenida Copacabana"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="numero">
                  Número <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="numero"
                  type="text"
                  required
                  placeholder="Ex: 123"
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="complemento">
                  Complemento (Opcional)
                </label>
                <input
                  id="complemento"
                  type="text"
                  placeholder="Ex: Ap 34 Bloco B"
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="bairro">
                  Bairro <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="bairro"
                  type="text"
                  required
                  placeholder="Ex: Jardim Paulista"
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="estado">
                  Estado (UF) <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="estado"
                  type="text"
                  required
                  placeholder="Ex: SP"
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="cidade">
                Cidade <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                id="cidade"
                type="text"
                required
                placeholder="Ex: São Paulo"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* AGENDAMENTO Card */}
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

      {/* PERSONALIZE SEU BOLO Card */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/10 pb-2">
          <Cake className="w-5 h-5 text-primary" />
          <h3 className="font-label-md text-label-md text-secondary tracking-wider uppercase">4. Personalize seu Bolo</h3>
        </div>

        {/* Dynamic Image Showcase */}
        {selectedSabor && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-md aspect-[16/9] relative group">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={selectedSabor.imagem}
              alt={selectedSabor.nome}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"></div>
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 items-center">
              <span className="text-on-secondary bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                {selectedSabor.nome}
              </span>
              {selectedSabor.tag && selectedSabor.tag !== 'none' && (
                <span className="text-secondary-container bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                  {selectedSabor.tag === 'best-seller' ? 'Best-Seller' : 'Sazonal'}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          
          {/* Escolha a Massa */}
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-2">
              Escolha a Massa do Bolo
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
            <label className="block font-label-md text-xs text-on-surface-variant mb-2">
              Quantidade de Recheios
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
                <span className="text-[10px] mt-0.5 opacity-80">Sabor único</span>
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
                <span className="font-label-md text-sm">2 Recheios</span>
                <span className="text-[10px] mt-0.5 mt-0.5 font-bold text-primary animate-pulse">+ R$ {taxaDoisRecheios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </button>
            </div>
          </div>

          {/* Primeiro Recheio */}
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="recheio1">
              {quantidadeRecheios === 2 ? 'Primeiro Recheio' : 'Escolha seu Recheio (Sabor do Bolo)'}
            </label>
            <select
              id="recheio1"
              className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-xs font-semibold"
              value={saborId}
              onChange={(e) => setSaborId(e.target.value)}
            >
              {disponivelSabores.map((sab) => (
                <option key={sab.id} value={sab.id}>
                  {sab.nome} (Base: R$ {sab.precoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </option>
              ))}
            </select>
            {recheio1?.descricao && (
              <p className="mt-1 text-xs text-on-surface-variant italic font-sans">{recheio1.descricao}</p>
            )}
          </div>

          {/* Segundo Recheio (Condicional) */}
          {quantidadeRecheios === 2 && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="recheio2">
                Segundo Recheio
              </label>
              <select
                id="recheio2"
                className="w-full h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-xs font-semibold"
                value={recheio2Id}
                onChange={(e) => setRecheio2Id(e.target.value)}
              >
                {disponivelSabores.map((sab) => (
                  <option key={sab.id} value={sab.id}>
                    {sab.nome} (Base: R$ {sab.precoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                  </option>
                ))}
              </select>
              {sabores.find(s => s.id === recheio2Id)?.descricao && (
                <p className="mt-1 text-xs text-on-surface-variant italic font-sans">{sabores.find(s => s.id === recheio2Id)?.descricao}</p>
              )}
            </div>
          )}

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-2">
              Escolha o Tamanho
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tamanhos.map((tam) => (
                <button
                  key={tam.id}
                  type="button"
                  onClick={() => setTamanhoId(tam.id)}
                  className={`py-3 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
                    tamanhoId === tam.id
                      ? 'bg-primary-container border-primary text-secondary font-semibold'
                      : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
                  }`}
                >
                  <span className="font-label-md text-sm">{tam.label}</span>
                  <span className="text-[10px] mt-0.5 opacity-80">{tam.fatias}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-2">
              Adicionais/Extras Opcionais
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
                    <span className={`font-semibold ${isSelected ? 'text-secondary-container' : 'text-tertiary'}`}>
                      +R$ {ext.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1" htmlFor="detalhes">
              Informações Adicionais / Velinhas / Observações
            </label>
            <textarea
              id="detalhes"
              className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/40 h-20"
              placeholder="Ex: Escrever 'Parabéns Maria' no topo do bolo, velas extras, etc..."
              value={detalhesVal}
              onChange={(e) => setDetalhesVal(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MÉTODO DE PAGAMENTO Card */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 text-on-surface">
        <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/10 pb-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="font-label-md text-label-md text-secondary tracking-wider uppercase">5. Método de Pagamento</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFormaPagamento('pix')}
            className={`py-3 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
              formaPagamento === 'pix'
                ? 'bg-primary-container border-primary text-secondary font-semibold'
                : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
            }`}
          >
            <span className="font-label-md text-sm">Pix</span>
            <span className="text-[9px] mt-0.5 opacity-80">Online</span>
          </button>

          <button
            type="button"
            onClick={() => setFormaPagamento('cartao')}
            className={`py-3 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
              formaPagamento === 'cartao'
                ? 'bg-primary-container border-primary text-secondary font-semibold'
                : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
            }`}
          >
            <span className="font-label-md text-sm">Cartão</span>
            <span className="text-[9px] mt-0.5 opacity-80">Maquininha</span>
          </button>

          <button
            type="button"
            onClick={() => setFormaPagamento('dinheiro')}
            className={`py-3 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-center items-center ${
              formaPagamento === 'dinheiro'
                ? 'bg-primary-container border-primary text-secondary font-semibold'
                : 'border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant'
            }`}
          >
            <span className="font-label-md text-sm">Dinheiro</span>
            <span className="text-[9px] mt-0.5 opacity-80">Na Entrega</span>
          </button>
        </div>

        {formaPagamento === 'pix' ? (
          <div className="mt-4 p-3 bg-secondary-container/20 border border-secondary-container/10 rounded-lg text-xs text-secondary leading-normal space-y-1 animate-in fade-in duration-300">
            <p>📱 <strong>Chave Pix Celular Dona Cleusa:</strong> 12 98827-5469</p>
            <p className="text-on-surface-variant/80">👉 Após finalizar o pedido, geraremos o Pix Copia e Cola para você realizar o pagamento rapidamente. Caso pague adiantado para agilizar o preparo, favor enviar o comprovante pelo WhatsApp!</p>
          </div>
        ) : formaPagamento === 'cartao' ? (
          <div className="mt-4 p-3 bg-surface-container rounded-lg text-xs text-on-surface-variant leading-normal animate-in fade-in duration-300">
            💳 <strong>Pagamento na Maquininha:</strong> Aceitamos as principais bandeiras de débito e crédito na retirada ou no ato da entrega.
          </div>
        ) : (
          <div className="mt-4 p-3 bg-surface-container rounded-lg text-xs text-on-surface-variant leading-normal animate-in fade-in duration-300">
            💵 <strong>Pagamento em Dinheiro:</strong> Favor facilitar o troco caso precise. Informe nas observações do bolo se necessita de troco para algum valor específico.
          </div>
        )}
      </div>

      {/* Bill card & Proceed summary */}
      <div className="bg-primary-container p-5 rounded-xl border border-primary/20 flex flex-col gap-3 shadow-[0px_4px_20px_rgba(115,87,91,0.06)]">
        <div className="flex justify-between items-center pb-2 border-b border-primary/10">
          <h4 className="font-serif text-xl tracking-tight text-secondary">Total do Pedido</h4>
          <span className="font-serif text-2xl font-bold text-secondary">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="text-xs text-on-surface-variant space-y-1">
          <div className="flex justify-between">
            <span>Massa do Bolo</span>
            <span className="font-semibold text-on-surface capitalize">{massa === 'preta' ? 'Preta (Chocolate)' : 'Branca'}</span>
          </div>
          <div className="flex justify-between">
            <span>Recheio {quantidadeRecheios === 2 ? '1' : ''} ({recheio1?.nome})</span>
            <span className="font-medium text-on-surface">R$ {recheio1?.precoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          {quantidadeRecheios === 2 && recheio2 && (
            <>
              <div className="flex justify-between">
                <span>Recheio 2 ({recheio2?.nome})</span>
                <span className="font-medium text-on-surface">R$ {recheio2?.precoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-primary font-bold">
                <span>Taxa de Costura de 2 Recheios</span>
                <span>+R$ {taxaDoisRecheios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span>Adicional de Tamanho ({selectedTamanho?.label})</span>
            <span className="font-medium text-on-surface">R$ {tamanhoPreco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          {extrasPreco > 0 && (
            <div className="flex justify-between text-tertiary">
              <span>Adicionais Opcionais</span>
              <span className="font-medium">R$ {extrasPreco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-12 bg-secondary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/95 active:scale-[0.98] transition-all font-semibold font-sans shadow-md"
        >
          <Check className="w-5 h-5" />
          <span>Finalizar Pedido</span>
        </button>
      </div>
    </form>
  );
}
