const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions
} = require('../models/dashboardModel');

const { successResponse, errorResponse } = require('../utils/response');


function summary(req, res) {
  try {
    const data = getSummary();

    return successResponse(res, {
      total_income:   data.total_income,
      total_expenses: data.total_expenses,
      net_balance:    data.net_balance,
      total_records:  data.total_records,

      
      status: data.net_balance >= 0 ? 'surplus' : 'deficit'
    });

  } catch (error) {
    console.error('Summary error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

function categoryBreakdown(req, res) {
  try {
    const data = getCategoryBreakdown();

  
    const income_categories  = data.filter(item => item.type === 'income');
    const expense_categories = data.filter(item => item.type === 'expense');

    return successResponse(res, {
      income_categories,
      expense_categories
    });

  } catch (error) {
    console.error('Category breakdown error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}


function monthlyTrends(req, res) {
  try {
    const data = getMonthlyTrends();

  
    const trends = data.map(month => ({
      ...month,
      net_balance: month.income - month.expenses
    }));

    return successResponse(res, { trends });

  } catch (error) {
    console.error('Monthly trends error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}


function recentTransactions(req, res) {
  try {

   
    const limit = parseInt(req.query.limit) || 10;


    if (limit > 50) {
      return errorResponse(res, 'Limit cannot exceed 50', 400);
    }

    const transactions = getRecentTransactions(limit);

    return successResponse(res, {
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error('Recent transactions error:', error);
    return errorResponse(res, 'Something went wrong', 500);
  }
}

module.exports = {
  summary,
  categoryBreakdown,
  monthlyTrends,
  recentTransactions
};