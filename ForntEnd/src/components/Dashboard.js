import React, { useState, useEffect } from 'react';  
import { Button, TextField, Typography, Alert, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,Divider,List,ListItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', quantity: 0 });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const [isInvoiceVisibleEdit, setIsInvoiceVisibleEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [editItem, setEditItem] = useState({ name: '', price: '', description: '' });
  const [user, setUser] = useState(null);  // Store user data here
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch items from the API
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        if (response.data && response.data.length > 0) {
          setItems(response.data); // Update the items with the fetched data
        } else {
          const dummyData = [
            { _id: '1', name: 'Paracetamol', price: 5, description: 'Pain reliever and fever reducer' },
            { _id: '2', name: 'Ibuprofen', price: 7, description: 'Anti-inflammatory drug used to reduce fever, pain, and inflammation' },
            { _id: '3', name: 'Aspirin', price: 3, description: 'Painkiller used for reducing pain, fever, and inflammation' },
            { _id: '4', name: 'Amoxicillin', price: 10, description: 'Antibiotic used to treat bacterial infections' },
            { _id: '5', name: 'Cetirizine', price: 4, description: 'Antihistamine used to relieve allergy symptoms like runny nose and sneezing' },
          ];
          setItems(dummyData); // Fallback to dummy data if API call fails
        }
      } catch (error) {
        console.error("Error fetching items from database:", error.message);
        const dummyData = [
          { _id: '1', name: 'Paracetamol', price: 5, description: 'Pain reliever and fever reducer' },
          { _id: '2', name: 'Ibuprofen', price: 7, description: 'Anti-inflammatory drug used to reduce fever, pain, and inflammation' },
          { _id: '3', name: 'Aspirin', price: 3, description: 'Painkiller used for reducing pain, fever, and inflammation' },
          { _id: '4', name: 'Amoxicillin', price: 10, description: 'Antibiotic used to treat bacterial infections' },
          { _id: '5', name: 'Cetirizine', price: 4, description: 'Antihistamine used to relieve allergy symptoms like runny nose and sneezing' },
        ];
        setItems(dummyData); // Set dummy data on error
      }
    };
  
    // Fetch user data from localStorage
    const fetchUserData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));  // Parse and store user data from localStorage
      } else {
        navigate('/');  // Redirect to login if no user data found
      }
    };
  
    // Call the functions to fetch data when the component mounts
    fetchUserData();
    fetchItems();
  }, [navigate]); // The empty array ensures this effect only runs once when the component mounts
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = items.filter(item => item.name.toLowerCase().startsWith(searchQuery.toLowerCase()));

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortOption === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortOption === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    if (sortOption === 'price-asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortOption === 'price-desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    return 0;
  });

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const toggleSelectItem = (itemId) => {
    const selectedItem = items.find(item => item._id === itemId);
    if (selectedItems.includes(selectedItem)) {
      setSelectedItems(selectedItems.filter(item => item._id !== itemId));
    } else {
      setSelectedItems([...selectedItems, selectedItem]);
    }
  };

  const calculateTotal = (updatedItems) => {
    const totalAmount = updatedItems.reduce((acc, item) => acc + item.price, 0);
    setTotal(totalAmount);
  };
  

  const handleRemoveItemDB = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      setSelectedItems(selectedItems.filter(item => item._id !== itemId));
      calculateTotal(selectedItems);
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
 
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/items', newItem);
      setItems([...items, response.data]);
      setNewItem({ name: '', price: '', description: '', quantity: 0 });
      setSuccess('Item added successfully!');
      setOpenDialog(false); // Close the dialog after adding item
    } catch (error) {
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(sortedItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBuyItems = () => {
    const itemsWithOriginalPrice = selectedItems.map(item => ({
      ...item,
      originalPrice: parseFloat(item.price), // Store the original price for later use
      quantity: 1, // Default quantity
    }));
    setInvoiceItems(itemsWithOriginalPrice);
    calculateTotal(itemsWithOriginalPrice);
    setIsInvoiceVisible(true);
  };

  const handleCheckout = async () => {
    setLoading(true);  // Optionally set loading state to show progress
  
    // Prepare the data to send in the checkout request
    const checkoutData = {
      userId: user._id,  // Ensure that the user is logged in and has an ID
      invoiceNumber: Math.floor(Math.random() * 1000000),
      items: invoiceItems.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: total,  // Send the total amount for the checkout
      date: moment().format("MMMM Do YYYY, h:mm:ss a"),  // Current date and time
    };
  
    try {
      // Send checkout data to the backend
       await axios.post('http://localhost:5000/api/checkout', checkoutData);
  
      // After the order is placed, update the medicine quantities in the database
      // await updateQuantitiesInDatabase();
  
      setLoading(false);
      alert('Order placed successfully');
      closeInvoice();
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('There was an error placing your order');
    }
  };
  
  // Helper function to update quantities of items in the database
  // const updateQuantitiesInDatabase = async () => {
  //   try {
  //     // Loop through each item in the invoice and update its quantity in the database
  //     for (const item of invoiceItems) {
  //       const updatedQuantity = item.originalQuantity - item.quantity;  // Decrease quantity by the ordered amount
  //       await axios.put(`http://localhost:5000/items/${item._id}`, { quantity: updatedQuantity });
  //     }
  //   } catch (error) {
  //     console.error("Error updating quantities:", error.message);
  //     alert("There was an error updating quantities in the database.");
  //   }
  // };
  const closeInvoice = () => {
    setIsInvoiceVisible(false);
    setSelectedItems([]);
  };

  const closeEdit = () => {
    setIsInvoiceVisibleEdit(false);
  }

  // const handleCheckout = () => {
  //   alert('Checkout Successful');
  //   closeInvoice();
  // };

  // Edit Item Handlers
  const handleEditItem = (item) => {
    setIsInvoiceVisibleEdit(true);
    setEditItem(item);
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`http://localhost:5000/items/${editItem._id}`, editItem);
      setItems(items.map(item => (item._id === editItem._id ? editItem : item)));
      setEditItem(null);  // Close the edit form after updating
    } catch (error) {
      console.error("Error updating item:", error.message);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    const updatedItems = invoiceItems.map(item => {
      if (item._id === itemId) {
        let updatedQuantity = item.quantity + change;
        updatedQuantity = updatedQuantity < 1 ? 1 : updatedQuantity; // Prevent quantity from going below 1
        const updatedPrice = item.originalPrice * updatedQuantity;
        return { ...item, quantity: updatedQuantity, price: updatedPrice };
      }
      return item;
    });
    setInvoiceItems(updatedItems);
    calculateTotal(updatedItems);  // Recalculate the total after quantity change
  };


  return (
    <div className="container mt-5">

    <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={handleAddItem}>
            <TextField
              label="Item Name"
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              required
              margin="normal"
            />
              {/* <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
              required
              margin="normal"
              /> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleAddItem}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search and Sort Controls */}
      <div className="d-flex justify-content-between mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="name-asc">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
          <option value="price-asc">Sort by Price (Low-High)</option>
          <option value="price-desc">Sort by Price (High-Low)</option>
        </select>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add Item
        </Button>
      </div>

      {/* Items List */}
      <div className="card p-4 mb-4" >
        <h3 className="card-title m-auto">Medicine List</h3>
        {currentItems.length === 0 ? (
          <p>No items available.</p>
        ) : (
          currentItems.map((item) => (
            <ol>
            <div key={item._id} className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <input type="checkbox" checked={selectedItems.includes(item)} onChange={() => toggleSelectItem(item._id)} className="me-2" />
                <strong>{item.name}</strong> - ${item.price.toFixed(2)}
                <p className='m-3'>{item.description}</p>
                {/* <p className='m-3'>{item.quantity}</p> */}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEditItem(item)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItemDB(item._id)}>Remove</button>
              </div>
            </div>
            </ol>
          ))
        )}

        {selectedItems.length > 0 && (
          <button className="btn btn-success mt-3" onClick={handleBuyItems}>
            Buy Selected Items
          </button>
        )}
      </div>

    {/* <div className="card p-4 mb-4">
      <h3 className="card-title m-auto">Medicine List</h3>
      {currentItems.length === 0 ? (
        <p>No items available.</p>
      ) : (
        currentItems.map((item) => (
          <ol key={item._id}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <strong>{item.name}</strong> - ₹{item.price}
                <p className="m-3">{item.description}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEditItem(item)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItemDB(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          </ol>
        ))
      )}

      <div className="mt-3">
        <strong>Total Price: ₹{currentItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</strong>
      </div>

      {currentItems.length > 0 && (
        <button className="btn btn-success mt-3" onClick={handleBuyItems}>
          Buy All Items
        </button>
      )}
    </div> */}


      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span className="align-self-center">Page {currentPage} of {Math.ceil(sortedItems.length / itemsPerPage)}</span>
        <button className="btn btn-secondary" onClick={nextPage} disabled={currentPage === Math.ceil(sortedItems.length / itemsPerPage)}>Next</button>
      </div>

      {isInvoiceVisibleEdit && (
        <div className="modal show d-flex justify-content-center align-items-center" >
          <div className="card p-4 m-4">
            <h3>Edit Item</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={(e) => {  handleUpdateItem(); }} className="d-flex flex-column gap-3 m-auto">
              <input
                type="text"
                value={editItem ? editItem.name : ''}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                className="form-control"
                placeholder="Name"
              />
              <input
                type="number"
                value={editItem.price}
                onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                className="form-control"
                placeholder="Price"
              />
              <input
                type="text"
                value={editItem.description}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                className="form-control"
                placeholder="Description"
              />
{/*               
              <input
                type="number"
                value={editItem.quantity}
                onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                className="form-control"
                placeholder="Quantity"
              /> */}
              
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={closeEdit}>Close</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm" /> : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Invoice Modal */}
      {/* {isInvoiceVisible && (
        <div className="modal show m-auto" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>   
          <Dialog open={isInvoiceVisible} onClose={() => setIsInvoiceVisible(false)} fullWidth>
            <DialogTitle>
              <Typography variant="h5" align="center">Invoice</Typography>
            </DialogTitle>
            
            <DialogContent>
              {user && (
                <div className="mb-3">
                  <Typography variant="h6">User Information</Typography>
                  <Typography><strong>Name:</strong> {user.username}</Typography>
                  <Typography><strong>Email:</strong> {user.email}</Typography>
                  <Typography><strong>Phone Number:</strong> {user.phone}</Typography>
                </div>
              )}
              
              <Divider />
              
              <Typography variant="h6" className="mt-3">Medicine Details</Typography>
              <List>
                {invoiceItems.map((item) => (
                  <ListItem key={item._id} secondaryAction={
                    <div>
                      <Button size="small" onClick={() => handleQuantityChange(item._id, -1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size="small" onClick={() => handleQuantityChange(item._id, 1)}>+</Button>
                    </div>
                  }>
                    <ListItemText primary={`${item.name} - $${item.price}  - $${item.price.toFixed(2)}`} />
                  </ListItem>
                ))}
              </List>

              <Divider />

              <div className="d-flex justify-content-between mt-3">
                <Typography variant="h6"><strong>Total:</strong></Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </div>
            </DialogContent>

            <DialogActions className='d-flex justify-content-center align-items-center mb-4'>
              <Button onClick={() => setIsInvoiceVisible(false)} color="secondary">
                Close
              </Button>
              <Button onClick={() => { alert('Checkout Successful'); downloadInvoice()  }} color="primary" variant="contained">
                Checkout
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )} */}
      {isInvoiceVisible && (
  <div className="modal show m-auto" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
    <Dialog open={isInvoiceVisible} onClose={() => setIsInvoiceVisible(false)} fullWidth>
      <DialogTitle>
        <Typography variant="h5" align="center">Invoice</Typography>
      </DialogTitle>

      <DialogContent>
        {user && (
          <div className="mb-3">
            <Typography variant="h6">User Information</Typography>
            <Typography><strong>Name:</strong> {user.username}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Phone Number:</strong> {user.phone}</Typography>
          </div>
        )}

        <Divider />

        <Typography variant="h6" className="mt-3">Medicine Details</Typography>
        <List>
          {invoiceItems.map((item) => (
            <ListItem key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Left side: Item name and original price */}
              <div style={{ flex: 1 }}>
                <Typography variant="body1"><strong>{item.name}</strong></Typography>
                <Typography variant="body2">${item.originalPrice.toFixed(2)}</Typography>
              </div>

              {/* Center: Quantity change buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button size="small" onClick={() => handleQuantityChange(item._id, -1)}>-</Button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <Button size="small" onClick={() => handleQuantityChange(item._id, 1)}>+</Button>
              </div>

              {/* Right side: Item total price */}
              <div>
                <Typography variant="body1">${item.price.toFixed(2)}</Typography>
              </div>
            </ListItem>
          ))}
        </List>

        <Divider />

        <div className="d-flex justify-content-between mt-3">
          <Typography variant="h6"><strong>Total:</strong></Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </div>
      </DialogContent>

      <DialogActions className='d-flex justify-content-center align-items-center mb-4'>
        <Button onClick={() => setIsInvoiceVisible(false)} color="secondary">
          Close
        </Button>
        <Button onClick={handleCheckout} color="primary" variant="contained">
            {loading ? <CircularProgress size={24} /> : 'Checkout'}
        </Button>
      </DialogActions>
    </Dialog>
  </div>
)}

    </div>
  );
};

export default Dashboard;
