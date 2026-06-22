import { BoloSabor, BoloTamanho, AdicionalExtra, Pedido } from './types';

export const INITIAL_FLAVORS: BoloSabor[] = [
  {
    id: '1',
    nome: 'Chocolate Belga',
    descricao: 'Chocolate belga meio amargo com brigadeiro gourmet.',
    pesoPadrao: 1.5,
    precoBase: 85.00,
    imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZE1hJZd5eJcNaw2nwTTT2E5Ky9Mo7L9T2wrLRe1M7DO_9td7tTATU0WWjCRbK9PHyQ9pgMgaAP6cukfYgGSPrCYXTamR-o6NK9_xKvmVVytap41dhClVadX4tkzd7oBxLFWQxYtxganAITH2Z_mKWJCps2gNkH8xQRVOOOd5oYSsW-KYeU-SOtH8lf5oSZslPt1VZIhqg9oayJgHkv7yxBWmEzO3EmriDyIdaOuAgrsw0ILXj8qWQ7ZOSuhf36NGAHP78kbRj_Pq',
    status: 'disponivel',
    tag: 'best-seller'
  },
  {
    id: '2',
    nome: 'Limão com Mirtilo',
    descricao: 'Massa amanteigada de limão siciliano recheada com geleia artesanal de mirtilos.',
    pesoPadrao: 1.0,
    precoBase: 75.00,
    imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1wLPPELY9bQTjH0xcYN3A7LfNHJBbQj0M4c7OE35spzpddvxfAgJN2jzpk7sPo1w0FOe1bXCjF_qb6mWv2wBP1lmXwqDIdZs6_96QsNTc-yaO4WNmYBMrhh--5jRZX0qz3-Kb8zGf2XcjtBSrOblD_IajOGlb9R6ZabnXvLRH2LMs1fYdPTDbmq6z_GCsiSEm9ZEIQtU1X5eVFbFIPdWr7Faj3j7-hYu_8keb-ylHpDMWnY4pC7X5dG7miwLIihl2E3D_kokh5AwR',
    status: 'disponivel',
    tag: 'sazonal'
  },
  {
    id: '3',
    nome: 'Nozes com Caramelo',
    descricao: 'Massa de nozes com doce de leite caseiro e praliné de nozes crocantes.',
    pesoPadrao: 2.0,
    precoBase: 90.00,
    imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgk-zF8jvHloVR36zjGRk_XkvjSfe8mMd8_utsNaEAeSGv0mcoewlnIb8NVY7l9K8HgksEoP1OtVwSgm-PlazXmzW7bN0oOkhk-VHfh6l5z6BmwYT27HeLqQYSFcpM8i6tdezQd5T42NOlXuVMJSX2mWu7cpmik8GYkP0Fo4p6AfMO0UREva0TCYCV5W2LJaUAApUTjX9I1EZUakuS7IPoWhzCMyTjYRwXwNkFA5TkVAFGBVkJeauNkElcDwE_EtQh4w1uIMxzFp94',
    status: 'indisponivel',
    tag: 'none'
  },
  {
    id: '4',
    nome: 'Red Velvet com Cream Cheese',
    descricao: 'Massa aveludada vermelha recheada com o autêntico frost frosting de cream cheese.',
    pesoPadrao: 1.5,
    precoBase: 95.00,
    imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgm8Ww9FF4UuIIV4mS5CCF1rzWZ-TpARtIhG-Q5ZoiqvPuZ3W2BatsiIeYhoq1LrFPjUqDo5eSLxClwZ2RpmjXLkcHNPkEdYwBIMfod0OKPIhC_7bOnVqRCMp3yF-sLGdAYwqpHfQUChex6La0BHwWe642yGrol6f7Ivq95C9UrNm-D7sDjSXgkJDLrXmf8o4zAMVxdchfs2Y1FK7Xk6hr4y2ODbctk93w0SNa35rHexu3VB-km660W5gljd1HxBd37tUZRYUW7rye',
    status: 'disponivel',
    tag: 'none'
  },
  {
    id: '5',
    nome: 'Cenoura com Brigadeiro',
    descricao: 'Clássico bolo de cenoura super fofinho com recheio e cobertura generosa de brigadeiro.',
    pesoPadrao: 1.5,
    precoBase: 85.00,
    imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ZE1hJZd5eJcNaw2nwTTT2E5Ky9Mo7L9T2wrLRe1M7DO_9td7tTATU0WWjCRbK9PHyQ9pgMgaAP6cukfYgGSPrCYXTamR-o6NK9_xKvmVVytap41dhClVadX4tkzd7oBxLFWQxYtxganAITH2Z_mKWJCps2gNkH8xQRVOOOd5oYSsW-KYeU-SOtH8lf5oSZslPt1VZIhqg9oayJgHkv7yxBWmEzO3EmriDyIdaOuAgrsw0ILXj8qWQ7ZOSuhf36NGAHP78kbRj_Pq',
    status: 'disponivel',
    tag: 'none'
  }
];

export const INITIAL_SIZES: BoloTamanho[] = [
  {
    id: 'p',
    label: 'P (1kg)',
    multiplicadorPeso: 1.0,
    adicionalPreco: 0,
    fatias: 'Pequeno (10 fatias)'
  },
  {
    id: 'm',
    label: 'M (2kg)',
    multiplicadorPeso: 1.3, // slight factor or let's use exact markup additions to match screens!
    adicionalPreco: 60.00,
    fatias: 'Médio (15-20 fatias)'
  },
  {
    id: 'g',
    label: 'G (3kg)',
    multiplicadorPeso: 1.6,
    adicionalPreco: 110.00,
    fatias: 'Grande (20-25 fatias)'
  }
];

export const INITIAL_EXTRAS: AdicionalExtra[] = [
  { id: 'ext-1', nome: 'Topper de Bolo', preco: 15.00 },
  { id: 'ext-2', nome: 'Embalagem Presente', preco: 12.00 },
  { id: 'ext-3', nome: 'Vela Estrela', preco: 8.00 }
];

export const INITIAL_ORDERS: Pedido[] = [];
