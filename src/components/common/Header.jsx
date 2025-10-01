import Dashboard from '../../assets/dashboard.svg';
import Transaction from '../../assets/transaction.svg';
import Budget from '../../assets/budget.svg';
import Logo from '../../assets/finance.svg';

const Header = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: Dashboard },
        { id: 'transactions', name: 'Transactions', icon: Transaction },
        { id: 'budget', name: 'Budget', icon: Budget },
    ];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="logo" className="w-8 h-8" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            Finance Tracker
                        </h1>
                    </div>

                    <nav className="flex gap-4">
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all group ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'
                                    }`}
                                >
                                    <img
                                        src={tab.icon}
                                        alt={tab.name}
                                        className={`w-5 h-5 transition-all ${
                                            isActive
                                                ? 'brightness-0 invert'
                                                : 'brightness-0 group-hover:brightness-0 group-hover:invert'
                                        }`}
                                    />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
