import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref:'user'},
    items: [{
        product: {type: String, required: true,ref: 'product'},
        quantity: {type: Number, required: true}
    }],
    quantity: {type: Number, required: false},
    address: {type: String, required: true, ref: 'address'},
    status: {type: String, default: 'Order Placed'},
    paymentType: {type: String, required: true},
    isPaid: {type: Boolean, required: true ,default: false},
},{timestamps: true});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema); // Fixed: was 'moongoose'

export default Order;