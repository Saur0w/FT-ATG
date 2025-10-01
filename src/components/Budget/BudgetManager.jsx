import { useSelector } from 'react-redux';
import { selectExpenseCategories } from '../../features/categoriesSlice';
import { selectAllTransactions } from '../../features/transactionsSlice';
import { selectAllBudgets } from '../../features/budgetSlice';
import { getCurrentMonthTransactions } from '../../utils/calculations';
import BudgetCard from './BudgetCard';

const BudgetManager = () => {
    const categories = useSelector(selectExpenseCategories);
    const allTransactions = useSelector(selectAllTransactions);
    const budgets = useSelector(selectAllBudgets);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthTransactions = getCurrentMonthTransactions(allTransactions);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Budget Manager</h1>
                <p className="text-gray-600 mt-2">
                    Set monthly budgets for each category and track your spending
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => {
                    const budget = budgets.find(
                        b => b.categoryId === category.id &&
                            b.month === currentMonth &&
                            b.year === currentYear
                    );

                    const spentAmount = currentMonthTransactions
                        .filter(t => t.type === 'expense' && t.categoryId === category.id)
                        .reduce((sum, t) => sum + t.amount, 0);

                    return (
                        <BudgetCard
                            key={category.id}
                            category={category}
                            budgetAmount={budget?.amount || 0}
                            spentAmount={spentAmount}
                            month={currentMonth}
                            year={currentYear}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetManager;
