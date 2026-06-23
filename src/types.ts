export interface BoloSabor {
  id: string;
  nome: string;
  descricao?: string;
  pesoPadrao: number; // in kg
  precoBase: number;
  imagem: string;
  status: 'disponivel' | 'indisponivel';
  tag?: 'best-seller' | 'sazonal' | 'none';
  isEspecial?: boolean;
  adicionalPreco?: number;
}

export interface BoloTamanho {
  id: string;
  label: string; // P (1kg), M (2kg), G (3kg)
  multiplicadorPeso: number;
  adicionalPreco: number;
  fatias: string;
}

export interface AdicionalExtra {
  id: string;
  nome: string;
  preco: number;
}

export interface BoloSalgadoTamanho {
  id: string;
  label: string;
  preco: number;
  fatias: string;
}

export interface BoloPiscinaSabor {
  id: string;
  nome: string;
  status: 'disponivel' | 'indisponivel';
}

export interface Pedido {
  id: string;
  codigo: string;
  clienteNome: string;
  whatsapp: string;
  tipoEntrega: 'retirada' | 'entrega';
  nomeRetirada?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  data: string;
  horario: string;
  saborId: string;
  saborNome: string;
  tamanhoId: string;
  tamanhoLabel: string;
  adicionais: string[];
  adicionaisPreco: number;
  total: number;
  formaPagamento: 'pix' | 'cartao' | 'dinheiro';
  status: 'pendente' | 'producao' | 'entregue';
  dataCriacao: string;
  detalhes?: string;
  massa?: 'branca' | 'preta';
  quantidadeRecheios?: 1 | 2;
  recheio1Id?: string;
  recheio1Nome?: string;
  recheio2Id?: string;
  recheio2Nome?: string;
  tipoBolo?: 'doce' | 'salgado' | 'piscina';
}
