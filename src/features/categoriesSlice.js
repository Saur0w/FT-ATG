import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    categories: [
        { id: 1, name: 'Food', type: 'expense', color: '#ef4444' },
        { id: 2, name: 'Rent', type: 'expense', color: '#f59e0b' },
        { id: 3, name: 'Entertainment', type: 'expense', color: '#8b5cf6' },
        { id: 4, name: 'Transportation', type: 'expense', color: '#3b82f6' },
        { id: 5, name: 'Utilities', type: 'expense', color: '#eab308' },
        { id: 6, name: 'Healthcare', type: 'expense', color: '#ec4899' },
        { id: 7, name: 'Shopping', type: 'expense', color: '#06b6d4' },
        { id: 8, name: 'Education', type: 'expense', color: '#10b981' },
        { id: 9, name: 'Salary', type: 'income',  color: '#22c55e' },
        { id: 10, name: 'Freelance', type: 'income', color: '#14b8a6' },
        { id: 11, name: 'Investment', type: 'income', color: '#06b6d4' },
        { id: 12, name: 'Gift', type: 'income', color: '#a855f7' },
    ],
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: {
            reducer(state, action) {
                state.categories.push(action.payload);
            },
            prepare(category) {
                return {
                    payload: {
                        id: nanoid(),
                        ...category,
                    },
                };
            },
        },
        updateCategory(state, action) {
            const { id, updates } = action.payload;
            const category = state.categories.find(c => c.id === id);
            if (category) {
                Object.assign(category, updates);
            }
        },
        deleteCategory(state, action) {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        },
    },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;

export const selectAllCategories = (state) => state.categories.categories;

export const selectExpenseCategories = (state) =>
    state.categories.categories.filter(c => c.type === 'expense');

export const selectIncomeCategories = (state) =>
    state.categories.categories.filter(c => c.type === 'income');

export const selectCategoryById = (state, categoryId) =>
    state.categories.categories.find(c => c.id === categoryId);

export default categoriesSlice.reducer;
