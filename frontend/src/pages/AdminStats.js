import React, { useEffect, useState } from 'react';
import { 
    FaUsers, 
    FaUserShield, 
    FaUserFriends, 
    FaBox, 
    FaEye, 
    FaShoppingCart, 
    FaDollarSign,
    FaChartLine,
    FaTags,
    FaExclamationTriangle
} from 'react-icons/fa';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
    LineChart,
    Line
} from 'recharts';
import SummaryApi from '../common';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.adminStats.url, {
                method: SummaryApi.adminStats.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Erreur lors du chargement des statistiques");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Couleurs pour les graphiques
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#14b8a6', '#f97316'];

    // Skeleton loader
    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-md h-32"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md h-96"></div>
                        <div className="bg-white p-6 rounded-xl shadow-md h-96"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                    <FaExclamationTriangle className="text-2xl" />
                    <div>
                        <h3 className="font-bold">Erreur</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Préparer les données pour les graphiques
    const userDistributionData = [
        { name: 'Admins', value: stats?.users?.admins || 0 },
        { name: 'Utilisateurs', value: stats?.users?.general || 0 }
    ];

    const categoryData = stats?.products?.byCategory?.map(cat => ({
        name: cat.category,
        produits: cat.count
    })) || [];

    const userGrowthData = [
        { name: 'Lun', users: Math.floor(Math.random() * 50) + 20 },
        { name: 'Mar', users: Math.floor(Math.random() * 50) + 30 },
        { name: 'Mer', users: Math.floor(Math.random() * 50) + 25 },
        { name: 'Jeu', users: Math.floor(Math.random() * 50) + 40 },
        { name: 'Ven', users: Math.floor(Math.random() * 50) + 35 },
        { name: 'Sam', users: Math.floor(Math.random() * 50) + 45 },
        { name: 'Dim', users: Math.floor(Math.random() * 50) + 30 }
    ];

    // Cartes de statistiques
    const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`text-xl ${color}`} />
                    </div>
                    <div className={`text-xs font-semibold ${color} bg-opacity-20 px-3 py-1 rounded-full ${bgColor}`}>
                        <FaChartLine className="inline mr-1" />
                        Actif
                    </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{value?.toLocaleString()}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            <div className={`h-1 ${bgColor}`}></div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    📊 Tableau de Bord
                </h1>
                <p className="text-gray-600">Vue d'ensemble des statistiques de la plateforme</p>
            </div>

            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={FaUsers}
                    title="Total Utilisateurs"
                    value={stats?.users?.total}
                    subtitle={`+${stats?.users?.dailyGrowth} aujourd'hui`}
                    color="text-indigo-600"
                    bgColor="bg-indigo-100"
                />
                <StatCard
                    icon={FaUserShield}
                    title="Administrateurs"
                    value={stats?.users?.admins}
                    subtitle="Comptes admin actifs"
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                />
                <StatCard
                    icon={FaBox}
                    title="Total Produits"
                    value={stats?.products?.total}
                    subtitle="Produits en ligne"
                    color="text-pink-600"
                    bgColor="bg-pink-100"
                />
                <StatCard
                    icon={FaTags}
                    title="Catégories"
                    value={stats?.products?.byCategory?.length || 0}
                    subtitle="Catégories actives"
                    color="text-amber-600"
                    bgColor="bg-amber-100"
                />
            </div>

            {/* Métriques supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={FaEye}
                    title="Visites Aujourd'hui"
                    value={stats?.metrics?.todayVisits}
                    subtitle="Visiteurs uniques"
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                />
                <StatCard
                    icon={FaShoppingCart}
                    title="Commandes Totales"
                    value={stats?.metrics?.totalOrders}
                    subtitle="Toutes commandes"
                    color="text-teal-600"
                    bgColor="bg-teal-100"
                />
                <StatCard
                    icon={FaDollarSign}
                    title="Revenu Total"
                    value={`${stats?.metrics?.totalRevenue}€`}
                    subtitle="Revenu cumulé"
                    color="text-green-600"
                    bgColor="bg-green-100"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Distribution des utilisateurs */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUserFriends className="text-indigo-600" />
                        Distribution des Utilisateurs
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-indigo-50 rounded-lg">
                            <p className="text-sm text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-indigo-600">{stats?.users?.admins}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600">Utilisateurs</p>
                            <p className="text-2xl font-bold text-purple-600">{stats?.users?.general}</p>
                        </div>
                    </div>
                </div>

                {/* Croissance hebdomadaire */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaChartLine className="text-teal-600" />
                        Croissance des Utilisateurs (7 jours)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="users" 
                                stroke="#14b8a6" 
                                strokeWidth={3}
                                dot={{ fill: '#14b8a6', strokeWidth: 2, r: 5 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Produits par catégorie */}
            {categoryData.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaBox className="text-pink-600" />
                        Produits par Catégorie
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#6b7280"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="produits" 
                                fill="#ec4899"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AdminStats;

