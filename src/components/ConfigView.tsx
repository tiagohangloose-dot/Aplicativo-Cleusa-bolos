import React, { useState } from 'react';
import { BoloSabor, AdicionalExtra } from '../types';
import { Cake, Plus, X, Search, SlidersHorizontal, Image, DollarSign, Save } from 'lucide-react';

interface ConfigViewProps {
  sabores: BoloSabor[];
  extras: AdicionalExtra[];
  onAddSabor: (sabor: BoloSabor) => void;
  onUpdateSabor: (id: string, updatedFields: Partial<BoloSabor>) => void;
  onAddExtra: (extra: AdicionalExtra) => void;
  onDeleteExtra: (id: string) => void;
  onSaveAll: () => void;
  onLogout: () => void;
  taxaDoisRecheios: number;
  onUpdateTaxaDoisRecheios: (val: number) => void;
}

// Preset visual links for Dona Cleusa to pick gorgeous cake illustrations easily!
const CAKE_IMAGE_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgm8Ww9FF4UuIIV4mS5CCF1rzWZ-TpARtIhG-Q5ZoiqvPuZ3W2BatsiIeYhoq1LrFPjUqDo5eSLxClwZ2RpmjXLkcHNPkEdYwBIMfod0OKPIhC_7bOnVqRCMp3yF-sLGdAYwqpHfQUChex6La0BHwWe642yGrol6f7Ivq95C9UrNm-D7sDjSXgkJDLrXmf8o4zAMVxdchfs2Y1FK7Xk6hr4y2ODbctk93w0SNa35rHexu3VB-km660W5gljd1HxBd37tUZRYUW7rye',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZE1hJZd5eJcNaw2nwTTT2E5Ky9Mo7L9T2wrLRe1M7DO_9td7tTATU0WWjCRbK9PHyQ9pgMgaAP6cukfYgGSPrCYXTamR-o6NK9_xKvmVVytap41dhClVadX4tkzd7oBxLFWQxYtxganAITH2Z_mKWJCps2gNkH8xQRVOOOd5oYSsW-KYeU-SOtH8lf5oSZslPt1VZIhqg9oayJgHkv7yxBWmEzO3EmriDyIdaOuAgrsw0ILXj8qWQ7ZOSuhf36NGAHP78kbRj_Pq',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1wLPPELY9bQTjH0xcYN3A7LfNHJBbQj0M4c7OE35spzpddvxfAgJN2jzpk7sPo1w0FOe1bXCjF_qb6mWv2wBP1lmXwqDIdZs6_96QsNTc-yaO4WNmYBMrhh--5jRZX0qz3-Kb8zGf2XcjtBSrOblD_IajOGlb9R6ZabnXvLRH2LMs1fYdPTDbmq6z_GCsiSEm9ZEIQtU1X5eVFbFIPdWr7Faj3j7-hYu_8keb-ylHpDMWnY4pC7X5dG7miwLIihl2E3D_kokh5AwR',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgk-zF8jvHloVR36zjGRk_XkvjSfe8mMd8_utsNaEAeSGv0mcoewlnIb8NVY7l9K8HgksEoP1OtVwSgm-PlazXmzW7bN0oOkhk-VHfh6l5z6BmwYT27HeLqQYSFcpM8i6tdezQd5T42NOlXuVMJSX2mWu7cpmik8GYkP0Fo4p6AfMO0UREva0TCYCV5W2LJaUAApUTjX9I1EZUakuS7IPoWhzCMyTjYRwXwNkFA5TkVAFGBVkJeauNkElcDwE_EtQh4w1uIMxzFp94'
];

export default function ConfigView({
  sabores,
  extras,
  onAddSabor,
  onUpdateSabor,
  onAddExtra,
  onDeleteExtra,
  onSaveAll,
  onLogout,
  taxaDoisRecheios,
  onUpdateTaxaDoisRecheios
}: ConfigViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // New flavor form state
  const [newNome, setNewNome] = useState('');
  const [newPeso, setNewPeso] = useState('1.5');
  const [newPreco, setNewPreco] = useState('85.00');
  const [newImgIndex, setNewImgIndex] = useState(0);
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [newTag, setNewTag] = useState<'best-seller' | 'sazonal' | 'none'>('none');

  // Adicionais quick form state
  const [addExtraNome, setAddExtraNome] = useState('');
  const [addExtraPreco, setAddExtraPreco] = useState('');

  // Local feedback timer
  const [saveAllFeedback, setSaveAllFeedback] = useState(false);

  const handleAddNewBolo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome) {
      alert('Por favor, informe o nome do sabor.');
      return;
    }

    const imgToUse = customImgUrl.trim() || CAKE_IMAGE_PRESETS[newImgIndex];
    const newSaborItem: BoloSabor = {
      id: 'sab-' + Date.now(),
      nome: newNome,
      pesoPadrao: parseFloat(newPeso) || 1.0,
      precoBase: parseFloat(newPreco) || 50.00,
      imagem: imgToUse,
      status: 'disponivel',
      tag: newTag
    };

    onAddSabor(newSaborItem);
    
    // reset form
    setNewNome('');
    setNewPeso('1.5');
    setNewPreco('85.00');
    setCustomImgUrl('');
    alert('Sabor cadastrado com sucesso! Ele foi adicionado ao Cardápio Atual.');
  };

  const handleAddNewExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addExtraNome || !addExtraPreco) return;

    onAddExtra({
      id: 'ext-' + Date.now(),
      nome: addExtraNome,
      preco: parseFloat(addExtraPreco) || 5.00
    });

    setAddExtraNome('');
    setAddExtraPreco('');
  };

  const executeSaveAll = () => {
    onSaveAll();
    setSaveAllFeedback(true);
    setTimeout(() => {
      setSaveAllFeedback(false);
    }, 2000);
  };

  // Filter list by search term
  const filteredSabores = sabores.filter(sab =>
    sab.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 text-on-surface">
      {/* Top action and header search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <Search className="w-4 h-4" />
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface outline-none border border-outline-variant/10 focus:ring-1 focus:ring-primary"
            placeholder="Buscar sabor ou adicional..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setSearchTerm('')}
          className="flex items-center justify-center p-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-container/80 cursor-pointer"
          title="Limpar busca"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Taxas da Confeitaria Card */}
      <section className="p-5 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10 animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Taxas da Confeitaria</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Valor Adicional para Bolo de 2 Recheios (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">R$</span>
              <input
                className="w-full bg-surface-container-low rounded-lg p-3 pl-9 text-xs border border-outline-variant/20 focus:border-primary outline-none font-semibold text-secondary"
                type="number"
                step="0.1"
                value={taxaDoisRecheios}
                onChange={(e) => onUpdateTaxaDoisRecheios(parseFloat(e.target.value) || 0)}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant/70 mt-1 leading-normal italic">
              Este valor será adicionado ao preço total do bolo caso o cliente decida montar com 2 sabores de recheio.
            </p>
          </div>
        </div>
      </section>

      {/* Cadastrar Novo Sabor Card (Screen 5 Section 1) */}
      <section className="p-5 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(75,54,33,0.06)] border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-4">
          <Cake className="w-5 h-5 text-tertiary" />
          <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Novo Sabor de Bolo</h3>
        </div>

        <form onSubmit={handleAddNewBolo} className="space-y-4">
          
          {/* Preset image selector */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">
              Selecione uma Ilustração do Bolo
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {CAKE_IMAGE_PRESETS.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer ${
                    newImgIndex === i && !customImgUrl ? 'border-primary ring-2 ring-primary-container' : 'border-transparent'
                  }`}
                  onClick={() => {
                    setNewImgIndex(i);
                    setCustomImgUrl('');
                  }}
                >
                  <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {newImgIndex === i && !customImgUrl && (
                    <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                      <span className="text-[10px] bg-secondary text-white font-mono px-1 rounded">Ativa</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="text"
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs focus:ring-1 focus:ring-primary outline-none placeholder:text-outline/40"
              placeholder="Cole uma URL customizada de imagem aqui se preferir..."
              value={customImgUrl}
              onChange={(e) => setCustomImgUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Nome do Sabor</label>
            <input
              className="w-full bg-surface-container-low rounded-lg p-3 text-xs border border-outline-variant/20 focus:border-primary outline-none"
              placeholder="Ex: Red Velvet com Ninho"
              type="text"
              required
              value={newNome}
              onChange={(e) => setNewNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1 text-xs">Peso Base (kg)</label>
              <input
                className="w-full bg-surface-container-low rounded-lg p-3 text-xs border border-outline-variant/20 outline-none"
                placeholder="1.0"
                step="0.1"
                type="number"
                value={newPeso}
                onChange={(e) => setNewPeso(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1 text-xs">Preço Base (R$)</label>
              <input
                className="w-full bg-surface-container-low rounded-lg p-3 text-xs border border-outline-variant/20 outline-none"
                placeholder="75.00"
                step="0.01"
                type="number"
                value={newPreco}
                onChange={(e) => setNewPreco(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-on-surface-variant mb-1 text-xs">Tag Destaque</label>
              <select
                className="w-full bg-surface-container-low rounded-lg p-2.5 text-xs border border-outline-variant/20 outline-none h-[42px]"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value as any)}
              >
                <option value="none">Nenhum</option>
                <option value="best-seller">Best-Seller</option>
                <option value="sazonal">Sazonal</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow hover:bg-opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Bolo</span>
          </button>
        </form>
      </section>

      {/* Adicionais & Extras Section (Screen 5 Section 2) */}
      <section className="p-5 bg-surface-container-high/30 rounded-xl border border-outline-variant/15">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-secondary" />
            <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">Adicionais Opcionais</span>
          </div>
          <span className="text-[10px] font-sans text-on-surface-variant font-semibold">({extras.length} cadastrados)</span>
        </div>

        {/* Append inline form */}
        <form onSubmit={handleAddNewExtra} className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-surface rounded-lg p-2 text-xs border border-outline-variant/20 outline-none"
            placeholder="Ex: Vela Centelha"
            type="text"
            required
            value={addExtraNome}
            onChange={(e) => setAddExtraNome(e.target.value)}
          />
          <div className="w-24 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px]">R$</span>
            <input
              className="w-full bg-surface rounded-lg p-2 pl-7 text-xs border border-outline-variant/20 outline-none"
              placeholder="10,00"
              step="0.01"
              type="number"
              required
              value={addExtraPreco}
              onChange={(e) => setAddExtraPreco(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-secondary text-white px-3 rounded-lg flex items-center justify-center hover:bg-opacity-90 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Quick list array of existing extras */}
        <div className="flex flex-wrap gap-2">
          {extras.map((ext) => (
            <span
              key={ext.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest border border-outline-variant/35 rounded-full text-xs text-on-surface shadow-sm animate-in zoom-in-75 duration-200"
            >
              <span>{ext.nome}:</span>
              <span className="text-secondary font-bold">R$ {ext.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <button
                type="button"
                onClick={() => onDeleteExtra(ext.id)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-error ml-1 font-bold hover:bg-red-50 cursor-pointer text-[10px]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Cardápio Atual List Header */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1 pt-2 border-t border-outline-variant/10">
          <h3 className="font-serif italic font-bold text-lg text-primary">Cardápio Atual</h3>
          <span className="font-sans text-xs text-on-surface-variant font-semibold">
            {filteredSabores.length} Sabores Cadastrados
          </span>
        </div>

        {/* List of elements */}
        {filteredSabores.map((sab) => {
          const isEnabled = sab.status === 'disponivel';
          return (
            <article
              key={sab.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isEnabled
                  ? 'bg-surface-container-lowest shadow-[0px_4px_20px_rgba(75,54,33,0.04)] border-outline-variant/10'
                  : 'bg-surface-container-low opacity-75 shadow-none grayscale-[0.3] border-dashed border-outline-variant/30'
              }`}
            >
              <div className="flex justify-between items-start mb-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/10">
                    <img className="w-full h-full object-cover" src={sab.imagem} alt={sab.nome} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-on-surface">{sab.nome}</h4>
                    <div className="flex gap-1 items-center mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full font-sans text-[8px] uppercase font-bold ${
                          isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#ba1a1a]'
                        }`}
                      >
                        {isEnabled ? 'Disponível' : 'Indisponível'}
                      </span>
                      {sab.tag && sab.tag !== 'none' && (
                        <span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full font-sans text-[8px] uppercase font-bold">
                          {sab.tag === 'best-seller' ? 'Best-Seller' : 'Sazonal'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Styled checkbox switch switch-box */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isEnabled}
                    onChange={(e) => {
                      onUpdateSabor(sab.id, {
                        status: e.target.checked ? 'disponivel' : 'indisponivel'
                      });
                    }}
                  />
                  <div className="w-10 h-5 bg-outline-variant/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Dynamic inputs for instant price updates */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant/10">
                <div>
                  <span className="block text-[10px] text-on-surface-variant font-semibold mb-1 uppercase">Peso (kg)</span>
                  <input
                    className="w-full bg-surface-container-low/50 rounded-lg p-2 text-xs border border-outline-variant/10 focus:border-primary outline-none"
                    type="number"
                    step="0.1"
                    disabled={!isEnabled}
                    value={sab.pesoPadrao}
                    onChange={(e) => {
                      onUpdateSabor(sab.id, {
                        pesoPadrao: parseFloat(e.target.value) || 1.0
                      });
                    }}
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-on-surface-variant font-semibold mb-1 uppercase font-sans">Preço (R$)</span>
                  <input
                    className="w-full bg-surface-container-low/50 rounded-lg p-2 text-xs border border-outline-variant/10 focus:border-primary outline-none"
                    type="number"
                    step="0.01"
                    disabled={!isEnabled}
                    value={sab.precoBase}
                    onChange={(e) => {
                      onUpdateSabor(sab.id, {
                        precoBase: parseFloat(e.target.value) || 50.00
                      });
                    }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Floating Save All bar */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full px-6 flex justify-center max-w-md">
        <button
          onClick={executeSaveAll}
          className={`w-full py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-sm font-semibold cursor-pointer ${
            saveAllFeedback
              ? 'bg-amber-700 text-white'
              : 'bg-secondary text-white hover:bg-opacity-95'
          }`}
        >
          {saveAllFeedback ? <SlidersHorizontal className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saveAllFeedback ? 'Modificações Salvas com Sucesso!' : 'Salvar Todas as Alterações'}</span>
        </button>
      </div>
    </div>
  );
}
