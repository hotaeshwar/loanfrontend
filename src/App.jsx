import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaPlus, 
  FaTrash, 
  FaEye, 
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBars,
  FaTimes,
  FaHome,
  FaList,
  FaPaypal,
  FaDownload,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';

// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDUy_SoP4qqzu4ObV86lLn3tBNIURImVVM",
  authDomain: "loan-e41f8.firebaseapp.com",
  projectId: "loan-e41f8",
  storageBucket: "loan-e41f8.firebasestorage.app",
  messagingSenderId: "816558677137",
  appId: "1:816558677137:web:9c7a9761330dadfa027330"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentication Component
const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCreditCard className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Loan Manager</h1>
          <p className="text-gray-600 mt-2">Manage your loans efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-400"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ dashboardData, reminders }) => {
  const stats = [
    {
      title: 'Total Borrowed',
      value: `₹${(dashboardData.total_borrowed || 0).toLocaleString()}`,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: <FaCreditCard />
    },
    {
      title: 'Total Paid',
      value: `₹${(dashboardData.total_paid || 0).toLocaleString()}`,
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      icon: <FaCheckCircle />
    },
    {
      title: 'Total Remaining',
      value: `₹${(dashboardData.total_remaining || 0).toLocaleString()}`,
      gradient: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      icon: <FaExclamationTriangle />
    },
    {
      title: 'Active Loans',
      value: dashboardData.active_loans || 0,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      icon: <FaList />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 text-sm font-medium">{stat.title}</p>
              <div className={`${stat.bgColor} p-3 rounded-lg shadow-sm`}>
                <div className={`${stat.textColor} text-2xl`}>{stat.icon}</div>
              </div>
            </div>
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {reminders.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="bg-amber-100 p-2 rounded-lg mr-3">
              <FaBell className="text-amber-600 text-lg" />
            </div>
            Upcoming Payments ({reminders.length})
          </h3>
          <div className="space-y-3">
            {reminders.slice(0, 3).map((reminder, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{reminder.source}</p>
                  <p className="text-sm text-gray-500">{reminder.loan_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 text-lg">₹{reminder.monthly_payment.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(reminder.next_payment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Loan Form Component
const LoanForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: '',
    loan_type: '',
    total_amount: '',
    tenure_months: '',
    monthly_payment: '',
    first_payment_date: ''
  });

  const calculateSuggestedPayment = () => {
    if (formData.total_amount && formData.tenure_months) {
      return (parseFloat(formData.total_amount) / parseInt(formData.tenure_months)).toFixed(2);
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      source: formData.source,
      loan_type: formData.loan_type,
      total_amount: parseFloat(formData.total_amount),
      tenure_months: parseInt(formData.tenure_months),
      monthly_payment: parseFloat(formData.monthly_payment),
      first_payment_date: formData.first_payment_date || null
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Loan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              placeholder="e.g., Bank of America"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.loan_type}
              onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
              placeholder="e.g., Personal Loan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.total_amount}
              onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (Months)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.tenure_months}
              onChange={(e) => setFormData({...formData, tenure_months: e.target.value})}
              placeholder="24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Payment (₹)
              {formData.total_amount && formData.tenure_months && (
                <span className="text-xs text-blue-600 ml-2">
                  (Suggested: ₹{calculateSuggestedPayment()})
                </span>
              )}
            </label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.monthly_payment}
              onChange={(e) => setFormData({...formData, monthly_payment: e.target.value})}
              placeholder="2083.33"
            />
            {formData.total_amount && formData.tenure_months && (
              <button
                type="button"
                onClick={() => setFormData({...formData, monthly_payment: calculateSuggestedPayment()})}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800"
              >
                Use suggested amount
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Payment Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.first_payment_date}
              onChange={(e) => setFormData({...formData, first_payment_date: e.target.value})}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Loan
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Payment Form Component
const PaymentForm = ({ loan, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      loan_id: loan.id,
      amount: parseFloat(amount),
      notes: notes.trim() || null
    });
  };

  const quickAmounts = [
    { label: 'Monthly EMI', amount: loan.monthly_payment },
    { label: 'Half EMI', amount: loan.monthly_payment / 2 },
    { label: 'Full Amount', amount: loan.remaining_amount }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Make Payment</h2>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Loan: {loan.source} - {loan.loan_type}</p>
          <p className="text-lg font-semibold text-gray-800">
            Remaining: ₹{loan.remaining_amount.toLocaleString()}
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Amount</label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quick, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setAmount(quick.amount.toString())}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              required
              min="0.01"
              max={loan.remaining_amount}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Payment amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment notes..."
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Make Payment
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Loans List Component
const LoansList = ({ loans, onPayment, onDelete }) => {
  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <FaCreditCard className="mx-auto text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No loans found</h3>
        <p className="text-gray-500">Add your first loan to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <div key={loan.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{loan.source}</h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full w-fit">
                  {loan.loan_type}
                </span>
                {loan.is_fully_paid && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full w-fit">
                    <FaCheckCircle className="inline mr-1" />
                    Paid
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-semibold">₹{loan.total_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Paid</p>
                  <p className="font-semibold text-green-600">₹{loan.paid_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className="font-semibold text-red-600">₹{loan.remaining_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Monthly EMI</p>
                  <p className="font-semibold">₹{loan.monthly_payment.toLocaleString()}</p>
                </div>
              </div>
              {!loan.is_fully_paid && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Next Payment: {new Date(loan.next_payment_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-row lg:flex-col gap-2">
              {!loan.is_fully_paid && (
                <button
                  onClick={() => onPayment(loan)}
                  className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <FaPaypal className="mr-1" />
                  <span className="hidden sm:inline">Pay</span>
                </button>
              )}
              <button
                onClick={() => onDelete(loan.id)}
                className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <FaTrash className="mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{((loan.paid_amount / loan.total_amount) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(loan.paid_amount / loan.total_amount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Reminders Component
const Reminders = ({ reminders }) => {
  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <FaBell className="mx-auto text-4xl text-gray-300 mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming payments</h3>
        <p className="text-gray-500">All caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <FaBell className="mr-2 text-yellow-500" />
        Payment Reminders
      </h2>
      {reminders.map((reminder) => (
        <div key={reminder.loan_id} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-gray-800">{reminder.source}</h4>
              <p className="text-sm text-gray-600">{reminder.loan_type}</p>
              <p className="text-lg font-bold text-yellow-600">
                ₹{reminder.monthly_payment.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-semibold">
                {new Date(reminder.next_payment_date).toLocaleDateString()}
              </p>
              <p className={`text-sm font-medium ${
                reminder.days_until_payment <= 3 ? 'text-red-600' : 
                reminder.days_until_payment <= 7 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {reminder.days_until_payment <= 0 ? 'Overdue!' : 
                 reminder.days_until_payment === 1 ? 'Due tomorrow' :
                 `${reminder.days_until_payment} days left`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Reminder Popup Component
const ReminderPopup = ({ reminders, onClose, onPayLoan }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-3 rounded-full mr-3 animate-pulse">
                <FaBell className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Payment Reminders</h2>
                <p className="text-amber-100 text-sm">You have {reminders.length} upcoming payment{reminders.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.loan_id}
                className={`bg-gradient-to-br ${
                  reminder.days_until_payment <= 3
                    ? 'from-red-50 to-rose-50 border-red-200'
                    : reminder.days_until_payment <= 7
                    ? 'from-amber-50 to-orange-50 border-amber-200'
                    : 'from-blue-50 to-indigo-50 border-blue-200'
                } border-2 rounded-xl p-4 shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{reminder.source}</h3>
                    <p className="text-sm text-gray-600">{reminder.loan_type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    reminder.days_until_payment <= 3
                      ? 'bg-red-500 text-white animate-pulse'
                      : reminder.days_until_payment <= 7
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {reminder.days_until_payment <= 0
                      ? 'OVERDUE!'
                      : reminder.days_until_payment === 1
                      ? 'DUE TOMORROW'
                      : `${reminder.days_until_payment} DAYS LEFT`}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{reminder.monthly_payment.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(reminder.next_payment_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onPayLoan(reminder);
                      onClose();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
                  >
                    <FaPaypal />
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <p className="text-sm text-gray-600">
            💡 Tip: Set up auto-pay to never miss a payment
          </p>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loans, setLoans] = useState([]);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [hasShownReminder, setHasShownReminder] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'loans'),
      where('userId', '==', user.uid),
      orderBy('created_date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoans(loansData);
    });

    return () => unsubscribe();
  }, [user]);

  // Show reminder popup when reminders are available
  useEffect(() => {
    if (user && loans.length > 0 && !hasShownReminder) {
      const reminders = calculateReminders();
      if (reminders.length > 0) {
        // Show popup after 2 seconds
        const timer = setTimeout(() => {
          setShowReminderPopup(true);
          setHasShownReminder(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, loans, hasShownReminder]);

  const calculateDashboardData = () => {
    const total_borrowed = loans.reduce((sum, loan) => sum + loan.total_amount, 0);
    const total_paid = loans.reduce((sum, loan) => sum + loan.paid_amount, 0);
    const total_remaining = loans.reduce((sum, loan) => sum + loan.remaining_amount, 0);
    const active_loans = loans.filter(loan => !loan.is_fully_paid).length;

    return { total_borrowed, total_paid, total_remaining, active_loans };
  };

  const calculateReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return loans
      .filter(loan => !loan.is_fully_paid)
      .map(loan => {
        const nextPayment = new Date(loan.next_payment_date);
        nextPayment.setHours(0, 0, 0, 0);
        const diffTime = nextPayment - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          loan_id: loan.id,
          source: loan.source,
          loan_type: loan.loan_type,
          monthly_payment: loan.monthly_payment,
          next_payment_date: loan.next_payment_date,
          days_until_payment: diffDays
        };
      })
      .filter(reminder => reminder.days_until_payment <= 7)
      .sort((a, b) => a.days_until_payment - b.days_until_payment);
  };

  const handleCreateLoan = async (loanData) => {
    try {
      const firstPaymentDate = loanData.first_payment_date || new Date().toISOString().split('T')[0];
      
      await addDoc(collection(db, 'loans'), {
        ...loanData,
        userId: user.uid,
        paid_amount: 0,
        remaining_amount: loanData.total_amount,
        is_fully_paid: false,
        created_date: serverTimestamp(),
        first_payment_date: firstPaymentDate,
        next_payment_date: firstPaymentDate
      });

      setShowLoanForm(false);
      showNotification('Loan added successfully!');
    } catch (error) {
      showNotification('Failed to create loan', 'error');
      console.error('Create loan error:', error);
    }
  };

  const handleMakePayment = async (paymentData) => {
    try {
      const loanRef = doc(db, 'loans', paymentData.loan_id);
      const loan = loans.find(l => l.id === paymentData.loan_id);
      
      const newPaidAmount = loan.paid_amount + paymentData.amount;
      const newRemainingAmount = loan.total_amount - newPaidAmount;
      const isFullyPaid = newRemainingAmount <= 0;

      // Calculate next payment date (add 30 days)
      const currentNextPayment = new Date(loan.next_payment_date);
      currentNextPayment.setDate(currentNextPayment.getDate() + 30);
      const nextPaymentDate = currentNextPayment.toISOString().split('T')[0];

      // Update loan
      await updateDoc(loanRef, {
        paid_amount: newPaidAmount,
        remaining_amount: Math.max(0, newRemainingAmount),
        is_fully_paid: isFullyPaid,
        next_payment_date: isFullyPaid ? loan.next_payment_date : nextPaymentDate
      });

      // Add payment record
      await addDoc(collection(db, 'payments'), {
        loan_id: paymentData.loan_id,
        userId: user.uid,
        amount: paymentData.amount,
        notes: paymentData.notes,
        payment_date: serverTimestamp()
      });

      setShowPaymentForm(false);
      setSelectedLoan(null);
      showNotification('Payment processed successfully!');
    } catch (error) {
      showNotification('Failed to process payment', 'error');
      console.error('Payment error:', error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteDoc(doc(db, 'loans', loanId));
        
        // Delete associated payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('loan_id', '==', loanId)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        paymentsSnapshot.forEach(async (paymentDoc) => {
          await deleteDoc(doc(db, 'payments', paymentDoc.id));
        });

        showNotification('Loan deleted successfully!');
      } catch (error) {
        showNotification('Failed to delete loan', 'error');
        console.error('Delete loan error:', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showNotification('Signed out successfully!');
    } catch (error) {
      showNotification('Failed to sign out', 'error');
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'loans', label: 'Loans', icon: <FaList /> },
    { id: 'reminders', label: 'Reminders', icon: <FaBell /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  const dashboardData = calculateDashboardData();
  const reminders = calculateReminders();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Loan Manager</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FaUser className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                currentView === item.id ? 'border-r-4 border-blue-500 bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
              {item.id === 'reminders' && reminders.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {reminders.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReminderPopup(true)}
              className="relative"
            >
              <FaBell className={`text-xl ${reminders.length > 0 ? 'text-amber-500 animate-pulse' : 'text-gray-400'}`} />
              {reminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center animate-bounce">
                  {reminders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowLoanForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              <span className="hidden sm:inline">Add Loan</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6">
          {currentView === 'dashboard' && (
            <Dashboard 
              dashboardData={dashboardData} 
              reminders={reminders}
            />
          )}
          {currentView === 'loans' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Your Loans</h1>
              <LoansList
                loans={loans}
                onPayment={(loan) => {
                  setSelectedLoan(loan);
                  setShowPaymentForm(true);
                }}
                onDelete={handleDeleteLoan}
              />
            </div>
          )}
          {currentView === 'reminders' && <Reminders reminders={reminders} />}
        </div>
      </div>

      {/* Modals */}
      {showLoanForm && (
        <LoanForm
          onSubmit={handleCreateLoan}
          onCancel={() => setShowLoanForm(false)}
        />
      )}

      {showPaymentForm && selectedLoan && (
        <PaymentForm
          loan={selectedLoan}
          onSubmit={handleMakePayment}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedLoan(null);
          }}
        />
      )}

      {/* Reminder Popup */}
      {showReminderPopup && reminders.length > 0 && (
        <ReminderPopup
          reminders={reminders}
          onClose={() => setShowReminderPopup(false)}
          onPayLoan={(reminder) => {
            const loan = loans.find(l => l.id === reminder.loan_id);
            if (loan) {
              setSelectedLoan(loan);
              setShowPaymentForm(true);
            }
          }}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;

<style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`}</style>