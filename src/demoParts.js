export const demoNumber = '7160500039S';

export const demoParts = [
  {
    number: demoNumber,
    brand: 'MEYLE',
    name: 'Рычаг подвески',
    warehouses: [
      { code: 'МС2', price: 3150, stock: 4 },
      { code: 'СПБ', price: 3290, stock: 2 },
    ],
    analogues: [
      {
        number: '51622',
        brand: 'MAPCO',
        name: 'Рычаг подвески',
        warehouses: [{ code: 'МС2', price: 2890, stock: 8 }],
      },
    ],
  },
  { number: demoNumber, brand: 'FEBI', name: 'Рычаг подвески', count: 0, warehouses: [] },
];
