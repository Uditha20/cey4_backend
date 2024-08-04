import mongoose from 'mongoose';



const deliverySchema = new mongoose.Schema({
  cost: {
    type: Number,
    required: true
  }
});

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;