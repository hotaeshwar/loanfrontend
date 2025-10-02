import React from 'react';
import {
  FaBell,
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload
} from 'react-icons/fa';

const Dashboard = ({ dashboardData, reminders, onDownloadExcel, downloadingExcel }) => {
  const cards = [
    {
      title: 'Total Borrowed',
      value: `₹${dashboardData?.total_borrowed?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave className="text-blue-600 text-3xl" />,
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-xl',
      textColor: 'text-blue-900'
    },
    {
      title: 'Total Paid',
      value: `₹${dashboardData?.total_paid?.toLocaleString() || 0}`,
      icon: <FaCheckCircle className="text-green-600 text-3xl" />,
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-xl',
      textColor: 'text-green-900'
    },
    {
      title: 'Remaining Balance',
      value: `₹${dashboardData?.total_remaining?.toLocaleString() || 0}`,
      icon: <FaExclamationTriangle className="text-orange-600 text-3xl" />,
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg hover:shadow-xl',
      textColor: 'text-orange-900'
    },
    {
      title: 'Monthly Due',
      value: `₹${dashboardData?.monthly_payment_due?.toLocaleString() || 0}`,
      icon: <FaCalendarAlt className="text-purple-600 text-3xl" />,
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg hover:shadow-xl',
      textColor: 'text-purple-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <span className="relative inline-block hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              BiD Loan Management
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5">
              <FaBell className="text-white" />
              <span className="text-white font-semibold">
                {reminders?.length || 0} upcoming payments
              </span>
            </div>

            {/* Excel Export Button */}
            <button
              onClick={onDownloadExcel}
              disabled={downloadingExcel}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              <FaDownload className={`text-white ${downloadingExcel ? 'animate-spin' : ''}`} />
              <span className="text-white font-semibold hidden sm:inline">
                {downloadingExcel ? 'Downloading...' : 'Export Excel'}
              </span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, index) => (
            <div key={index} className={`${card.bgColor} rounded-2xl p-4 md:p-6 lg:p-8 transition-all duration-500 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs md:text-sm font-semibold tracking-wide uppercase truncate">{card.title}</p>
                  <p className={`${card.textColor} text-lg md:text-2xl lg:text-3xl font-bold mt-1 md:mt-2 break-words`}>
                    {card.value}
                  </p>
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl opacity-90 ml-2 flex-shrink-0">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl shadow-lg p-6 sm:p-8 border-l-4 border-rose-500 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
            <h3 className="text-lg font-bold text-rose-700 mb-3">Active Loans</h3>
            <p className="text-4xl font-black text-rose-800">{dashboardData?.active_loans || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl shadow-lg p-6 sm:p-8 border-l-4 border-emerald-500 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
            <h3 className="text-lg font-bold text-emerald-700 mb-3">Completed Loans</h3>
            <p className="text-4xl font-black text-emerald-800">{dashboardData?.completed_loans || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl shadow-lg p-6 sm:p-8 border-l-4 border-violet-500 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
            <h3 className="text-lg font-bold text-violet-700 mb-3">Total Loans</h3>
            <p className="text-4xl font-black text-violet-800">{dashboardData?.total_loans || 0}</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio Overview
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Payment Progress */}
            <div>
              <h4 className="text-md font-medium text-slate-700 mb-3">Overall Payment Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Paid</span>
                  <span className="font-semibold text-green-600">
                    {dashboardData?.total_borrowed > 0
                      ? ((dashboardData.total_paid / dashboardData.total_borrowed) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${dashboardData?.total_borrowed > 0
                        ? (dashboardData.total_paid / dashboardData.total_borrowed) * 100
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Loan Status Distribution */}
            <div>
              <h4 className="text-md font-medium text-slate-700 mb-3">Loan Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${dashboardData?.total_loans > 0
                            ? (dashboardData.active_loans / dashboardData.total_loans) * 100
                            : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-rose-700">{dashboardData?.active_loans || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Completed</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full"
                        style={{
                          width: `${dashboardData?.total_loans > 0
                            ? (dashboardData.completed_loans / dashboardData.total_loans) * 100
                            : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-emerald-700">{dashboardData?.completed_loans || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payments Preview */}
        {reminders?.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
              <FaBell className="mr-2 text-amber-600" />
              Upcoming Payments
            </h3>
            <div className="space-y-3">
              {reminders.slice(0, 3).map((reminder) => (
                <div key={reminder.loan_id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  <div>
                    <p className="font-medium text-slate-800">{reminder.source}</p>
                    <p className="text-sm text-slate-600">{reminder.loan_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">₹{reminder.monthly_payment?.toLocaleString()}</p>
                    <p className={`text-xs font-medium ${reminder.days_until_payment <= 3 ? 'text-red-600' :
                        reminder.days_until_payment <= 7 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                      {reminder.days_until_payment <= 0 ? 'Overdue!' :
                        reminder.days_until_payment === 1 ? 'Due tomorrow' :
                          `${reminder.days_until_payment} days left`}
                    </p>
                  </div>
                </div>
              ))}
              {reminders.length > 3 && (
                <div className="text-center">
                  <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <span>+{reminders.length - 3} more payments</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;