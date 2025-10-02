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
  FaDownload
} from 'react-icons/fa';
import Dashboard from './components/Dashboard';

const API_BASE_URL = 'http://localhost:8000';

// API Service
const apiService = {
  async fetchDashboard() {
    const response = await fetch(`${API_BASE_URL}/dashboard/`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  },

  async fetchLoans() {
    const response = await fetch(`${API_BASE_URL}/loans/`);
    if (!response.ok) throw new Error('Failed to fetch loans');
    return response.json();
  },

  async createLoan(loanData) {
    const response = await fetch(`${API_BASE_URL}/loans/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create loan: ${JSON.stringify(errorData)}`);
    }
    return response.json();
  },

  async makePayment(paymentData) {
    const response = await fetch(`${API_BASE_URL}/payments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error('Failed to make payment');
    return response.json();
  },

  async deleteLoan(loanId) {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete loan');
    return response.json();
  },

  async fetchReminders() {
    const response = await fetch(`${API_BASE_URL}/reminders/`);
    if (!response.ok) throw new Error('Failed to fetch reminders');
    return response.json();
  },

  async fetchLoanPayments(loanId) {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/payments`);
    if (!response.ok) throw new Error('Failed to fetch loan payments');
    return response.json();
  },

  async downloadExcelReport() {
    const response = await fetch(`${API_BASE_URL}/export/excel`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to download Excel report');
    
    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `loan_report_${dateStr}.xlsx`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

// Loan Form Component - FIXED
const LoanForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: '',
    loan_type: '',
    total_amount: '',
    tenure_months: '',
    monthly_payment: '', // Added this field
    first_payment_date: ''
  });

  // Helper function to calculate suggested monthly payment
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
      monthly_payment: parseFloat(formData.monthly_payment), // Include monthly_payment
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

// Loan Details Modal Component
const LoanDetailsModal = ({ loan, onClose }) => {
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        const paymentsData = await apiService.fetchLoanPayments(loan.id);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [loan.id]);

  const progressPercentage = (loan.paid_amount / loan.total_amount) * 100;
  const remainingMonths = Math.ceil(loan.remaining_amount / loan.monthly_payment);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{loan.source}</h2>
              <p className="text-blue-100">{loan.loan_type}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
          
          {/* Status Badge */}
          <div className="mt-4">
            {loan.is_fully_paid ? (
              <span className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                <FaCheckCircle className="mr-2" />
                Fully Paid
              </span>
            ) : (
              <span className="inline-flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                <FaExclamationTriangle className="mr-2" />
                Active
              </span>
            )}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Loan Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-gray-800">₹{loan.total_amount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-xl font-bold text-green-600">₹{loan.paid_amount.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-xl font-bold text-red-600">₹{loan.remaining_amount.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
              <p className="text-xl font-bold text-blue-600">₹{loan.monthly_payment.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tenure</p>
                  <p className="font-semibold">{loan.tenure_months} months</p>
                </div>
                {!loan.is_fully_paid && (
                  <div>
                    <p className="text-gray-600">Est. Remaining Months</p>
                    <p className="font-semibold">{remainingMonths} months</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Created Date</p>
                  <p className="font-semibold">{new Date(loan.created_date).toLocaleDateString()}</p>
                </div>
                {!loan.is_fully_paid && (
                  <div>
                    <p className="text-gray-600">Next Payment</p>
                    <p className="font-semibold">{new Date(loan.next_payment_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>
            
            {loadingPayments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading payments...</p>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</p>
                        {payment.notes && (
                          <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Payment #{payment.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCreditCard className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-600">No payments recorded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
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
        
        {/* Quick Amount Buttons */}
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
const LoansList = ({ loans, onPayment, onDelete, onViewDetails }) => {
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
              <button
                onClick={() => onViewDetails(loan)}
                className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FaEye className="mr-1" />
                <span className="hidden sm:inline">View</span>
              </button>
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
          {/* Progress Bar */}
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

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({});
  const [loans, setLoans] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, loansRes, remindersRes] = await Promise.all([
        apiService.fetchDashboard(),
        apiService.fetchLoans(),
        apiService.fetchReminders()
      ]);
      setDashboardData(dashboardRes);
      setLoans(loansRes);
      setReminders(remindersRes);
    } catch (error) {
      showNotification('Failed to load data', 'error');
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      await apiService.downloadExcelReport();
      showNotification('Excel report downloaded successfully!');
    } catch (error) {
      showNotification('Failed to download Excel report', 'error');
      console.error('Excel download error:', error);
    } finally {
      setDownloadingExcel(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateLoan = async (loanData) => {
    try {
      await apiService.createLoan(loanData);
      setShowLoanForm(false);
      showNotification('Loan added successfully!');
      loadData();
    } catch (error) {
      showNotification('Failed to create loan', 'error');
      console.error('Create loan error:', error);
    }
  };

  const handleMakePayment = async (paymentData) => {
    try {
      await apiService.makePayment(paymentData);
      setShowPaymentForm(false);
      setSelectedLoan(null);
      showNotification('Payment processed successfully!');
      loadData();
    } catch (error) {
      showNotification('Failed to process payment', 'error');
      console.error('Payment error:', error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await apiService.deleteLoan(loanId);
        showNotification('Loan deleted successfully!');
        loadData();
      } catch (error) {
        showNotification('Failed to delete loan', 'error');
        console.error('Delete loan error:', error);
      }
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
            <div className="relative">
              <FaBell className={`text-xl ${reminders.length > 0 ? 'text-yellow-500 animate-pulse' : 'text-gray-400'}`} />
              {reminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                  {reminders.length}
                </span>
              )}
            </div>
            <button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:bg-green-400"
            >
              <FaDownload className={`mr-2 ${downloadingExcel ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {downloadingExcel ? 'Downloading...' : 'Export Excel'}
              </span>
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
              onDownloadExcel={handleDownloadExcel}
              downloadingExcel={downloadingExcel}
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
                onViewDetails={(loan) => {
                  setSelectedLoan(loan);
                  setShowLoanDetails(true);
                }}
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

      {showLoanDetails && selectedLoan && (
        <LoanDetailsModal
          loan={selectedLoan}
          onClose={() => {
            setShowLoanDetails(false);
            setSelectedLoan(null);
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