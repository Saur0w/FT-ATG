import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBudget } from '../../features/budgetSlice';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateBudgetProgress, isOverBudget } from '../../utils/calculations';
import Target from '../../assets/target.svg';

const BudgetCard = ({ category, budgetAmount, spentAmount, month, year }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(budgetAmount || '');

    const handleSaveBudget = () => {
        if (newBudget && parseFloat(newBudget) >= 0) {
            dispatch(setBudget({
                categoryId: category.id,
                amount: parseFloat(newBudget),
                month,
                year,
            }));
            setIsEditing(false);
        }
    };

    const progress = calculateBudgetProgress(spentAmount, budgetAmount);
    const overBudget = isOverBudget(spentAmount, budgetAmount);
    const remaining = budgetAmount - spentAmount;

    const getFeedback = () => {
        if (!budgetAmount || budgetAmount === 0) {
            return {
                message: 'Set a budget to start tracking',
                color: 'text-gray-500',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200'
            };
        }

        if (overBudget) {
            const overPercent = ((spentAmount - budgetAmount) / budgetAmount * 100).toFixed(0);
            return {
                message: `You're ${overPercent}% over budget! Time to cut back.`,
                color: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-300'
            };
        }

        if (progress >= 90) {
            return {
                message: 'Almost at limit! Watch your spending carefully.',
                color: 'text-orange-700',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-300'
            };
        }

        if (progress >= 75) {
            return {
                message: 'You\'re 75% through your budget. Be mindful!',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-300'
            };
        }

        if (progress >= 50) {
            return {
                message: 'On track! Keep managing your expenses well.',
                color: 'text-blue-700',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-300'
            };
        }

        return {
            message: 'Great job! You\'re well within budget.',
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-300'
        };
    };

    const feedback = getFeedback();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{category.icon}</span>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800">{category.name}</h3>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            step="0.01"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            className="w-24 sm:w-28 px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Budget"
                            autoFocus
                        />
                        <button
                            onClick={handleSaveBudget}
                            className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewBudget(budgetAmount);
                            }}
                            className="px-2 sm:px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors self-start sm:self-auto"
                    >
                        {budgetAmount > 0 ? 'Edit Budget' : 'Set Budget'}
                    </button>
                )}
            </div>

            {budgetAmount > 0 ? (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm mb-2 gap-1">
                        <span className={overBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                            Spent: {formatCurrency(spentAmount)}
                        </span>
                        <span className="text-gray-600">
                            Budget: {formatCurrency(budgetAmount)}
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                overBudget ? 'bg-red-500' :
                                    progress >= 90 ? 'bg-orange-500' :
                                        progress >= 75 ? 'bg-yellow-500' :
                                            'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <div className="mb-3">
                        <p className={`text-xs sm:text-sm font-semibold ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
                            {overBudget
                                ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
                                : remaining > 0
                                    ? `${formatCurrency(remaining)} remaining (${formatPercentage(100 - progress)})`
                                    : 'Budget limit reached'
                            }
                        </p>
                    </div>

                    <div className={`${feedback.bgColor} ${feedback.borderColor} border rounded-lg p-3 transition-all duration-300`}>
                        <div className="flex items-start gap-2">
                            <span className="text-lg sm:text-xl">{feedback.icon}</span>
                            <div className="flex-1">
                                <p className={`${feedback.color} text-xs sm:text-sm font-medium`}>
                                    {feedback.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-6 sm:py-8">
                    <div className="text-4xl sm:text-5xl mb-2"><img src={Target} alt='target' /></div>
                    <p className="text-gray-400 text-xs sm:text-sm">
                        No budget set for this category
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                    >
                        Set Budget Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default BudgetCard;
