import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBudget } from '../../features/budgetSlice';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateBudgetProgress, isOverBudget } from '../../utils/calculations';

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

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            step="0.01"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            className="w-28 px-3 py-1 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Budget"
                            autoFocus
                        />
                        <button
                            onClick={handleSaveBudget}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewBudget(budgetAmount);
                            }}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {budgetAmount > 0 ? 'Edit Budget' : 'Set Budget'}
                    </button>
                )}
            </div>

            {budgetAmount > 0 ? (
                <>
                    <div className="flex justify-between text-sm mb-2">
            <span className={overBudget ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              Spent: {formatCurrency(spentAmount)}
            </span>
                        <span className="text-gray-600">
              Budget: {formatCurrency(budgetAmount)}
            </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className={`h-3 rounded-full transition-all ${
                                overBudget ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <p className={`text-sm font-medium ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
                        {overBudget
                            ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
                            : remaining > 0
                                ? `${formatCurrency(remaining)} remaining (${formatPercentage(100 - progress)})`
                                : 'Budget limit reached'
                        }
                    </p>
                </>
            ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                    No budget set for this category
                </div>
            )}
        </div>
    );
};

export default BudgetCard;
