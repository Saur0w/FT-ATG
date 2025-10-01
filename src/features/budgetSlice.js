import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    budgets: [],
    monthlyGoal: 0,
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudget(state, action) {
            const { categoryId, amount, month, year } = action.payload;
            const existingBudget = state.budgets.find(
                b => b.categoryId === categoryId && b.month === month && b.year === year
            );

            if (existingBudget) {
                existingBudget.amount = amount;
            } else {
                state.budgets.push(action.payload);
            }
        },
        deleteBudget(state, action) {
            const { categoryId, month, year } = action.payload;
            state.budgets = state.budgets.filter(
                b => !(b.categoryId === categoryId && b.month === month && b.year === year)
            );
        },
        setMonthlyGoal(state, action) {
            state.monthlyGoal = action.payload;
        },
    },
});

export const { setBudget, deleteBudget, setMonthlyGoal } = budgetSlice.actions;

export const selectBudgetForCategory = (state, categoryId, month, year) => {
    return state.budget.budgets.find(
        b => b.categoryId === categoryId && b.month === month && b.year === year
    );
};

export const selectAllBudgets = (state) => state.budget.budgets;

export const selectMonthlyGoal = (state) => state.budget.monthlyGoal;

export const selectCurrentMonthBudgets = (state) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.budget.budgets.filter(
        b => b.month === currentMonth && b.year === currentYear
    );
};

export default budgetSlice.reducer;
