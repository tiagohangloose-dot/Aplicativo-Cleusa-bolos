import React, { useState } from 'react';
import { BoloSabor, BoloTamanho, AdicionalExtra, BoloSalgadoTamanho, BoloPiscinaSabor } from '../types';
import { Cake, Plus, X, Search, SlidersHorizontal, Image, DollarSign, Save, LogOut } from 'lucide-react';

interface ConfigViewProps {
  sabores: BoloSabor[];
  tamanhos: BoloTamanho[];
  extras: AdicionalExtra[];
  onAddSabor: (sabor: BoloSabor) => void;
  onUpdateSabor: (id: string, updatedFields: Partial<BoloSabor>) => void;
  onUpdateTamanho: (id: string, updatedFields: Partial<BoloTamanho>) => void;
  onAddExtra: (extra: AdicionalExtra) => void;
  onDeleteExtra: (id: string) => void;
  onSaveAll: () => void;
  onLogout: () => void;
  taxaDoisRecheios: number;
  onUpdateTaxaDoisRecheios: (val: number) => void;
  taxaSaborEspecial: number;
  onUpdateTaxaSaborEspecial: (val: number) => void;
  tamanhosSalgado: BoloSalgadoTamanho[];
  onUpdateTamanhoSalgado: (id: string, updatedFields: Partial<BoloSalgadoTamanho>) => void;
  saboresPiscina: BoloPiscinaSabor[];
  onUpdateSaborPiscina: (id: string, updatedFields: Partial<BoloPiscinaSabor>) => void;
  onAddSaborPiscina: (nome: string) => void;
  onDeleteSaborPiscina: (id: string) => void;
  precoPiscina: number;
  onUpdatePrecoPiscina: (val: number) => void;
}

const CAKE_IMAGE_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgm8Ww9FF4UuIIV4mS5CCF1rzWZ-TpARtIhG-Q5ZoiqvPuZ3W2BatsiIeYhoq1LrFPjUqDo5eSLxClwZ2RpmjXLkcHNPkEdYwBIMfod0OKPIhC_7bOnVqRCMp3yF-sLGdAYwqpHfQUChex6La0BHwWe642yGrol6f7Ivq95C9UrNm-D7sDjSXgkJDLrXmf8o4zAMVxdchfs2Y1FK7Xk6hr4y2ODbctk93w0SNa35rHexu3VB-km660W5gljd1HxBd37tUZRYUW7rye',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZE1hJZd5eJcNaw2nwTTT2E5Ky9Mo7L9T2wrLRe1M7DO_9td7tTATU0WWjCRbK9PHyQ9pgMgaAP6cukfYgGSPrCYXTamR-o6NK9_xKvmVVytap41dhClVadX4tkzd7oBxLFWQxYtxganAITH2Z_mKWJCps2gNkH8xQRVOOOd5oYSsW-KYeU-SOtH8lf5oSZslPt1VZIhqg9oayJgHkv7yxBWmEzO3EmriDyIdaOuAgrsw0ILXj8qWQ7ZOSuhf36NGAHP78kbRj_Pq',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1wLPPELY9bQTjH0xcYN3A7LfNHJBbQj0M4c7OE35spzpddvxfAgJN2jzpk7sPo1w0FOe1bXCjF_qb6mWv2wBP1lmXwqDIdZs6_96QsNTc-yaO4WNmYBMrhh--5jRZX0qz3-Kb8zGf2XcjtBSrOblD_IajOGlb9R6ZabnXvLRH2LMs1fYdPTDbmq6z_GCsiSEm9ZEIQtU1X5eVFbFIPdWr7Faj3j7-hYu_8keb-ylHpDMWnY4pC7X5dG7miwLIihl2E3D_kokh5AwR',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgk-zF8jvHloVR36zjGRk_XkvjSfe8mMd8_utsNaEAeSGv0mcoewlnIb8NVY7l9K8HgksEoP1OtVwSgm-PlazXmzW7bN0oOkhk-VHfh6l5z6BmwYT27HeLqQYSFcpM8i6tdezQd5T42NOlXuVMJSX2mWu7cpmik8GYkP0Fo4p6AfMO0UREva0TCYCV5W2LJaUAApUTjX9I1EZUakuS7IPoWhzCMyTjYRwXwNkFA5TkVAFGBVkJeauNkElcDwE_EtQh4w1uIMxzFp94'
];

export default function ConfigView({
  sabores,
  tamanhos,
  extras,
  onAddSabor,
  onUpdateSabor,
  onUpdateTamanho,
  onAddExtra,
  onDeleteExtra,
  onSaveAll,
  onLogout,
  taxaDoisRecheios,
  onUpdateTaxaDoisRecheios,
  taxaSaborEspecial,
  onUpdateTaxaSaborEspecial,
  tamanhosSalgado,
  onUpdateTamanhoSalgado,
  saboresPiscina,
  onUpdateSaborPiscina,
  onAddSaborPiscina,
  onDeleteSaborPiscina,
  precoPiscina,
  onUpdatePrecoPiscina
}: ConfigViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'recheios' | 'salgados' | 'piscina' | 'taxas'>('recheios');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New flavor form state
  const [newNome, setNewNome] = useState('');
  const [newPeso, setNewPeso] = useState('1.5');
  const [newPreco, setNewPreco] = useState('180.00');
  const [newImgIndex, setNewImgIndex] = useState(0);
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [newTag, setNewTag] = useState<'best-seller' | 'sazonal' | 'none'>('none');
  const [newDescricao, setNewDescricao] = useState('');

  // Add Piscina Flavor
  const [addPiscinaNome, setAddPiscinaNome] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito pesada! Por favor, selecione uma de até 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCustomImgUrl(base64);
        setNewImgIndex(-1);
      }
    };
    reader.readAsDataURL(file);
  };

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
      pesoPadrao: parseFloat(newPeso) || 1.5,
      precoBase: parseFloat(newPreco) || 180.00,
      imagem: imgToUse,
      status: 'disponivel',
      tag: newTag,
      descricao: newDescricao.trim() || undefined
    };

    onAddSabor(newSaborItem);
    
    // reset form
    setNewNome('');
    setNewDescricao('');
    setCustomImgUrl('');
    alert('Sabor cadastrado com sucesso!');
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

  const handleAddNewPiscinaFlavor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPiscinaNome.trim()) return;
    onAddSaborPiscina(addPiscinaNome.trim());
    setAddPiscinaNome('');
    alert('Sabor de bolo Piscina adicionado com sucesso!');
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
    <div className="space-y-6 pb-28 text-on-surface">
      {/* Dynamic Sub-Tabs to edit different aspects of Cardapio */}
      <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl scrollbar-none overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('recheios')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeSubTab === 'recheios' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🍰 Recheios/Doce
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('salgados')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeSubTab === 'salgados' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🥪 Bolos Salgados
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('piscina')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
            activeSubTab === 'piscina' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🌋 Bolo Piscina
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('taxas')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap whitespace-nowrap cursor-pointer text-center ${
            activeSubTab === 'taxas' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          🏷️ Taxas & Extras
        </button>
      </div>

      {activeSubTab === 'recheios' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Cadastrar Novo Sabor */}
          <section className="p-5 bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-4">
              <Cake className="w-5 h-5 text-secondary" />
              <h3 className="font-serif italic text-base font-bold text-secondary">Novo Recheio Standard</h3>
            </div>

            <form onSubmit={handleAddNewBolo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2">Preset ou Foto</label>
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
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-primary/30 rounded-xl py-3 px-4 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-center">
                      <span className="text-xs font-bold text-primary">Subir do dispositivo (Max 2MB)</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    {customImgUrl && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-outline-variant/20">
                        <img src={customImgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Nome do Recheio</label>
                <input
                  className="w-full bg-surface-container-low rounded-lg p-3 text-xs border border-outline-variant/20 outline-none"
                  placeholder="Ex: Ninho com Morangos Reais"
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Descrição Breve (Opcional)</label>
                <input
                  className="w-full bg-surface-container-low rounded-lg p-3 text-xs border border-outline-variant/20 outline-none"
                  placeholder="Ex: Morangos frescos com brigadeiro cremoso de ninho"
                  type="text"
                  value={newDescricao}
                  onChange={(e) => setNewDescricao(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">Peso Base (Kg)</label>
                  <input
                    className="w-full bg-surface-container-low rounded-lg p-2.5 text-xs border border-outline-variant/20 outline-none"
                    type="number"
                    step="0.1"
                    value={newPeso}
                    onChange={(e) => setNewPeso(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">Preço Base (R$)</label>
                  <input
                    className="w-full bg-surface-container-low rounded-lg p-2.5 text-xs border border-outline-variant/20 outline-none font-bold text-secondary"
                    type="number"
                    step="1"
                    value={newPreco}
                    onChange={(e) => setNewPreco(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">Tag Destaque</label>
                  <select
                    className="w-full bg-surface-container-low rounded-lg p-2 text-xs border border-outline-variant/20 outline-none h-[38px]"
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
                className="w-full bg-primary text-white py-3 rounded-full font-sans text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary/95 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Recheio</span>
              </button>
            </form>
          </section>

          {/* List Section with Search */}
          <section className="space-y-4">
            <div className="flex gap-3 items-center">
              <input
                className="w-full pl-3 pr-4 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface outline-none border border-outline-variant/15"
                placeholder="Buscar recheio..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredSabores.map((sab) => {
                const isEnabled = sab.status === 'disponivel';
                const lower = sab.nome.toLowerCase();
                const isEspecialList = lower.includes('kitkat') || lower.includes('nutella') || lower.includes('alpino') || lower.includes('nozes') || sab.precoBase > 180.00;
                
                return (
                  <article
                    key={sab.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isEnabled ? 'bg-surface-container-lowest border-outline-variant/10 shadow-sm' : 'bg-surface-container-low opacity-75 grayscale-[0.2]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-outline-variant/10 group/img">
                          <img className="w-full h-full object-cover" src={sab.imagem} alt={sab.nome} referrerPolicy="no-referrer" />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer">
                            Alterar
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 2 * 1024 * 1024) {
                                  alert('Imagem muito pesada! Máximo 2MB.');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const base64 = ev.target?.result as string;
                                  if (base64) onUpdateSabor(sab.id, { imagem: base64 });
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-on-surface flex items-center gap-1.5">
                            <span>{sab.nome}</span>
                            {isEspecialList && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">★ Sabor Especial</span>
                            )}
                          </h4>
                          <span className="text-[10px] text-on-surface-variant font-medium block">
                            {sab.descricao || 'Sem descrição cadastrada.'}
                          </span>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isEnabled}
                          onChange={(e) => onUpdateSabor(sab.id, { status: e.target.checked ? 'disponivel' : 'indisponivel' })}
                        />
                        <div className="w-9 h-5 bg-outline-variant/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/10">
                      <div>
                        <span className="text-[9px] text-on-surface-variant font-bold mb-1 block">Rendimento aproximado (kg)</span>
                        <input
                          className="w-full bg-surface-container-low/60 rounded-lg p-2 text-xs border border-outline-variant/10 outline-none"
                          type="number"
                          step="0.1"
                          value={sab.pesoPadrao}
                          onChange={(e) => onUpdateSabor(sab.id, { pesoPadrao: parseFloat(e.target.value) || 1.0 })}
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant font-bold mb-1 block">Preço de Referência (R$)</span>
                        <input
                          className="w-full bg-surface-container-low/60 rounded-lg p-2 text-xs border border-outline-variant/10 outline-none font-bold text-secondary"
                          type="number"
                          step="1"
                          value={sab.precoBase}
                          onChange={(e) => onUpdateSabor(sab.id, { precoBase: parseFloat(e.target.value) || 180 })}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {activeSubTab === 'salgados' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm">
            <h3 className="font-serif italic font-bold text-base text-secondary mb-3">Preços dos Bolos Salgados</h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Configure as opções e os preços dos bolos salgados clássicos de frango artesanal.
            </p>

            <div className="space-y-4">
              {tamanhosSalgado.map((tam) => (
                <div key={tam.id} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-on-surface font-sans">{tam.label}</span>
                    <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded border text-on-surface-variant">{tam.fatias}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-on-surface-variant font-bold mb-1 block">Preço de Venda (R$)</label>
                      <input
                        className="w-full bg-white rounded-lg p-2 text-xs font-bold text-secondary border border-outline-variant/20 outline-none"
                        type="number"
                        step="1"
                        value={tam.preco}
                        onChange={(e) => onUpdateTamanhoSalgado(tam.id, { preco: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-on-surface-variant font-bold mb-1 block">Rendimento</label>
                      <input
                        className="w-full bg-white rounded-lg p-2 text-xs border border-outline-variant/20 outline-none"
                        type="text"
                        value={tam.fatias}
                        onChange={(e) => onUpdateTamanhoSalgado(tam.id, { fatias: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'piscina' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm">
            <h3 className="font-serif italic font-bold text-base text-secondary mb-2">Preço Fixo do Bolo Piscina</h3>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">R$</span>
              <input
                className="w-full bg-surface-container-low rounded-lg p-3 pl-9 text-xs border border-outline-variant/20 focus:border-primary outline-none font-bold text-secondary"
                type="number"
                step="1"
                value={precoPiscina}
                onChange={(e) => onUpdatePrecoPiscina(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="border-t border-outline-variant/10 pt-4">
              <h4 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Adicionar Sabor de Cobertura</h4>
              <form onSubmit={handleAddNewPiscinaFlavor} className="flex gap-2">
                <input
                  className="flex-1 bg-surface-container-low rounded-lg p-2.5 text-xs border border-outline-variant/20 outline-none"
                  placeholder="Ex: Vulcão de Prestígio"
                  required
                  type="text"
                  value={addPiscinaNome}
                  onChange={(e) => setAddPiscinaNome(e.target.value)}
                />
                <button type="submit" className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-opacity-95 cursor-pointer flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">Sabores de Bolo Piscina Cadastrados</h4>
            {saboresPiscina.map((pis) => {
              const isEnabled = pis.status === 'disponivel';
              return (
                <div key={pis.id} className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm flex justify-between items-center">
                  <span className="font-semibold text-xs text-on-surface">{pis.nome}</span>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isEnabled}
                        onChange={(e) => onUpdateSaborPiscina(pis.id, { status: e.target.checked ? 'disponivel' : 'indisponivel' })}
                      />
                      <div className="w-8 h-4.5 bg-outline-variant/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Deseja mesmo remover o sabor ${pis.nome}?`)) {
                          onDeleteSaborPiscina(pis.id);
                        }
                      }}
                      className="text-red-500 font-bold hover:text-red-700 text-xs px-2 cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'taxas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Taxas Card */}
          <section className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 text-on-surface">
            <h3 className="font-serif italic font-bold text-base text-secondary mb-3">Acréscimos e Taxas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Taxa Especial para Sabores Especiais (KitKat, Nutella, Alpino, Nozes)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">R$</span>
                  <input
                    className="w-full bg-surface-container-low rounded-lg p-3 pl-9 text-xs border border-outline-variant/20 outline-none font-bold text-secondary"
                    type="number"
                    step="1"
                    value={taxaSaborEspecial}
                    onChange={(e) => onUpdateTaxaSaborEspecial(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Taxa Adicional para bolo com 2 Recheios
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">R$</span>
                  <input
                    className="w-full bg-surface-container-low rounded-lg p-3 pl-9 text-xs border border-outline-variant/20 outline-none font-bold text-secondary"
                    type="number"
                    step="1"
                    value={taxaDoisRecheios}
                    onChange={(e) => onUpdateTaxaDoisRecheios(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Adicionais & Extras Section (Screen 5 Section 2) */}
          <section className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
            <h3 className="font-serif italic font-bold text-base text-secondary mb-3">Extras Opcionais Cadastrados</h3>
            
            <form onSubmit={handleAddNewExtra} className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-surface-container-low rounded-lg p-2 text-xs border border-outline-variant/20 outline-none"
                placeholder="Ex: Vela Número Centelha"
                type="text"
                required
                value={addExtraNome}
                onChange={(e) => setAddExtraNome(e.target.value)}
              />
              <div className="w-24 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px]">R$</span>
                <input
                  className="w-full bg-surface-container-low rounded-lg p-2 pl-6 text-xs border border-outline-variant/20 outline-none font-bold text-secondary"
                  placeholder="5.00"
                  step="0.1"
                  type="number"
                  required
                  value={addExtraPreco}
                  onChange={(e) => setAddExtraPreco(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary text-white px-3 rounded-lg flex items-center justify-center hover:bg-opacity-95 cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {extras.map((ext) => (
                <span
                  key={ext.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/15 text-xs text-on-surface"
                >
                  <span className="font-sans font-medium">{ext.nome}:</span>
                  <span className="text-secondary font-bold font-mono">R$ {ext.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteExtra(ext.id)}
                    className="text-red-500 font-bold hover:text-red-700 ml-1 cursor-pointer text-xs leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Acréscimos por tamanho para o bolo Doce Gourmet */}
          <section className="p-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 text-on-surface">
            <h3 className="font-serif italic font-bold text-base text-secondary mb-3">Acréscimos por Tamanho (Bolo Doce)</h3>
            <div className="space-y-4">
              {tamanhos.map((tam) => (
                <div key={tam.id} className="p-3.5 rounded-xl bg-surface-container-low space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-secondary">{tam.label}</span>
                    <span className="text-[10px] bg-white/65 px-2 py-0.5 rounded border border-outline-variant/5">{tam.fatias}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-on-surface-variant font-bold mb-1 block">Acréscimo R$ (sobre a base R$ 180)</label>
                      <input
                        className="w-full bg-white rounded-lg p-2 text-xs font-semibold border border-outline-variant/20 outline-none"
                        type="number"
                        step="1"
                        value={tam.adicionalPreco}
                        onChange={(e) => onUpdateTamanho(tam.id, { adicionalPreco: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-on-surface-variant font-bold mb-1 block">Rendimento</label>
                      <input
                        className="w-full bg-white rounded-lg p-2 text-xs border border-outline-variant/20 outline-none"
                        type="text"
                        value={tam.fatias}
                        onChange={(e) => onUpdateTamanho(tam.id, { fatias: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Floating Save All bar */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full px-6 flex justify-center max-w-sm">
        <button
          onClick={executeSaveAll}
          className={`w-full py-4 rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-xs font-bold cursor-pointer ${
            saveAllFeedback ? 'bg-amber-700 text-white' : 'bg-primary text-white hover:bg-opacity-95'
          }`}
        >
          {saveAllFeedback ? <SlidersHorizontal className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saveAllFeedback ? 'Alterações Gravadas!' : 'Salvar Todo o Cardápio'}</span>
        </button>
      </div>
    </div>
  );
}
