import { BoloSabor, BoloTamanho, AdicionalExtra, Pedido, BoloSalgadoTamanho, BoloPiscinaSabor } from './types';

export const INITIAL_FLAVORS: BoloSabor[] = [
  {
    id: 'fl-1',
    nome: 'Brigadeiro Gourmet',
    descricao: 'Recheio cremoso e generoso de brigadeiro de chocolate gourmet. Um clássico irresistível!',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'best-seller'
  },
  {
    id: 'fl-2',
    nome: 'Brigadeiro de Ninho',
    descricao: 'Recheio aveludado feito puramente com leite condensado e o genuíno Leite Ninho.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1559181567-c3190cb9959b?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'best-seller'
  },
  {
    id: 'fl-3',
    nome: 'Prestígio',
    descricao: 'Uma combinação inesquecível de coco ralado úmido e cremoso com brigadeiro gourmet.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: 'fl-4',
    nome: 'Sensação',
    descricao: 'Recheio trufado de morango coberto com raspas finas e generosas de chocolate blend.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: 'fl-5',
    nome: 'Beijinho',
    descricao: 'Recheio cremoso tradicional de coco ralado cozido lentamente, doce e delicioso.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1559622214-f8a98509db7b?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: 'fl-6',
    nome: 'Creme Belga Puro',
    descricao: 'Textura acetinada de baunilha belga de alta confeitaria, leve e muito saborosa.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: 'fl-7',
    nome: 'Mousse de Chocolate Trufado',
    descricao: 'Mousse de chocolate blend aerada de extrema cremosidade e sabor acentuado de cacau.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: 'fl-8',
    nome: 'Doce de Leite Caseiro',
    descricao: 'Doce de leite cozido artesanalmente no ponto ideal da colher, super suave e nobre.',
    pesoPadrao: 3.0,
    precoBase: 180.00,
    imagem: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: 'fl-9',
    nome: 'Nutella Real (Especial)',
    descricao: 'O legítimo e irresistível creme de avelã Nutella pura em abundância no seu recheio.',
    pesoPadrao: 3.0,
    precoBase: 200.00,
    imagem: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'sazonal',
    isEspecial: true
  },
  {
    id: 'fl-10',
    nome: 'Nozes Nobres (Especial)',
    descricao: 'Doce de leite caseiro com pedaços graúdos de nozes chilenas selecionadas e crocantes.',
    pesoPadrao: 3.0,
    precoBase: 200.00,
    imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=60',
    status: 'disponivel',
    tag: 'sazonal',
    isEspecial: true
  }
];

export const INITIAL_SIZES: BoloTamanho[] = [
  {
    id: 'p',
    label: 'Tamanho P',
    multiplicadorPeso: 1.0,
    adicionalPreco: 0.00,
    fatias: '30 Pedaços'
  },
  {
    id: 'm',
    label: 'Tamanho M',
    multiplicadorPeso: 1.6,
    adicionalPreco: 70.00,
    fatias: '50 Pedaços'
  },
  {
    id: 'g',
    label: 'Tamanho G',
    multiplicadorPeso: 2.6,
    adicionalPreco: 120.00,
    fatias: '80 Pedaços'
  }
];

export const INITIAL_EXTRAS: AdicionalExtra[] = [
  { id: 'ext-1', nome: 'Topper de Bolo', preco: 15.00 },
  { id: 'ext-2', nome: 'Embalagem Presente', preco: 12.00 },
  { id: 'ext-3', nome: 'Vela Estrela', preco: 8.00 }
];

export const INITIAL_SALGADO_SIZES: BoloSalgadoTamanho[] = [
  { id: 'salg-p', label: 'Tamanho P', preco: 160.00, fatias: '45 Pedaços' },
  { id: 'salg-m', label: 'Tamanho M', preco: 240.00, fatias: '60 Pedaços' },
  { id: 'salg-g', label: 'Tamanho G', preco: 280.00, fatias: '80 Pedaços' }
];

export const INITIAL_PISCINA_SABORES: BoloPiscinaSabor[] = [
  { id: 'pisc-1', nome: 'Brigadeiro', status: 'disponivel' },
  { id: 'pisc-2', nome: 'Beijinho', status: 'disponivel' },
  { id: 'pisc-3', nome: 'Paçoca', status: 'disponivel' },
  { id: 'pisc-4', nome: 'Churros', status: 'disponivel' },
  { id: 'pisc-5', nome: 'Doce de Leite', status: 'disponivel' },
  { id: 'pisc-6', nome: 'Creme de Avelã', status: 'disponivel' }
];

export const INITIAL_PISCINA_PRECO = 55.00;

export const INITIAL_ORDERS: Pedido[] = [];
