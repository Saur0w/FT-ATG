import { useSelector } from 'react-redux';
import { selectTotalIncome, selectTotalExpenses, selectSavings } from '../../features/transactionsSlice';
import SummaryCard from './SummaryCard';
import SpendingChart from './SpendingChart';
import IncomeChart from './IncomeChart';

const Dashboard = () => {
    const totalIncome = useSelector(selectTotalIncome);
    const totalExpenses = useSelector(selectTotalExpenses);
    const savings = useSelector(selectSavings);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Income"
                    amount={totalIncome}
                    type="income"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={totalExpenses}
                    type="expense"
                />
                <SummaryCard
                    title="Savings"
                    amount={savings}
                    type={savings >= 0 ? 'income' : 'expense'}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingChart />
                <IncomeChart />
            </div>
        </div>
    );
};

export default Dashboard;
