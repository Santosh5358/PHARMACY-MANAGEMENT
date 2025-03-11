const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/User');  // User model
const Item = require('./models/Item');  // Item model// Import authentication middleware
const Order = require('./models/Order');
const Contact = require('./models/Contact');
const { jsPDF } = require('jspdf');
const moment = require('moment');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/billing-app', { useNewUrlParser: true, useUnifiedTopology: true });

// User Registration Route
app.post('/register', async (req, res) => {
  const { username, email,age, password,phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email,age, password: hashedPassword,phone });
  await newUser.save();
  res.json({ message: 'User registered successfully' });
});

// User Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token,user});
});



// CRUD Operations for Items
app.post('/items', async (req, res) => {
  const { name, price,description,quantity } = req.body;
  const newItem = new Item({ name, price,description,quantity });
  await newItem.save();
  res.json(newItem);
});


app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, quantity } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(id, { name, price, description, quantity }, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

// Billing API (Calculating Total)
app.post('/bill', async (req, res) => {
  const { items } = req.body;
  let total = 0;
  for (let itemId of items) {
    const item = await Item.findById(itemId);
    total += item.price;
  }
  res.json({ total });
});

app.post('/contact-us', async (req, res) => {
  const { name, email, phone, problem } = req.body;

  try {
    // Validation
    if (!name || !email || !phone || !problem) {
      return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    // Create a new contact entry in the database
    const newContact = new Contact({ name, email, phone, problem });
    await newContact.save();

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'There was an error. Please try again.' });
  }
});

app.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword, userId } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found!' });
    }

    // Compare the old password with the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect!' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
});

// Route to get user profile
app.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile data' });
  }
});

app.put('/update-phone/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Get user ID from URL
    const { phone } = req.body; // Get new phone number from request body

    // Find the user by ID and update the phone number
    const user = await User.findByIdAndUpdate(id, { phone }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Phone number updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// app.post('/api/checkout', async (req, res) => {
//   const { userId,invoiceNumber, items, totalPrice, date } = req.body;
  
//   try {
//     // Logic for processing the checkout, e.g., saving the order to the database
//     const order = new Order({
//       userId,
//       invoiceNumber,
//       items,
//       totalPrice,
//       date,
//       status: 'Pending', // Example order status
//     });

//     await order.save();
//     res.status(200).json({ message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error processing order:', error);
//     res.status(500).json({ message: 'There was an error placing your order' });
//   }
// });

app.get('/checkout/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch checkout details by user_id
    const checkoutDetails = await Order.find({ userId: userId });

    if (!checkoutDetails || checkoutDetails.length === 0) {
      return res.status(404).json({ message: 'Checkout details not found for this user.' });
    }

    // Send checkout details back as a response
    res.json(checkoutDetails);
  } catch (error) {
    console.error('Error fetching checkout details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { userId, invoiceNumber, items, totalPrice, date } = req.body;

  try {
    // Create a new checkout entry in the database
    const newCheckout = new Order({
      userId,
      invoiceNumber,
      items, // Assuming the `items` array passed contains details like { id, quantity }
      totalPrice,
      date
    });

    // Save checkout record to the database
    await newCheckout.save();

    // Send response that checkout was successful
    res.status(200).json({ message: 'Checkout successful' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error processing checkout', error });
  }
});



app.get('/invoice/:invoiceNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ invoiceNumber: req.params.invoiceNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Medical Store", 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text("123 Pharmacy Lane, City, Country", 105, 30, null, null, 'center');
    doc.text("(123) 456-7890", 105, 35, null, null, 'center');
    doc.text(`Invoice Number: ${order.invoiceNumber}`, 105, 45, null, null, 'center');
    doc.text(`Date: ${moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, 105, 50, null, null, 'center');

    // Customer information (You can include user details from the User model)
    doc.setFontSize(12);
    doc.text("Customer Name: John Doe", 20, 65);
    doc.text("Customer Email: johndoe@example.com", 20, 75);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    // Table headers (item name, quantity, price, total price)
    doc.setFontSize(12);
    doc.text("Item", 20, 100);
    doc.text("Qty", 100, 100);
    doc.text("Price", 140, 100);
    doc.text("Total", 180, 100);

    // Items list
    let yOffset = 110;
    order.items.forEach(item => {
      doc.text(item.name, 20, yOffset);
      doc.text(item.quantity.toString(), 100, yOffset);
      doc.text(`$${item.originalPrice.toFixed(2)}`, 140, yOffset);
      doc.text(`$${item.price.toFixed(2)}`, 180, yOffset);
      yOffset += 10;
    });

    // Line separator for the footer
    doc.setLineWidth(0.5);
    doc.line(20, yOffset + 5, 190, yOffset + 5);

    // Total Amount
    doc.setFontSize(14);
    doc.text(`Total Amount: $${order.totalPrice.toFixed(2)}`, 105, yOffset + 15, null, null, 'center');

    // Footer message
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 105, yOffset + 30, null, null, 'center');

    // Save the document (download the invoice)
    const fileName = `Invoice_${order.invoiceNumber}.pdf`;
    const buffer = doc.output('arraybuffer'); // Convert PDF to a buffer
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
