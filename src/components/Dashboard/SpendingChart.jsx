import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTransactions } from '../../features/transactionsSlice';
import { selectAllCategories } from '../../features/categoriesSlice';
import { calculateSpendingByCategory } from '../../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const SpendingChart = () => {
    const transactions = useSelector(selectAllTransactions);
    const categories = useSelector(selectAllCategories);

    const chartData = useMemo(() => {
        return calculateSpendingByCategory(transactions, categories);
    }, [transactions, categories]);

    if (chartData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
                <div className="flex items-center justify-center h-64 text-gray-400">
                    No expense data available
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => `$${value.toFixed(2)}`}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Expenses" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingChart;
