const { Products, Orders, OrderDetails, Users, Customers } = require('../models');

const getReport = async (start, end, user) => {
    let orders = await Orders.aggregate([
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
            $unwind: {
                path: '$OrderDetails',
                preserveNullAndEmptyArrays: true
            }
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
            $unwind: {
                path: '$OrderDetails.Product',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                User: { $first: '$User' },
                Customer: { $first: '$Customer' },
                TotalAmount: { $first: '$TotalAmount' },
                AmountPaidByCustomer: { $first: '$AmountPaidByCustomer' },
                ChangeReturnedToCustomer: { $first: '$ChangeReturnedToCustomer' },
                OrderDetails: { $push: '$OrderDetails' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);

    let totalAmountReceived = 0;
    let totalProducts = 0;
    let totalProfit = 0;

    for (const order of orders) {
        order.OrderDetails.forEach(detail => {
            if (detail && detail.Product) {
                const cost = detail.Product.ImportPrice * detail.Quantity;
                totalProfit += (detail.Product.RetailPrice * detail.Quantity) - cost;
                totalProducts += detail.Quantity;
            }
        });

        const user = await Users.findById(order.User);
        const customer = await Customers.findById(order.Customer);

        order.EmployeeName = user.Fullname;
        order.CustomerName = customer.Fullname;
        order.CustomerPhoneNumber = customer.PhoneNumber;

        totalAmountReceived += order.TotalAmount;
    }

    const report = {
        totalAmountReceived,
        numberOfOrders: orders.length,
        numberOfProducts: totalProducts,
        orders
    };

    if (user && user.data.Role === 'admin') {
        report.totalProfit = totalProfit;
    }
    return report;
};

const getReportToday = async (req, res) => {
    const { user } = req;
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
    const { user } = req;
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

// const getReportThisWeek = async (req, res) => {
//     const { user } = req;
//     let startOfWeek = new Date();
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

//     let endOfWeek = new Date();
//     endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
//     try {
//         const report = await getReport(startOfWeek, endOfWeek, user);
//         res.status(200).json(report);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

const getReportThisWeek = async (req, res) => {
    const { user } = req;
    let now = new Date();
    let startOfWeek = new Date(now);
    let endOfWeek = new Date(now);

    startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
    endOfWeek.setHours(23, 59, 59, 999);

    try {
        const report = await getReport(startOfWeek, endOfWeek, user);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReportThisMonth = async (req, res) => {
    const { user } = req;
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
    const { user } = req;
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

const getMonthlyOrderCounts = async (req, res) => {
    try {
        const monthlyCounts = await Orders.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: '$TotalAmount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const result = [];
        for (let i = 1; i <= 12; i++) {
            const monthData = monthlyCounts.find(month => month._id === i);
            result.push({ month: i, total: monthData ? monthData.total : 0 });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardMetrics = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Đặt ngày đầu tiên và ngày hiện tại của tháng hiện tại
        let startOfThisMonth = new Date(currentYear, currentMonth, 1);
        startOfThisMonth.setHours(0, 0, 0, 0);

        let endOfThisMonth = new Date();
        endOfThisMonth.setHours(23, 59, 59, 999);

        // Đặt ngày đầu tiên và cuối cùng của tháng trước
        let startOfLastMonth = new Date(startOfThisMonth);
        let endOfLastMonth = new Date(startOfThisMonth);

        if (currentMonth === 0) {
            startOfLastMonth.setFullYear(currentYear - 1);
            startOfLastMonth.setMonth(11);
            endOfLastMonth.setFullYear(currentYear - 1);
            endOfLastMonth.setMonth(12);
            endOfLastMonth.setDate(0);
        } else {
            startOfLastMonth.setMonth(currentMonth - 1);
            endOfLastMonth.setMonth(currentMonth);
            endOfLastMonth.setDate(0);
        }
        startOfLastMonth.setHours(0, 0, 0, 0);
        endOfLastMonth.setHours(23, 59, 59, 999);
        // Tính tổng TotalAmount cho tháng hiện tại và tháng trước
        const totalAmountCurrent = await Orders.aggregate([
            { $match: { createdAt: { $gte: startOfThisMonth, $lt: endOfThisMonth } } },
            { $group: { _id: null, total: { $sum: '$TotalAmount' } } }
        ]);

        const totalAmountPrevious = await Orders.aggregate([
            { $match: { createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: '$TotalAmount' } } }
        ]);
        // 2. Tổng số đơn hàng cho tháng hiện tại và so sánh với tháng trước
        const totalOrdersThisMonth = await Orders.countDocuments({ createdAt: { $gte: startOfThisMonth, $lt: endOfThisMonth } });
        const totalOrdersLastMonth = await Orders.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } });

        // 3. Tổng số nhân viên
        const totalEmployees = await Users.countDocuments({ Role: 'employee' });

        // 4. Tổng số khách hàng được tạo trong tháng này và so sánh với tháng trước
        const totalCustomersThisMonth = await Customers.countDocuments({ createdAt: { $gte: startOfThisMonth, $lt: endOfThisMonth } });
        const totalCustomersLastMonth = await Customers.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth } });

        const calculatePercentageChange = (current, previous) => {
            return previous !== 0 ? ((current - previous) / previous) * 100 : 0;
        };

        // Định dạng kết quả JSON để trả về
        const result = {
            totalAmount: {
                current: totalAmountCurrent[0]?.total || 0,
                lastMonth: totalAmountPrevious[0]?.total || 0,
                percentageChange: calculatePercentageChange(
                    totalAmountCurrent[0]?.total || 0,
                    totalAmountPrevious[0]?.total || 0
                )
            },
            totalOrders: {
                current: totalOrdersThisMonth,
                lastMonth: totalOrdersLastMonth,
                percentageChange: calculatePercentageChange(totalOrdersThisMonth, totalOrdersLastMonth)
            },
            totalEmployees: totalEmployees,
            totalNewCustomers: {
                current: totalCustomersThisMonth,
                lastMonth: totalCustomersLastMonth,
                percentageChange: calculatePercentageChange(totalCustomersThisMonth, totalCustomersLastMonth)
            }
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getReportToday,
    getReportYesterday,
    getReportThisWeek,
    getReportThisMonth,
    getReportFromTo,
    getMonthlyOrderCounts,
    getDashboardMetrics
}