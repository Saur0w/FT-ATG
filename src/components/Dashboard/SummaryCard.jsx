import { formatCurrency } from '../../utils/formatters';

const SummaryCard = ({ title, amount, type, icon }) => {
    const colorClasses = {
        income: 'bg-green-50 border-green-200 text-green-800',
        expense: 'bg-red-50 border-red-200 text-red-800',
    };

    const amountColor = {
        income: 'text-green-600',
        expense: 'text-red-600',
    };

    return (
        <div className={`p-6 rounded-lg border-2 ${colorClasses[type]} transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-75 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${amountColor[type]}`}>
                        {formatCurrency(amount)}
                    </p>
                </div>
                <div className="text-5xl opacity-80">{icon}</div>
            </div>
        </div>
    );
};

export default SummaryCard;
