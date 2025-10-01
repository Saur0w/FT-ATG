import { useState } from 'react';
import Dashboard from '../../assets/dashboard.svg';
import Transaction from '../../assets/transaction.svg';
import Budget from '../../assets/budget.svg';
import Logo from '../../assets/finance.svg';

const Header = ({ activeTab, setActiveTab }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: Dashboard },
        { id: 'transactions', name: 'Transactions', icon: Transaction },
        { id: 'budget', name: 'Budget', icon: Budget },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 z-50">
                            <img src={Logo} alt="logo" className="w-8 h-8" />
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                Finance Tracker
                            </h1>
                        </div>

                        <nav className="hidden md:flex gap-4">
                            {tabs.map(tab => {
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab.id)}
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

                        <button
                            className="md:hidden z-50 p-2"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 bg-gray-900 z-40 md:hidden transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="h-20"></div>

                    <nav className="flex-1 flex flex-col justify-center px-8 space-y-6">
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`flex items-center gap-4 text-left py-4 px-4 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <img
                                        src={tab.icon}
                                        alt={tab.name}
                                        className={`w-8 h-8 transition-all ${
                                            isActive
                                                ? 'brightness-0 invert'
                                                : 'brightness-0 invert opacity-70'
                                        }`}
                                    />
                                    <span className="text-3xl font-semibold">{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="border-t border-gray-700 py-6 px-8">
                        <p className="text-gray-500 text-sm text-center">
                            Personal Finance Tracker
                        </p>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            <div className="h-20"></div>
        </>
    );
};

export default Header;
