import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {

  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try{
        setLoading(true);
        console.log('Fetching orders...'); // Debug log
        const { data } = await axios.get('/api/order/seller');
        console.log('Response data:', data); // Debug log
        
        if(data.success){
            console.log('Orders received:', data.orders); // Debug log
            // Add detailed logging for each order
            data.orders.forEach((order, index) => {
                console.log(`Order ${index}:`, {
                    id: order._id,
                    amount: order.amount,
                    totalAmount: order.totalAmount,
                    price: order.price,
                    total: order.total,
                    fullOrder: order
                });
            });
            setOrders(data.orders);
        }else{
            console.log('Error:', data.message); // Debug log
            toast.error(data.message);
        }
    }catch(error){
        console.log('Fetch error:', error); // Debug log
        toast.error(error.message);
    }finally{
        setLoading(false);
    }
  };

  // Calculate total amount using offer price when available
  const calculateOrderTotal = (order) => {
    if (order.amount && order.amount > 0) {
      return order.amount;
    }
    
    // Try alternative field names
    if (order.totalAmount && order.totalAmount > 0) {
      return order.totalAmount;
    }
    
    if (order.total && order.total > 0) {
      return order.total;
    }
    
    // Calculate from items if available
    if (order.items && order.items.length > 0) {
      return order.items.reduce((total, item) => {
        // Priority: use offer price if available, then regular price
        const itemPrice = item.offerPrice || 
                         item.product?.offerPrice || 
                         item.discountedPrice ||
                         item.product?.discountedPrice ||
                         item.salePrice ||
                         item.product?.salePrice ||
                         item.price || 
                         item.product?.price || 0;
        
        const itemQuantity = item.quantity || 1;
        return total + (itemPrice * itemQuantity);
      }, 0);
    }
    
    return 0;
  };

  useEffect(() => {
    fetchOrders();
  },[])

  if (loading) {
    return (
      <div className='flex-1 h-[95vh] flex items-center justify-center'>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll' >
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            
            {/* Debug info */}
            <p className="text-sm text-gray-500">Total orders: {orders.length}</p>
            
            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                orders.map((order, index) => {
                    const orderTotal = calculateOrderTotal(order);
                    
                    return (
                        <div key={order._id || index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
                            <div className="flex gap-5 max-w-80">
                                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                                <div>
                                    {order.items && order.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex flex-col">
                                            <p className="font-medium">
                                                {item.product?.name || item.name || 'Product name not available'}
                                                <span className="text-primary" > x {item.quantity}</span>
                                            </p>
                                            {/* Debug: Show item prices */}
                                            <p className="text-xs text-gray-400">
                                                Offer: {currency}{item.offerPrice || item.product?.offerPrice || 'N/A'} | 
                                                Original: {currency}{item.price || item.product?.price || 'N/A'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm md:text-base text-black/60">
                                {order.address ? (
                                    <>
                                        <p className='text-black/80'>
                                            {order.address.firstName || ''} {order.address.lastName || ''}
                                        </p>
                                        <p>{order.address.street || ''}, {order.address.city || ''}</p> 
                                        <p>{order.address.state || ''}, {order.address.zipcode || ''}, {order.address.country || ''}</p>
                                        <p>{order.address.phone || ''}</p>
                                    </>
                                ) : (
                                    <p className="text-red-500">Address not available</p>
                                )}
                            </div>

                            <div className="font-medium text-lg my-auto">
                                <p className={orderTotal > 0 ? "text-green-600" : "text-red-500"}>
                                    {currency}{orderTotal.toFixed(2)}
                                </p>
                                {/* Debug info */}
                                <p className="text-xs text-gray-400">
                                    Raw: {order.amount || 'null'}
                                </p>
                            </div>

                            <div className="flex flex-col text-sm md:text-base text-black/60">
                                <p>Method: {order.paymentType || order.paymentMethod || 'N/A'}</p>
                                <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}</p>
                                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    </div>
  );
}

export default Orders