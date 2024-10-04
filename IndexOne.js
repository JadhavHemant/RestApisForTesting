// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/customerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define Counter Schema for Auto-Incrementing IDs
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, required: true }
});
const Counter = mongoose.model('Counter', counterSchema);

// Function to get the next sequence value for auto-incrementing IDs
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

/**
 * Customer Model and Routes
 */
// Define the Customer Schema
const customerSchema = new mongoose.Schema({
  cust_fName: { type: String, required: true },
  cust_lName: { type: String, required: true },
  cust_billingAddress: { type: String, required: true },
  product_Name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_Discount: { type: Number, required: true },
  product_info: { type: String },
  id: { type: Number, unique: true, required: true },
  mobile_number: { type: Number, required: true },
});
const Customer = mongoose.model('Customer', customerSchema);

// Create a new customer with auto-incrementing ID
app.post('/api/customers', async (req, res) => {
  try {
    const newId = await getNextSequenceValue('customerId');
    const customer = new Customer({ ...req.body, id: newId });
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// CRUD routes for customers...
// (same as in the previous implementation)

/**
 * User Model and Routes
 */
// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: Number, unique: true, required: true },
});
const User = mongoose.model('User', userSchema);

// Create a new user with auto-incrementing ID
app.post('/api/users', async (req, res) => {
  try {
    const newId = await getNextSequenceValue('userId');
    const user = new User({ ...req.body, id: newId });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Product Model and Routes
 */
// Define the Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  id: { type: Number, unique: true, required: true },
});
const Product = mongoose.model('Product', productSchema);

// Create a new product with auto-incrementing ID
app.post('/api/products', async (req, res) => {
  try {
    const newId = await getNextSequenceValue('productId');
    const product = new Product({ ...req.body, id: newId });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).send({ message: 'Product not found' });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).send({ message: 'Product not found' });
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).send({ message: 'Product not found' });
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
