import { MenuItem } from '../types';

export const INITIAL_MENU: MenuItem[] = [
  // KOPI & MINUMAN PANAS
  {
    id: 'kopi-tubruk',
    name: 'Kopi Tubruk Regalos',
    category: 'kopi-panas',
    price: 6000,
    description: 'Kopi hitam robusta racikan khas warkop Regalos, aroma wangi mantap dan kental.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Robusta', 'Tradisional']
  },
  {
    id: 'kopi-susu-warkop',
    name: 'Kopi Susu Panas Warkop',
    category: 'kopi-panas',
    price: 8000,
    description: 'Kopi hitam berpadu kental manis pas, legendaris teman begadang nongkrong.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Kental Manis']
  },
  {
    id: 'kopi-jahe',
    name: 'Kopi Jahe Bakar',
    category: 'kopi-panas',
    price: 10000,
    description: 'Racikan kopi tubruk dengan geprekan jahe bakar asli, hangat melegakan tenggorokan.',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Herbal', 'Hangat']
  },
  {
    id: 'teh-tarik-panas',
    name: 'Teh Tarik Hangat',
    category: 'kopi-panas',
    price: 8000,
    description: 'Teh pekat ditarik berbusa lembut dengan susu krim gurih nikmat.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Creamy']
  },
  {
    id: 'stmj-regalos',
    name: 'STMJ Regalos Spesial',
    category: 'kopi-panas',
    price: 15000,
    description: 'Susu, Telur bebek kampung, Madu murni, Jahe merah. Stamina maksimal!',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Stamina Booster']
  },

  // MINUMAN DINGIN & SEGAR
  {
    id: 'es-kopi-susu-aren',
    name: 'Es Kopi Susu Gula Aren Regalos',
    category: 'es-segar',
    price: 12000,
    description: 'Espresso robusta mantap dipadu susu segar creamy dan sirup gula aren organik harum.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Best Seller', 'Aren Asli']
  },
  {
    id: 'es-teh-jumbo',
    name: 'Es Teh Manis Jumbo',
    category: 'es-segar',
    price: 5000,
    description: 'Es teh wangi melati dengan porsi gelas jumbo, segar dan puaskan dahaga.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Jumbo', 'Segar']
  },
  {
    id: 'es-jeruk-peras',
    name: 'Es Jeruk Peras Segar',
    category: 'es-segar',
    price: 7000,
    description: 'Jeruk peras asli tanpa sari buatan, asam manis segar alami.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Vitamin C']
  },
  {
    id: 'es-josua',
    name: 'Es Josua (Extra Joss Susu)',
    category: 'es-segar',
    price: 8000,
    description: 'Minuman legendaris warkop! Extra Joss dingin disiram kental manis kreami.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Legend', 'Segar']
  },
  {
    id: 'soda-gembira',
    name: 'Soda Gembira Regalos',
    category: 'es-segar',
    price: 12000,
    description: 'Soda bening dingin berpadu sirup coco pandan merah dan susu kental manis.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Klasik']
  },
  {
    id: 'es-coklat-kental',
    name: 'Es Coklat Kental Warkop',
    category: 'es-segar',
    price: 10000,
    description: 'Coklat bubuk pekat dimasak kental gurih, nikmat diseruput dingin bersama es batu.',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Choco Lover']
  },

  // MAKANAN BERAT & INDOMIE
  {
    id: 'indomie-nyemek-spesial',
    name: 'Indomie Nyemek Regalos Spesial',
    category: 'makanan',
    price: 15000,
    description: 'Indomie kuah kental gurih pedas level warkop, telur orak-arik, sawi hijau, kornet sapi & cabai rawit.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Signature', 'Pedas Mantap']
  },
  {
    id: 'indomie-goreng-dobel-telur',
    name: 'Indomie Goreng Dobel Telur',
    category: 'makanan',
    price: 14000,
    description: '2 bungkus Indomie goreng dimasak matang pas dengan 2 telur ceplok setengah matang dan taburan bawang goreng.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Porsi Puas']
  },
  {
    id: 'nasi-goreng-warkop',
    name: 'Nasi Goreng Warkop Aroma Wok',
    category: 'makanan',
    price: 17000,
    description: 'Nasi goreng bumbu racik khas warkop, wangi smokey dengan suwiran ayam, telur ceplok, dan kerupuk.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Smokey Wok']
  },
  {
    id: 'magelangan-spesial',
    name: 'Nasi Magelangan (Nasi + Mie)',
    category: 'makanan',
    price: 16000,
    description: 'Kombinasi nasi dan mie goreng diaduk bumbu rempah warkop pedas manis, topping telur dan acar.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Favorit Malam']
  },
  {
    id: 'nasi-ayam-geprek',
    name: 'Nasi Ayam Geprek Sambal Bawang',
    category: 'makanan',
    price: 18000,
    description: 'Ayam crispy gurih digeprek dengan cabai rawit merah dan bawang putih segar pedas membakar.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Pedas Nampol']
  },
  {
    id: 'nasi-telur-pontianak',
    name: 'Nasi Telur Dadar Crispy Pontianak',
    category: 'makanan',
    price: 12000,
    description: 'Nasi hangat dengan 2 butir telur dadar kribo renyah disiram kecap bumbu gurih manis dan daun bawang.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Ekonomis & Nagih']
  },

  // CAMILAN & ROTI BAKAR
  {
    id: 'roti-bakar-coklat-keju',
    name: 'Roti Bakar Coklat Keju Crunchy',
    category: 'camilan',
    price: 13000,
    description: 'Roti tebal dipanggang margarin wangi dengan isian coklat meleleh dan parutan keju cheddar melimpah.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Topping Melimpah']
  },
  {
    id: 'pisang-bakar-aren-keju',
    name: 'Pisang Bakar Aren Keju',
    category: 'camilan',
    price: 12000,
    description: 'Pisang kepok manis dibakar karamel dengan saus gula aren legit dan keju parut.',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Manis Gurih']
  },
  {
    id: 'mendoan-sambal-kecap',
    name: 'Tempe Mendoan Hangat (Isi 4)',
    category: 'camilan',
    price: 10000,
    description: 'Tempe mendoan lembut digoreng setengah matang dengan cocolan sambal kecap rawit pedas.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    tags: ['Hangat & Renyah']
  },
  {
    id: 'cireng-rujak',
    name: 'Cireng Crispy Bumbu Rujak (Isi 10)',
    category: 'camilan',
    price: 12000,
    description: 'Cireng kenyal di dalam renyah di luar dengan saus bumbu rujak pedas asam manis kental.',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Camilan Asyik']
  },
  {
    id: 'kentang-goreng-regalos',
    name: 'Kentang Goreng Regalos Mix Seasoning',
    category: 'camilan',
    price: 12000,
    description: 'French fries renyah keemasan dengan taburan bumbu balado / keju manis gurih.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    tags: ['Crispy']
  }
];
