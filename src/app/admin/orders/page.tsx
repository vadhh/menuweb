"use client";

import { useEffect, useState } from 'react';
import { IOrder, IOrderItem } from '@/lib/models/Order'; // Assuming IOrder and IOrderItem are exported
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Using your Button component
import { 
    FiLoader, 
    FiAlertCircle, 
    FiInbox, 
    FiEdit3, 
    FiTrash2, 
    FiCheckCircle,
    FiEye // For view details, if needed later
} from 'react-icons/fi';
import { ChevronLeft } from 'lucide-react';

// Define a more specific type for the order items when fetched with populated user
interface PopulatedOrderItem extends Omit<IOrderItem, 'productId'> {
  _id: string;
  productId: { _id: string; name: string; }; // Assuming Product model has a name
  name: string;
  quantity: number;
  price: number;
}

interface PopulatedOrder extends Omit<IOrder, 'items' | 'user' | 'status' | 'orderDate'> {
  _id: string;
  user?: { _id: string; email: string; name?: string };
  items: PopulatedOrderItem[];
  totalAmount: number;
  orderDate: string; // Dates will be strings after JSON serialization
  status: string;
  customerName?: string; // For guest orders
  customerEmail?: string; // For guest orders
}

// Helper for currency formatting
const formatCurrency = (amount: number, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Notification state type
type NotificationType = { message: string; type: 'success' | 'error' } | null;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationType>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        setNotification(null);
        try {
          const response = await fetch('/api/orders');
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
            throw new Error(errorData.message || `Error fetching orders: ${response.status}`);
          }
          const data: PopulatedOrder[] = await response.json();
          setOrders(data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())); // Sort newest first
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [status, router]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || `Error updating status: ${response.status}`);
      }
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      showNotification(`Order ${orderId.substring(0,6)}... status updated to ${newStatus}!`, 'success');
    } catch (err) {
      console.error('Error updating order status:', err);
      showNotification(`Failed: ${(err as Error).message}`, 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || `Error deleting order: ${response.status}`);
      }
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      showNotification(`Order ${orderId.substring(0,6)}... deleted successfully!`, 'success');
    } catch (err) {
      console.error('Error deleting order:', err);
      showNotification(`Failed to delete: ${(err as Error).message}`, 'error');
    }
  };

  if (status === 'loading' || (isLoading && status === 'authenticated')) {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-slate-50 text-slate-700 p-4">
            <FiLoader className="animate-spin text-4xl text-sky-600 mb-4" />
            <p className="text-lg">Loading Orders...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-red-50 text-red-700 p-6 text-center">
            <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Orders</h2>
            <p className="text-red-600/80">{error}</p>
            <Button variant="outline" onClick={() => router.push('/admin')} className="mt-6 border-red-500 text-red-500 hover:bg-red-500/10">
                Back to Admin
            </Button>
        </div>
    );
  }

  if (!session) {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-slate-50 text-slate-700 p-4">
            <p>Redirecting to login...</p>
        </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'bg-green-100 text-green-800 border-green-300';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50 min-h-screen">
      <div className="flex-row justify-between items-center mb-8">
        <Button 
            variant="outline" // Use your Button component's variants
            size="sm"       // Use your Button component's sizes
            onClick={() => router.back()}
            className="mb-6 flex items-center group text-sky-600 border-sky-600 hover:bg-sky-50"
            aria-label="Kembali"
        >
            <ChevronLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">Order Management</h1>
        {/* Add New Order button or filters could go here */}
      </div>

      {notification && (
        <div className={`p-4 mb-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`} role="alert">
          <span className="font-medium">{notification.type === 'success' ? 'Success!' : 'Error!'}</span> {notification.message}
        </div>
      )}

      {orders.length === 0 && !isLoading ? (
         <div className="text-center py-12 bg-white shadow-md rounded-lg">
            <FiInbox className="mx-auto text-6xl text-slate-400 mb-4" />
            <p className="text-xl text-slate-600 font-semibold">No orders found.</p>
            <p className="text-slate-500 mt-1">When new orders are placed, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 truncate" title={order._id}>{order._id.substring(order._id.length - 8)}</td>                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(order.orderDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {order.items.map((item, index) => (
                        <div key={item._id || index} className="truncate max-w-xs" title={`${item.name} (ID: ${item.productId?._id || 'N/A'})`}>
                          {item.quantity} x {item.name} ({formatCurrency(item.price)})
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-xs border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 rounded-md py-1.5 px-2 shadow-sm bg-white hover:border-slate-400"
                          aria-label={`Change status for order ${order._id.substring(order._id.length - 8)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 w-8 h-8"
                          title="Delete Order"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
