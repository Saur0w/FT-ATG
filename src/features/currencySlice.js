import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    baseCurrency: 'USD',
    selectedCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CNY'],
};

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setBaseCurrency(state, action) {
            state.baseCurrency = action.payload;
        },
        setSelectedCurrency(state, action) {
            state.selectedCurrency = action.payload;
        },
    },
});

export const { setBaseCurrency, setSelectedCurrency } = currencySlice.actions;

export const selectBaseCurrency = (state) => state.currency.baseCurrency;
export const selectSelectedCurrency = (state) => state.currency.selectedCurrency;
export const selectSupportedCurrencies = (state) => state.currency.supportedCurrencies;

export default currencySlice.reducer;
