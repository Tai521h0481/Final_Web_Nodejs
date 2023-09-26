const { Products, Orders, OrderDetails} = require('../models');

// const getReport = async (start, end, user) => {
//     const orders = await Orders.find({ 
//         createdAt: { 
//             $gte: start, 
//             $lte: end 
//         } 
//     })
//     .populate({
//         path: 'OrderDetails',
//         populate: {
//             path: 'Product'
//         }
//     })
//     .sort({ createdAt: -1 }); // Sort by createdAt in descending order
//     let totalAmountReceived = 0;
//     let totalProducts = 0;
//     let totalProfit = 0;

//     orders.forEach(order => {
//         totalAmountReceived += order.TotalAmount;
//         order.OrderDetails.forEach(detail => {
//             const cost = detail.Product.ImportPrice * detail.Quantity;
//             totalProfit += detail.UnitPrice * detail.Quantity - cost;
//         });
//         totalProducts += order.OrderDetails.length;
//     });
    
//     const report = {
//         totalAmountReceived,
//         numberOfOrders: orders.length,
//         numberOfProducts: totalProducts,
//         orders
//     };
    
//     if (user.data.Role === 'admin') {
//         report.totalProfit = totalProfit;
//     }
//     return report;
// }

const getReport = async (start, end, user) => {
    const orders = await Orders.aggregate([
        {
            $match: {
                createdAt: { 
                    $gte: start, 
                    $lte: end 
                } 
            }
        },
        {
            $lookup: {
                from: 'orderdetails',
                localField: '_id',
                foreignField: 'Order',
                as: 'OrderDetails'
            }
        },
        {
            $unwind: '$OrderDetails'
        },
        {
            $lookup: {
                from: 'products',
                localField: 'OrderDetails.Product',
                foreignField: '_id',
                as: 'OrderDetails.Product'
            }
        },
        {
            $unwind: '$OrderDetails.Product'
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);

    let totalAmountReceived = 0;
    let totalProducts = 0;
    let totalProfit = 0;

    orders.forEach(order => {
        totalAmountReceived += order.TotalAmount;
        const detail = order.OrderDetails;
        const cost = detail.Product.ImportPrice * detail.Quantity;
        totalProfit += detail.UnitPrice * detail.Quantity - cost;
        totalProducts += detail.Quantity;
    });
    
    const report = {
        totalAmountReceived,
        numberOfOrders: orders.length,
        numberOfProducts: totalProducts,
        orders
    };
    
    if (user.data.Role === 'admin') {
        report.totalProfit = totalProfit;
    }
    return report;
}


const getReportToday = async (req, res) => {
    const {user} = req;
    let startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    try {
        const report = await getReport(startOfToday, endOfToday, user);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReportYesterday = async (req, res) => {
    const {user} = req;
    let startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    let endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);
    try {
        const report = await getReport(startOfYesterday, endOfYesterday, user);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReportThisWeek = async (req, res) => {
    const {user} = req;
    let startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    let endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    try {
        const report = await getReport(startOfWeek, endOfWeek, user);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReportThisMonth = async (req, res) => {
    const {user} = req;
    let startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    try {
        const report = await getReport(startOfMonth, endOfMonth, user);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReportFromTo = async (req, res) => {
    const {user} = req;
    const { from, to } = req.body;
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    try {
        const report = await getReport(fromDate, toDate, user);
        res.status(200).json(report);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getReportToday,
    getReportYesterday,
    getReportThisWeek,
    getReportThisMonth,
    getReportFromTo
}