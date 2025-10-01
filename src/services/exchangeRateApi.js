import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '1245c90bf180d7f86e9080f4';

export const exchangeRateApi = createApi({
    reducerPath: 'exchangeRateApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://v6.exchangerate-api.com/v6/',
    }),
    endpoints: (builder) => ({
        getExchangeRates: builder.query({
            query: (baseCurrency = 'USD') => `${API_KEY}/latest/${baseCurrency}`,
            keepUnusedDataFor: 3600,
        }),
        convertCurrency: builder.query({
            query: ({ from, to, amount }) =>
                `${API_KEY}/pair/${from}/${to}/${amount}`,
        }),
    }),
});

export const {
    useGetExchangeRatesQuery,
    useConvertCurrencyQuery,
    useLazyGetExchangeRatesQuery,
} = exchangeRateApi;

