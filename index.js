
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const ports = [5000, 5001,5002,5003,5004,5005];

const mongoURI = 'mongodb+srv://jadhavhemantbalkrushna:sPPL0UNSyDMxtH8X@hemant.9wuh4.mongodb.net/?retryWrites=true&w=majority&appName=Hemant';

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const CounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    required: true
  }
});

const Counter = mongoose.model('Counter', CounterSchema);

const getNextSequenceValue = async (sequenceName) => {
  const counter = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const ItemSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: String,
});

const Item = mongoose.model('Item', ItemSchema);

app.post('/api/items', async (req, res) => {
  const { name, quantity, description } = req.body;
  try {
    const nextId = await getNextSequenceValue('itemId'); // Get the next id
    const newItem = new Item({ _id: nextId, name, quantity, description });
    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const EmployeeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
});

const Employee = mongoose.model('Employee', EmployeeSchema);


app.post('/api/employees', async (req, res) => {
  const { firstName, lastname, address, mobileNumber, gender } = req.body;
  try {
    const nextId = await getNextSequenceValue('employeeId');
    const newEmployee = new Employee({ id: nextId, firstName, lastname, address, mobileNumber, gender });
    const employee = await newEmployee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ id: req.params.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const ProductSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  brand: String,
  modelNumber: String,
  price: Number,
  description: String,
  category: String,
  stockQuantity: Number,
  manufacturer: String,
  weight: String,
  dimensions: String,
  color: String,
  size: String,
  material: String,
  warranty: String,
  releaseDate: Date,
  rating: Number,
  reviews: [{
    user: String,
    comment: String,
    rating: Number
  }], // Array of reviews
  sku: String,
  upc: String,
  shippingWeight: String,
  shippingDimensions: String,
  batteryIncluded: Boolean,
  batteryRequired: Boolean,
  voltage: String,
  powerSource: String,
  compatibleDevices: [String], // Array of strings
  connectivity: [String], // Array of strings
  operatingSystem: String,
  processorType: String,
  ram: String,
  storageCapacity: String,
  displaySize: String,
  resolution: String,
  camera: String,
  videoQuality: String,
  audioFeatures: String,
  ports: [String], // Array of strings
  wirelessTechnology: [String], // Array of strings
  bluetoothVersion: String,
  waterResistance: String,
  dustResistance: String,
  temperatureRange: String,
  humidityResistance: String,
  warrantyPeriod: String,
  includedAccessories: [String], // Array of strings
  userManual: String,
  installationRequired: Boolean,
  assemblyTime: String,
  ecoFriendly: Boolean,
  recyclable: Boolean,
  certifications: [String], // Array of strings
  originCountry: String,
  seller: String,
  shippingMethods: [String], // Array of strings
  returnPolicy: String,
  packagingType: String,
  giftWrapAvailable: Boolean,
  promotionalOffers: [String], // Array of strings
  saleEndDate: Date,
  bulkDiscount: Boolean,
  minOrderQuantity: Number,
  maxOrderQuantity: Number,
  supplier: String,
  importDuty: Number,
  tariffCode: String,
  leadTime: String,
  handlingTime: String,
  productType: String,
  style: String,
  pattern: String,
  audience: String,
  ageGroup: String,
  gender: String,
  season: String,
  theme: String,
  event: String,
  occasion: String,
  careInstructions: String,
  allergens: String,
  sustainabilityRating: String,
  ethicalSourcing: Boolean,
  fairTradeCertified: Boolean,
  crueltyFree: Boolean,
  organic: Boolean,
  recyclableMaterials: Boolean,
  energyStarCertified: Boolean,
  madeIn: String,
  productLine: String,
  series: String,
  limitedEdition: Boolean,
  launchDate: Date,
  discontinued: Boolean,
  ratingSystem: String,
  userFeedback: [{
    user: String,
    feedback: String,
    rating: Number
  }], // Array of user feedback
  availableColors: [String], // Array of strings
  availableSizes: [String], // Array of strings
  specialFeatures: [String], // Array of strings
  customizations: [String], // Array of strings
  returnEligible: Boolean,
  shippingTime: String
});

const Product = mongoose.model('Product', ProductSchema);


app.post('/api/products', async (req, res) => {
  const {
    productName, brand, modelNumber, price, description, category, stockQuantity, manufacturer,
    weight, dimensions, color, size, material, warranty, releaseDate, rating, reviews, sku, upc,
    shippingWeight, shippingDimensions, batteryIncluded, batteryRequired, voltage, powerSource,
    compatibleDevices, connectivity, operatingSystem, processorType, ram, storageCapacity,
    displaySize, resolution, camera, videoQuality, audioFeatures, ports, wirelessTechnology,
    bluetoothVersion, waterResistance, dustResistance, temperatureRange, humidityResistance,
    warrantyPeriod, includedAccessories, userManual, installationRequired,
    assemblyTime, ecoFriendly, recyclable, certifications, originCountry, seller, shippingMethods,
    returnPolicy, packagingType, giftWrapAvailable, promotionalOffers, saleEndDate, bulkDiscount,
    minOrderQuantity, maxOrderQuantity, supplier, importDuty, tariffCode, leadTime, handlingTime,
    productType, style, pattern, audience, ageGroup, gender, season, theme, event, occasion,
    careInstructions, certification, allergens, sustainabilityRating, ethicalSourcing,
    fairTradeCertified, crueltyFree, organic, recyclableMaterials, energyStarCertified, madeIn,
    productLine, series, limitedEdition, launchDate, discontinued, ratingSystem, userFeedback,
    availableColors, availableSizes, specialFeatures, customizations, returnEligible, shippingTime
  } = req.body;

  try {
    const nextId = await getNextSequenceValue('productId'); // Auto-incremented ID

    const newProduct = new Product({
      _id: nextId,
      productName, brand, modelNumber, price, description, category, stockQuantity, manufacturer,
      weight, dimensions, color, size, material, warranty, releaseDate, rating, reviews, sku, upc,
      shippingWeight, shippingDimensions, batteryIncluded, batteryRequired, voltage, powerSource,
      compatibleDevices, connectivity, operatingSystem, processorType, ram, storageCapacity,
      displaySize, resolution, camera, videoQuality, audioFeatures, ports, wirelessTechnology,
      bluetoothVersion, waterResistance, dustResistance, temperatureRange, humidityResistance,
      warrantyPeriod, includedAccessories, userManual, installationRequired, assemblyTime, ecoFriendly,
      recyclable, certifications, originCountry, seller, shippingMethods, returnPolicy, packagingType,
      giftWrapAvailable, promotionalOffers, saleEndDate, bulkDiscount, minOrderQuantity, maxOrderQuantity,
      supplier, importDuty, tariffCode, leadTime, handlingTime, productType, style, pattern, audience,
      ageGroup, gender, season, theme, event, occasion, careInstructions, certification, allergens,
      sustainabilityRating, ethicalSourcing, fairTradeCertified, crueltyFree, organic, recyclableMaterials,
      energyStarCertified, madeIn, productLine, series, limitedEdition, launchDate, discontinued, ratingSystem,
      userFeedback, availableColors, availableSizes, specialFeatures, customizations, returnEligible, shippingTime
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// User API routes
app.post('/api/users', async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  try {
    const newUser = new User({ username, password, email, firstName, lastName });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customers Schema
const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model('Customer', CustomerSchema);

// Customers API routes
app.post('/api/customers', async (req, res) => {
  const { fullName, email, phone, gender, product_price, city, pincode, state, country } = req.body;

  try {
    const newCustomer = new Customer({ fullName, email, phone, gender, product_price, city, pincode, state, country });
    const customer = await newCustomer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Function to start the server on each port
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Start servers on multiple ports
ports.forEach(port => startServer(port));