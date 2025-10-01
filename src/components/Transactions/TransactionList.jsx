import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredTransactions, setFilter } from '../../features/transactionsSlice';
import TransactionItem from './TransactionItem';

const TransactionList = () => {
    const dispatch = useDispatch();
    const transactions = useSelector(selectFilteredTransactions);
    const filter = useSelector(state => state.transactions.filter);

    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Transactions</h2>

                {/* Filter */}
                <select
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>

            {sortedTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    No transactions found. Add your first transaction!
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sortedTransactions.map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
