import { demoNumber, demoParts } from './demoParts.js';

const apiUrl = 'https://api.favorit-parts.ru/hs/hsprice/';

function getDemoParts(number, brand) {
  if (number.toUpperCase() !== demoNumber) return [];
  return brand ? demoParts.filter(part => part.brand === brand) : demoParts;
}

async function getApiParts({ number, brand }, key, signal) {
  const url = new URL(apiUrl);
  url.searchParams.set('key', key);
  url.searchParams.set('number', number);
  if (brand) {
    url.searchParams.set('brand', brand);
    url.searchParams.set('analogues', 'on');
  }

  const response = await fetch(url, {
    cache: 'no-store',
    credentials: 'omit',
    signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
  });

  const body = await response.text();
  let data;
  try {
    data = body.trim() ? JSON.parse(body) : {};
  } catch {
    if (response.ok) throw new Error('Сервис вернул ответ в неожиданном формате.');
  }

  const message = String(data?.error ?? '');
  if (response.status === 429 || /quota/i.test(message)) {
    throw new Error('Превышен лимит запросов к сервису.');
  }
  if (response.status === 401 || response.status === 403 || /key/i.test(message)) {
    throw new Error('Сервис не принял ключ доступа.');
  }
  if (!response.ok) throw new Error('Сервис временно недоступен.');
  if (message) throw new Error('Сервис не смог выполнить поиск.');

  const goods = data?.goods ?? [];
  if (!Array.isArray(goods)) throw new Error('Сервис вернул ответ в неожиданном формате.');
  return goods;
}

// При отсутствии результатов API может прислать запись с пустым артикулом и брендом.
function isPart(part) {
  return Boolean(part?.number?.trim() && part?.brand?.trim());
}

function getOffers(goods) {
  const parts = goods.flatMap(part => [part, ...(part?.analogues ?? [])]).filter(isPart);
  return parts.flatMap(part => {
    const details = { name: part.name, number: part.number, brand: part.brand };
    if (!part.warehouses?.length) {
      return [{ ...details, warehouse: null, price: null, stock: part.count ?? null }];
    }

    // Поле price в самой карточке устарело. У каждого склада своя цена.
    return part.warehouses.map(warehouse => ({
      ...details,
      warehouse: warehouse.code || null,
      price: warehouse.price ?? null,
      stock: warehouse.stock ?? null,
    }));
  });
}

export async function searchParts(query, key, signal) {
  const goods = key
    ? await getApiParts(query, key, signal)
    : getDemoParts(query.number, query.brand);

  if (query.brand) return getOffers(goods);
  return [...new Set(goods.filter(isPart).map(part => part.brand.trim()))];
}
