const userModel = require("../../models/userModel");
const productModel = require("../../models/productModel");

async function getAdminStats(req, res) {
    try {
        // Récupérer les statistiques utilisateurs
        const totalUsers = await userModel.countDocuments();
        const adminUsers = await userModel.countDocuments({ role: "ADMIN" });
        const generalUsers = await userModel.countDocuments({ role: "GENERAL" });

        // Récupérer les statistiques produits
        const totalProducts = await productModel.countDocuments();

        // Compter les produits par catégorie
        const productsByCategory = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Pour l'instant, valeurs statiques pour certaines métriques
        // À remplacer plus tard avec de vraies données
        const stats = {
            users: {
                total: totalUsers,
                admins: adminUsers,
                general: generalUsers,
                dailyGrowth: Math.floor(Math.random() * 20) + 5, // Valeur temporaire
                weeklyGrowth: Math.floor(Math.random() * 100) + 20 // Valeur temporaire
            },
            products: {
                total: totalProducts,
                byCategory: productsByCategory.map(cat => ({
                    category: cat._id,
                    count: cat.count
                })),
                outOfStock: 0, // À implémenter avec un champ stock
                lowStock: 0    // À implémenter avec un champ stock
            },
            metrics: {
                todayVisits: Math.floor(Math.random() * 500) + 100,
                totalOrders: Math.floor(Math.random() * 1000) + 200,
                totalRevenue: (Math.random() * 50000 + 10000).toFixed(2)
            }
        };

        res.status(200).json({
            success: true,
            message: "Statistiques récupérées avec succès",
            data: stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Erreur lors de la récupération des statistiques"
        });
    }
}

module.exports = getAdminStats;

