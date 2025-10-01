import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../../features/transactionsSlice';
import { selectCategoryById } from '../../features/categoriesSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Bin from '../../assets/bin.svg';

const TransactionItem = ({ transaction }) => {
    const dispatch = useDispatch();
    const category = useSelector(state =>
        selectCategoryById(state, transaction.categoryId)
    );

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            dispatch(deleteTransaction(transaction.id));
        }
    };

    const typeColor = transaction.type === 'income'
        ? 'text-green-600 bg-green-50'
        : 'text-red-600 bg-red-50';

    const amountPrefix = transaction.type === 'income' ? '+' : '-';

    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 flex-1">

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${typeColor}`}>
              {category?.name || 'Unknown'}

            </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {formatDate(transaction.date)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <p className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {amountPrefix}{formatCurrency(transaction.amount)}
                </p>

                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete transaction"
                >
                    <img src={Bin} alt="Delete" width="20" height="20" />
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;
