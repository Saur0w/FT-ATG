import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import TransactionForm from './components/Transactions/TransactionForm'
import TransactionList from './components/Transactions/TransactionList'
import BudgetManager from './components/Budget/BudgetManager'
import Header from './components/common/Header'

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen bg-gray-50">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="container mx-auto px-4 py-8">
                {activeTab === 'dashboard' && <Dashboard />}

                {activeTab === 'transactions' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TransactionForm />
                        <TransactionList />
                    </div>
                )}

                {activeTab === 'budget' && <BudgetManager />}
            </main>
        </div>
    )
}

export default App
