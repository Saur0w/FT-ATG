import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from '../features/transactionsSlice';
import categoriesReducer from '../features/categoriesSlice';
import budgetReducer from '../features/budgetSlice';
import currencyReducer from '../features/currencySlice';
import { exchangeRateApi } from '../services/exchangeRateApi';

export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        categories: categoriesReducer,
        budget: budgetReducer,
        currency: currencyReducer,
        [exchangeRateApi.reducerPath]: exchangeRateApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(exchangeRateApi.middleware),
});
