const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/products', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Product Schema
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean,
  category: String,
});

const Product = mongoose.model('Product', ProductSchema);

// API to initialize the database with seed data
app.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;

    // Insert the fetched data into the MongoDB database
    await Product.insertMany(products);
    res.send('Database initialized');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error initializing database');
  }
});

// API to list all transactions with search and pagination
app.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  const query = {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: search } },
    ]
  };

  try {
    const total = await Product.countDocuments(query);
    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.json({ total, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching transactions');
  }
});

// API to get statistics for a selected month
app.get('/statistics', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthNumber = monthMap[month];
  if (!monthNumber) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    const totalSold = await Product.countDocuments({ sold: true, $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } });
    const totalNotSold = await Product.countDocuments({ sold: false, $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } });
    const totalSalesAmount = await Product.aggregate([
      { $match: { sold: true, $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    res.json({ 
      totalSalesAmount: totalSalesAmount[0]?.total || 0, 
      totalSold, 
      totalNotSold 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching statistics');
  }
});

// API for Bar Chart Data
app.get('/price-chart', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthNumber = monthMap[month];
  if (!monthNumber) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const ranges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  try {
    const data = await Promise.all(
      ranges.map(async (r) => {
        const count = await Product.countDocuments({
          price: { $gte: r.min, $lte: r.max },
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
        });
        return { range: r.range, count };
      })
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching price chart data');
  }
});

// API for Pie Chart Data
app.get('/category-chart', async (req, res) => {
  const { month } = req.query;
  console.log('Received month:', month); // Log received month parameter

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthNumber = monthMap[month];
  if (!monthNumber) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    const data = await Product.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching category chart data');
  }
});

// API to fetch combined data from statistics, bar chart, and pie chart
app.get('/combined', async (req, res) => {
  const { month } = req.query;
  console.log('Received month:', month);
  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthNumber = monthMap[month];
  if (!monthNumber) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    // Fetch transactions
    const transactions = await Product.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }
    });

    // Fetch statistics
    const statistics = await Product.aggregate([
      { $match: { sold: true, $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    // Fetch bar chart data
    const barChart = await Product.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      {
        $group: {
          _id: {
            $cond: [
              { $lt: ["$price", 100] }, "0-100",
              { $cond: [
                { $lt: ["$price", 200] }, "101-200",
                { $cond: [
                  { $lt: ["$price", 300] }, "201-300",
                  { $cond: [
                    { $lt: ["$price", 400] }, "301-400",
                    { $cond: [
                      { $lt: ["$price", 500] }, "401-500",
                      { $cond: [
                        { $lt: ["$price", 600] }, "501-600",
                        { $cond: [
                          { $lt: ["$price", 700] }, "601-700",
                          { $cond: [
                            { $lt: ["$price", 800] }, "701-800",
                            { $cond: [
                              { $lt: ["$price", 900] }, "801-900",
                              "901-above"
                            ]}
                          ]}
                        ]}
                      ]}
                    ]}
                  ]}
                ]}
              ]}
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Fetch pie chart data
    const pieChart = await Product.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ 
      transactions, 
      totalSalesAmount: statistics[0]?.total || 0, 
      barChart, 
      pieChart 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching combined data');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Backend server running on port 3000');
});
