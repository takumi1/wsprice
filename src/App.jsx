import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiSettings from './components/ApiSettings.jsx';
import OffersTable from './components/OffersTable.jsx';
import SearchStatus from './components/SearchStatus.jsx';
import { demoNumber } from './demoParts.js';
import { articleChanged, brandChanged, loadSearch } from './store.js';

export default function App() {
  const { article, brand, brands, offers } = useSelector(state => state.parts);
  const dispatch = useDispatch();
  const [live, setLive] = useState(false);
  const apiKey = useRef('');
  const requests = useRef({});

  useEffect(() => {
    const pending = requests.current;
    return () => {
      clearTimeout(pending.timer);
      pending.brands?.abort();
      pending.offers?.abort();
    };
  }, []);

  function searchByNumber(value) {
    const pending = requests.current;
    clearTimeout(pending.timer);
    pending.brands?.abort();
    pending.offers?.abort();
    dispatch(articleChanged(value));

    const number = value.trim();
    if (!number) return;

    const key = apiKey.current;
    const controller = new AbortController();
    pending.brands = controller;
    pending.timer = setTimeout(() => {
      dispatch(loadSearch({ number }, key, controller.signal));
    }, 350);
  }

  function searchByBrand(value) {
    requests.current.offers?.abort();
    dispatch(brandChanged(value));
    if (!value) return;

    const controller = new AbortController();
    requests.current.offers = controller;
    dispatch(loadSearch({ number: article.trim(), brand: value }, apiKey.current, controller.signal));
  }

  function changeKey(key) {
    apiKey.current = key;
    setLive(Boolean(key));
    searchByNumber(article);
  }

  return (
    <main className="container parts-app py-4 py-md-5">
      <h1 className="h3 mb-3">Поиск автозапчастей</h1>
      <div className="card shadow-sm mb-3">
        <div className="card-body p-3 p-md-4">
          <div className="mb-3">
            <label htmlFor="article" className="form-label">Артикул</label>
            <input
              id="article"
              className="form-control"
              value={article}
              placeholder={demoNumber}
              autoComplete="off"
              spellCheck={false}
              onChange={event => searchByNumber(event.target.value)}
            />
            <SearchStatus
              result={brands}
              loadingText="Ищем производителей…"
              emptyText="По этому артикулу ничего не найдено."
              onRetry={() => searchByNumber(article)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="brand" className="form-label">Производитель</label>
            <select
              id="brand"
              className="form-select"
              value={brand}
              disabled={brands.items.length === 0}
              onChange={event => searchByBrand(event.target.value)}
            >
              <option value="">Выберите производителя</option>
              {brands.items.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <p className="small text-body-secondary mb-2">
            {live ? 'Поиск через API Favorit Parts.' : `Демо-данные. Попробуйте артикул ${demoNumber}.`}
          </p>
          <ApiSettings live={live} onChange={changeKey} />
        </div>
      </div>

      {brand && (
        <section className="card shadow-sm" aria-labelledby="offers-title">
          <div className="card-body p-3 p-md-4">
            <h2 id="offers-title" className="h5 mb-3">Предложения и аналоги</h2>
            <SearchStatus
              result={offers}
              loadingText="Ищем предложения…"
              emptyText="Для этого производителя предложений нет."
              onRetry={() => searchByBrand(brand)}
            />
            {offers.items.length > 0 && <OffersTable items={offers.items} />}
          </div>
        </section>
      )}
    </main>
  );
}
