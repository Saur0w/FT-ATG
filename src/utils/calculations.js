
export const calculateTotal = (transactions, type) => {
    return transactions
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateSpendingByCategory = (transactions, categories) => {
    const spending = {};

    transactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
            const categoryId = transaction.categoryId;
            if (!spending[categoryId]) {
                spending[categoryId] = 0;
            }
            spending[categoryId] += transaction.amount;
        });

    return Object.entries(spending).map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        return {
            categoryId: parseInt(categoryId),
            name: category?.name || 'Unknown',
            amount,
            icon: category?.icon || '📊',
            color: category?.color || '#gray',
        };
    }).sort((a, b) => b.amount - a.amount);
};

export const calculateIncomeByCategory = (transactions, categories) => {
    const income = {};

    transactions
        .filter(t => t.type === 'income')
        .forEach(transaction => {
            const categoryId = transaction.categoryId;
            if (!income[categoryId]) {
                income[categoryId] = 0;
            }
            income[categoryId] += transaction.amount;
        });

    return Object.entries(income).map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        return {
            categoryId: parseInt(categoryId),
            name: category?.name || 'Unknown',
            amount,
            icon: category?.icon || '📊',
            color: category?.color || '#gray',
        };
    }).sort((a, b) => b.amount - a.amount);
};

export const calculateBudgetProgress = (spent, budget) => {
    if (budget === 0) return 0;
    return (spent / budget) * 100;
};

export const isOverBudget = (spent, budget) => {
    return spent > budget;
};

export const calculateAverageTransaction = (transactions) => {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return total / transactions.length;
};

export const getCurrentMonthTransactions = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );
    });
};

export const convertAmount = (amount, fromRate, toRate) => {
    if (!fromRate || !toRate) return amount;
    return (amount / fromRate) * toRate;
};
