import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from '../features/transactionsSlice';
import categoriesReducer from '../features/categoriesSlice';
import budgetReducer from '../features/budgetSlice';
import currencyReducer from '../features/currencySlice';
import { exchangeRateApi } from '../services/exchangeRateApi';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

const persistedTransactions = loadFromLocalStorage('transactions');
const persistedBudgets = loadFromLocalStorage('budgets');
const persistedCurrency = loadFromLocalStorage('currency');

export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        categories: categoriesReducer,
        budget: budgetReducer,
        currency: currencyReducer,
        [exchangeRateApi.reducerPath]: exchangeRateApi.reducer,
    },
    preloadedState: {
        transactions: persistedTransactions || undefined,
        budget: persistedBudgets || undefined,
        currency: persistedCurrency || undefined,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(exchangeRateApi.middleware),
});

store.subscribe(() => {
    const state = store.getState();

    saveToLocalStorage('transactions', state.transactions);
    saveToLocalStorage('budgets', state.budget);
    saveToLocalStorage('currency', state.currency);
});

export default store;
