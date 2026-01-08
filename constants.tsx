
import { Product, Order, Customer } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camisa de Linho Clássica',
    price: 89.99,
    description: 'Camisa de linho respirável perfeita para noites de verão. Confeccionada em linho premium europeu 100%, esta peça oferece conforto inigualável e uma silhueta atemporal que transita facilmente da praia ao jantar.',
    category: 'Masculino',
    image: 'https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?auto=format&fit=crop&q=80&w=800',
    secondaryImages: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594932224423-f3c14c391781?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    rating: 4.8,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [{ name: 'Creme', hex: '#F5F5DC' }, { name: 'Verde Sálvia', hex: '#87A96B' }, { name: 'Azul Marinho', hex: '#000080' }]
  },
  {
    id: '2',
    name: 'Vestido de Seda para Noite',
    price: 249.00,
    description: 'Elegante vestido de seda para ocasiões formais. Apresenta um corte enviesado que valoriza a silhueta, com um brilho sutil que captura a luz lindamente. Perfeito para festas ou casamentos.',
    category: 'Feminino',
    image: 'https://images.unsplash.com/photo-1539109132345-64939c05c0f2?auto=format&fit=crop&q=80&w=800',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1536640704018-9366d3a95c37?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1536640704018-9366d3a95c37?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    rating: 4.9,
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [{ name: 'Esmeralda', hex: '#50C878' }, { name: 'Preto', hex: '#000000' }]
  },
  {
    id: '3',
    name: 'Moletom Urban Street',
    price: 65.50,
    description: 'Moletom de algodão encorpado com design minimalista. Construído para as ruas, apresentando caimento relaxado, costuras reforçadas e interior escovado para máximo aquecimento e durabilidade.',
    category: 'Masculino',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556821840-d1645565d9a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-7e614a4505f0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556821840-8f92176d6a26?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    rating: 4.5,
    sizes: ['M', 'G', 'GG', 'XG'],
    colors: [{ name: 'Asfalto', hex: '#454545' }, { name: 'Cinza Névoa', hex: '#DCDCDC' }]
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'PED-001', customerName: 'Alice Silva', date: '24/10/2023', total: 155.48, status: 'Delivered', items: 2 },
  { id: 'PED-002', customerName: 'Roberto Santos', date: '25/10/2023', total: 89.99, status: 'Shipped', items: 1 },
  { id: 'PED-003', customerName: 'Carlos Oliveira', date: '26/10/2023', total: 345.00, status: 'Pending', items: 3 },
  { id: 'PED-004', customerName: 'Diana Prince', date: '27/10/2023', total: 12.50, status: 'Cancelled', items: 1 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CLI-1', name: 'Alice Silva', email: 'alice@exemplo.com', orders: 5, totalSpent: 750.00 },
  { id: 'CLI-2', name: 'Roberto Santos', email: 'roberto@exemplo.com', orders: 2, totalSpent: 180.50 },
  { id: 'CLI-3', name: 'Carlos Oliveira', email: 'carlos@exemplo.com', orders: 12, totalSpent: 2100.25 },
];
