import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../features/transactionsSlice';
import { selectExpenseCategories, selectIncomeCategories } from '../../features/categoriesSlice';
import { useGetExchangeRatesQuery } from '../../services/exchangeRateApi';
import { selectBaseCurrency, selectSupportedCurrencies } from '../../features/currencySlice';
import Exchange from '../../assets/switch.svg';

const TransactionForm = () => {
    const dispatch = useDispatch();
    const baseCurrency = useSelector(selectBaseCurrency);
    const supportedCurrencies = useSelector(selectSupportedCurrencies);
    const expenseCategories = useSelector(selectExpenseCategories);
    const incomeCategories = useSelector(selectIncomeCategories);

    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        categoryId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        currency: baseCurrency,
    });

    const { data: exchangeRates, isLoading, isError } = useGetExchangeRatesQuery(formData.currency);

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalAmount = parseFloat(formData.amount);
        if (formData.currency !== baseCurrency && exchangeRates) {
            const rate = exchangeRates.conversion_rates[baseCurrency];
            finalAmount = finalAmount * rate;
        }

        dispatch(addTransaction({
            ...formData,
            amount: finalAmount,
            categoryId: parseInt(formData.categoryId),
            originalAmount: parseFloat(formData.amount),
            originalCurrency: formData.currency,
        }));

        setFormData({
            type: 'expense',
            amount: '',
            categoryId: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            currency: baseCurrency,
        });
    };

    const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;
    const convertedAmount = exchangeRates && formData.amount && formData.currency !== baseCurrency
        ? (parseFloat(formData.amount) * exchangeRates.conversion_rates[baseCurrency]).toFixed(2)
        : null;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Transaction</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:border-blue-300 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                        <input
                            type="radio"
                            value="expense"
                            checked={formData.type === 'expense'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
                            className="mr-2 cursor-pointer"
                        />
                        <span className="text-gray-700 font-medium">Expense</span>
                    </label>
                    <label className="flex items-center cursor-pointer px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:border-green-300 has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                        <input
                            type="radio"
                            value="income"
                            checked={formData.type === 'income'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
                            className="mr-2 cursor-pointer"
                        />
                        <span className="text-gray-700 font-medium">Income</span>
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
                <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="0.00"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
                <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                    {supportedCurrencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                    ))}
                </select>

                {formData.currency !== baseCurrency && exchangeRates && !isLoading && formData.amount && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg transition-all duration-300 shadow-sm">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-700">
                                <img src={Exchange} alt="Exchange" className="w-4 h-4" />
                                <span className="font-medium">Exchange Rate:</span>
                            </div>
                            <span className="font-semibold text-blue-700 bg-white px-3 py-1 rounded-full">
                                1 {formData.currency} = {exchangeRates.conversion_rates[baseCurrency].toFixed(4)} {baseCurrency}
                            </span>
                        </div>
                        {convertedAmount && (
                            <div className="pt-3 border-t border-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                        Converted Amount:
                                    </span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {convertedAmount} {baseCurrency}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-right">
                                    This amount will be saved in your base currency
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {isError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <span className="text-red-600">Error</span>
                        <p className="text-sm text-red-600">Failed to load exchange rates. Please check your API key.</p>
                    </div>
                )}

                {isLoading && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        <span>Loading exchange rates...</span>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Enter description"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
                <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Loading...
                    </span>
                ) : (
                    'Add Transaction'
                )}
            </button>
        </form>
    );
};

export default TransactionForm;
