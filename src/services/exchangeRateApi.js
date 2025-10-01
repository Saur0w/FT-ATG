import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '1245c90bf180d7f86e9080f4'; // Replace with your actual API key

export const exchangeRateApi = createApi({
    reducerPath: 'exchangeRateApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://v6.exchangerate-api.com/v6/',
    }),
    endpoints: (builder) => ({
        // Fetch exchange rates for a base currency
        getExchangeRates: builder.query({
            query: (baseCurrency = 'USD') => `${API_KEY}/latest/${baseCurrency}`,
            // Cache results for 1 hour (3600 seconds)
            keepUnusedDataFor: 3600,
        }),
        // Convert between currencies
        convertCurrency: builder.query({
            query: ({ from, to, amount }) =>
                `${API_KEY}/pair/${from}/${to}/${amount}`,
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetExchangeRatesQuery,
    useConvertCurrencyQuery,
    useLazyGetExchangeRatesQuery,
} = exchangeRateApi;

