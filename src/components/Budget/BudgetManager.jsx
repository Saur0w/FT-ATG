import { useSelector } from 'react-redux';
import { selectExpenseCategories } from '../../features/categoriesSlice';
import { selectAllTransactions } from '../../features/transactionsSlice';
import { selectAllBudgets } from '../../features/budgetSlice';
import { getCurrentMonthTransactions } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import BudgetCard from './BudgetCard';
import Target from '../../assets/target.svg';
import Check from '../../assets/check.svg';
import Warning from '../../assets/warning.svg';
import Alert from '../../assets/alert.svg';
import Thumb from '../../assets/thumbs.svg';

const BudgetManager = () => {
    const categories = useSelector(selectExpenseCategories);
    const allTransactions = useSelector(selectAllTransactions);
    const budgets = useSelector(selectAllBudgets);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthTransactions = getCurrentMonthTransactions(allTransactions);

    const totalBudget = budgets
        .filter(b => b.month === currentMonth && b.year === currentYear)
        .reduce((sum, b) => sum + b.amount, 0);

    const totalSpent = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalRemaining = totalBudget - totalSpent;
    const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;

    const getOverallStatus = () => {
        if (totalBudget === 0) {
            return {
                icon: <img src={Target} alt='target' />,
                message: 'Set your first budget to start tracking',
                color: 'text-gray-600',
                bgColor: 'bg-gray-50'
            };
        }

        if (totalSpent > totalBudget) {
            return {
                icon: <img src={Alert} alt='alert' />,
                message: 'You\'re over budget this month!',
                color: 'text-red-700',
                bgColor: 'bg-red-50'
            };
        }

        if (overallProgress >= 90) {
            return {
                icon: <img src={Warning} alt='warning' />,
                message: 'Almost at your monthly budget limit',
                color: 'text-orange-700',
                bgColor: 'bg-orange-50'
            };
        }

        if (overallProgress >= 70) {
            return {
                icon: <img src={Thumb} alt='still' />,
                message: 'Good progress! Keep tracking your expenses',
                color: 'text-blue-700',
                bgColor: 'bg-blue-50'
            };
        }

        return {
            icon: <img src={Check} alt='check' />,
            message: 'Excellent! You\'re managing your budget well',
            color: 'text-green-700',
            bgColor: 'bg-green-50'
        };
    };

    const overallStatus = getOverallStatus();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Budget Manager</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Set monthly budgets for each category and track your spending
                </p>
            </div>

            <div className={`${overallStatus.bgColor} rounded-xl p-4 sm:p-6 border-2 transition-all duration-300 hover:shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl">{overallStatus.icon}</span>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                {monthNames[currentMonth]} {currentYear}
                            </h2>
                            <p className={`${overallStatus.color} text-xs sm:text-sm font-medium`}>
                                {overallStatus.message}
                            </p>
                        </div>
                    </div>
                </div>

                {totalBudget > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3 sm:p-4">
                                <p className="text-xs text-gray-600 mb-1">Total Budget</p>
                                <p className="text-base sm:text-lg font-bold text-gray-800">
                                    {formatCurrency(totalBudget)}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4">
                                <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                                <p className={`text-base sm:text-lg font-bold ${
                                    totalSpent > totalBudget ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                    {formatCurrency(totalSpent)}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1">
                                <p className="text-xs text-gray-600 mb-1">Remaining</p>
                                <p className={`text-base sm:text-lg font-bold ${
                                    totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {formatCurrency(totalRemaining)}
                                </p>
                            </div>
                        </div>

                        <div className="w-full bg-white rounded-full h-3 sm:h-4 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    totalSpent > totalBudget ? 'bg-red-500' :
                                        overallProgress >= 90 ? 'bg-orange-500' :
                                            overallProgress >= 70 ? 'bg-yellow-500' :
                                                'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(overallProgress, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
                            {overallProgress.toFixed(1)}% of total budget used
                        </p>
                    </>
                )}
            </div>

            <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                    Category Budgets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
        </div>
    );
};

export default BudgetManager;
