import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('March')
  const [searchText, setSearchText] = useState('')
  const [transactions, setTransactions] = useState([])
  const [statistics, setStatistics] = useState({ totalSalesAmount: 0, totalSold: 0, totalNotSold: 0 })
  const [barChartData, setBarChartData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchData()
  }, [selectedMonth, searchText, currentPage])

  const fetchData = async () => {
    try {
      const [transactionsRes, statisticsRes, barChartRes] = await Promise.all([
        axios.get(http://localhost:3000/transactions?month=${selectedMonth}&search=${searchText}&page=${currentPage}&perPage=10),
        axios.get(http://localhost:3000/statistics?month=${selectedMonth}),
        axios.get(http://localhost:3000/price-chart?month=${selectedMonth})
      ])

      setTransactions(transactionsRes.data.transactions)
      setTotalPages(Math.ceil(transactionsRes.data.total / 10))
      setStatistics(statisticsRes.data)
      setBarChartData(barChartRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Product Transactions Dashboard</h1>
      
      <div className="flex justify-between items-center mb-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Search transactions"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-[300px]"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${statistics.totalSalesAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sold Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statistics.totalSold}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Not Sold Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statistics.totalNotSold}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Date of Sale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction._id}</TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.price.toFixed(2)}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.sold ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(transaction.dateOfSale).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price Range Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Number of Items",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // for Chart.js auto registration

const App = () => {
  const [month, setMonth] = useState('March');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalSalesAmount: 0, totalSold: 0, totalNotSold: 0 });
  const [barChartData, setBarChartData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch transactions whenever month, page, or search term changes
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await axios.get('http://localhost:3000/transactions', {
        params: { page, perPage: 10, search: searchTerm }
      });
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    };
    fetchTransactions();
  }, [page, searchTerm, month]);

  // Fetch statistics whenever the month changes
  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get('http://localhost:3000/statistics', { params: { month } });
      setStats(response.data);
    };
    fetchStatistics();
  }, [month]);

  // Fetch bar chart data whenever the month changes
  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get('http://localhost:3000/price-chart', { params: { month } });
      setBarChartData(response.data);
    };
    fetchBarChartData();
  }, [month]);

  // Data for Bar Chart
  const data = {
    labels: barChartData.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: barChartData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  // Handle Search Input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>

      {/* Month Selector Dropdown */}
      <div className="dropdown">
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="statistics">
        <div>Total Sales: ${stats.totalSalesAmount}</div>
        <div>Sold Items: {stats.totalSold}</div>
        <div>Unsold Items: {stats.totalNotSold}</div>
      </div>

      {/* Search Transactions */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <button onClick={() => setPage(page + 1)} disabled={transactions.length < 10}>Next</button>
      </div>

      {/* Bar Chart */}
      <div className="bar-chart">
        <Bar data={data} />
      </div>
    </div>
  );
}

export default App;
