import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../features/transactionsSlice';
import { selectExpenseCategories, selectIncomeCategories } from '../../features/categoriesSlice';
import { useGetExchangeRatesQuery } from '../../services/exchangeRateApi';
import { selectBaseCurrency, selectSupportedCurrencies } from '../../features/currencySlice';

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

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Add Transaction</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            value="expense"
                            checked={formData.type === 'expense'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
                            className="mr-2 cursor-pointer"
                        />
                        <span className="text-gray-700">Expense</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            value="income"
                            checked={formData.type === 'income'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
                            className="mr-2 cursor-pointer"
                        />
                        <span className="text-gray-700">Income</span>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
                <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {supportedCurrencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                    ))}
                </select>
                {formData.currency !== baseCurrency && exchangeRates && !isLoading && (
                    <p className="text-sm text-gray-600 mt-1">
                        Rate: 1 {formData.currency} = {exchangeRates.conversion_rates[baseCurrency].toFixed(4)} {baseCurrency}
                    </p>
                )}
                {isError && (
                    <p className="text-sm text-red-600 mt-1">Error loading exchange rates</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Add Transaction'}
            </button>
        </form>
    );
};

export default TransactionForm;
