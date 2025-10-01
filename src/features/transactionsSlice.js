import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    transactions: [],
    filter: 'all', // 'all', 'income', 'expense'
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        addTransaction: {
            reducer(state, action) {
                state.transactions.push(action.payload);
            },
            prepare(transaction) {
                return {
                    payload: {
                        id: nanoid(),
                        ...transaction,
                        date: transaction.date || new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                    },
                };
            },
        },
        updateTransaction(state, action) {
            const { id, updates } = action.payload;
            const existingTransaction = state.transactions.find(t => t.id === id);
            if (existingTransaction) {
                Object.assign(existingTransaction, updates);
            }
        },
        deleteTransaction(state, action) {
            state.transactions = state.transactions.filter(
                t => t.id !== action.payload
            );
        },
        setFilter(state, action) {
            state.filter = action.payload;
        },
    },
});

export const {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter
} = transactionsSlice.actions;

// Selectors
export const selectAllTransactions = (state) => state.transactions.transactions;

export const selectFilteredTransactions = (state) => {
    const { transactions, filter } = state.transactions;
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
};

export const selectTotalIncome = (state) => {
    return state.transactions.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
};

export const selectTotalExpenses = (state) => {
    return state.transactions.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
};

export const selectSavings = (state) => {
    const income = selectTotalIncome(state);
    const expenses = selectTotalExpenses(state);
    return income - expenses;
};

export const selectTransactionsByCategory = (state) => {
    const transactions = state.transactions.transactions;
    const grouped = {};

    transactions.forEach(transaction => {
        const catId = transaction.categoryId;
        if (!grouped[catId]) {
            grouped[catId] = [];
        }
        grouped[catId].push(transaction);
    });

    return grouped;
};

export default transactionsSlice.reducer;
