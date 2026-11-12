import { configureStore, createSlice } from '@reduxjs/toolkit';
import { searchParts } from './partsApi.js';

function emptyResult(status = 'idle') {
  return { status, items: [], error: '' };
}

const partsSlice = createSlice({
  name: 'parts',
  initialState: { article: '', brand: '', brands: emptyResult(), offers: emptyResult() },
  reducers: {
    articleChanged(state, { payload }) {
      state.article = payload;
      state.brand = '';
      state.brands = emptyResult(payload.trim() ? 'loading' : 'idle');
      state.offers = emptyResult();
    },
    brandChanged(state, { payload }) {
      state.brand = payload;
      state.offers = emptyResult(payload ? 'loading' : 'idle');
    },
    searchFinished(state, { payload: { section, result } }) {
      state[section] = result;
    },
  },
});

export const { articleChanged, brandChanged } = partsSlice.actions;
const { searchFinished } = partsSlice.actions;
export const store = configureStore({ reducer: { parts: partsSlice.reducer } });

export function loadSearch(query, key, signal) {
  return async dispatch => {
    const section = query.brand ? 'offers' : 'brands';
    let result;
    try {
      const items = await searchParts(query, key, signal);
      result = { status: 'done', items, error: '' };
    } catch (error) {
      let message = error.message;
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        message = 'Сервис не ответил вовремя.';
      }
      if (error instanceof TypeError) message = 'Не удалось получить данные от сервиса.';
      result = { ...emptyResult('error'), error: message };
    }
    if (!signal.aborted) dispatch(searchFinished({ section, result }));
  };
}
