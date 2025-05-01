import React from 'react';
import { PieChart, Briefcase, TrendingUp, Clock } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
	return (
		<aside className="w-64 bg-white shadow-sm p-4">
			<nav className="space-y-1">
				<button
					className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
					onClick={() => setActiveTab('dashboard')}
				>
					<PieChart size={20} />
					<span className="font-medium">Dashboard</span>
				</button>

				<button
					className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'portfolio' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
					onClick={() => setActiveTab('portfolio')}
				>
					<Briefcase size={20} />
					<span className="font-medium">Portfolio</span>
				</button>

				<button
					className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'market' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
					onClick={() => setActiveTab('market')}
				>
					<TrendingUp size={20} />
					<span className="font-medium">Market</span>
				</button>

				<button
					className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
					onClick={() => setActiveTab('history')}
				>
					<Clock size={20} />
					<span className="font-medium">History</span>
				</button>
			</nav>
		</aside>
	);
}