import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  DatePicker,
  Popconfirm,
  message,
  Modal,
  Spin, // Importing the Spin component from Ant Design
} from "antd";
import axios from "axios";
import moment from "moment";

import {
  PlusOutlined,
  PieChartOutlined,
  BarChartOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons"; 
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
const { RangePicker } = DatePicker;
const { Option } = Select;

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [frequency, setFrequency] = useState("7");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState("all");
  const [editable,setEditable] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form] = Form.useForm();
  const [formVisible, setFormVisible] = useState(false);
  const [chartType, setChartType] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const categories = [
    "food",
    "study",
    "transport",
    "entertainment",
    "health",
    "shopping",
    "utilities",
    "rent",
    "subscriptions",
    "miscellaneous",
    "travel",
    "education",
    "business",
    "salary",
  ];

  const types = ["expense", "savings", "investment", "income"];

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => (
      <div>
        <EditOutlined
          style={{ color: "blue", marginRight: 12, cursor: "pointer" }}
          onClick={() => {
            handleEdit(record)
            setEditable(record);
            setFormVisible(true);
          }}
        />
        <Popconfirm
          title="Are you sure to delete this transaction?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      </div>
    ),
    },
  ];

  const onFinish = async (values) => {
    try {
      // Format the date if it exists, otherwise, set it to null
      const transactionData = {
        ...values,
        date: values.date ? values.date.format() : null, 
        reference: values.reference || '', 
      };
  
      // Get the user data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
  
      // Check if user is available
      if (!user || !user._id) {
        message.error("User is not authenticated.");
        return;
      }
  
      if (editable && editable._id) {
        console.log(editable);
        console.log("Sending PUT request...");
      console.log("Editable ID:", editable._id);
      console.log("Transaction Data:", transactionData);
        // Update transaction if in edit mode
        const response = await axios.post(`/transactions/edit/${editable._id}`, {
          transactionData,
          _id: user._id,
        });
  
        message.success("Transaction updated successfully!");
      } else {
        const response = await axios.post("/transactions/add", {
          ...transactionData,
          _id: user._id, 
        });
  
        message.success("Transaction added successfully!");
      }
  
      // Reset form and close modal after successful transaction
      form.resetFields();
      setFormVisible(false);
      setEditable(null);
  
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Error while saving transaction.");
    }
  };
  

  // Handle editing a transaction
  const handleEdit = (record) => {
    setEditable(record._id);
    form.setFieldsValue({
      amount: record.amount,
      type: record.type,
      category: record.category,
      reference: record.reference,
      description: record.description,
      date: record.date ? moment(record.date) : null,
    });
    setFormVisible(true);
  };

  const getTypePercentage = (transactions, types) => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return types.map((type) => ({ type, percentage: 0 }));
    }

    const totalAmount = transactions.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    if (totalAmount === 0) {
      return types.map((type) => ({ type, percentage: 0 }));
    }

    return types.map((type) => {
      const typeTotal = transactions
        .filter((item) => item.type === type)
        .reduce((sum, item) => sum + (item.amount || 0), 0);

      return {
        type,
        percentage: ((typeTotal / totalAmount) * 100).toFixed(2),
      };
    });
  };

  const getCategoryPercentage = (transactions, categories) => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return categories.map((category) => ({ category, percentage: 0 }));
    }

    const totalAmount = transactions.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    if (totalAmount === 0) {
      return categories.map((category) => ({ category, percentage: 0 }));
    }

    return categories.map((category) => {
      const catTotal = transactions
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        category,
        percentage: ((catTotal / totalAmount) * 100).toFixed(2),
      };
    });
  };

  
  
  const handleDelete = async (transactionId) => {
    try {
      const response = await axios.delete(`/transactions/${transactionId}`);
      if (response.status === 200) {
        message.success("Transaction deleted successfully!");
        // Refresh the transactions
        setTransactions(transactions.filter((t) => t._id !== transactionId));
      } else {
        message.error("Failed to delete transaction.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error while deleting transaction.");
    }
  };

  const catData = getCategoryPercentage(transactions, categories);
  const typeData = getTypePercentage(transactions, types);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

const fetchTransactions = async () => {
  setLoading(true); 
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await axios.get("/transactions/getAll", {
      params: {
        frequency,
        type,      
      },
    });

    if (response.status === 200) {
      setTransactions(response.data);
    } else {
      message.error("Failed to fetch transactions.");
    }
  } catch (error) {
    console.error(error);
    message.error("Error while fetching transactions.");
  } finally {
    setLoading(false); 
  }
};

    fetchTransactions();
  }, [type, frequency, startDate, endDate]);

  return (
    <div>
      <div className="flex flex-row justify-between px-8">
        <div>
          {user ? (
            <div className="text-3xl font-bold px-8 mt-6">
              Welcome, {user.name}!
            </div>
          ) : (
            <div>Welcome, Guest!</div>
          )}
        </div>
        <div className="flex gap-5 mb-4 mt-6">
        <h6>Select Type</h6>
        <Select value={type} onChange={(value) => setType(value)}>
          <Option value="all">All</Option>
          <Option value="expense">Expense</Option>
          <Option value="savings">Savings</Option>
          <Option value="investment">Investment</Option>
          <Option value="income">Income</Option>
        </Select>
        <h6>Select Frequency</h6>
        <Select value={frequency} onChange={(value) => setFrequency(value)}>
          <Option value="7">Last 1 week</Option>
          <Option value="30">Last 1 month</Option>
          <Option value="365">Last 1 year</Option>
          <Option value="custom">Custom</Option>
        </Select>
        {frequency === 'custom' && (
        <RangePicker
          onChange={(dates) => {
            if (dates) {
              console.log(dates);
              setStartDate(dates[0].format('YYYY-MM-DD'));
              setEndDate(dates[1].format('YYYY-MM-DD'));
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
        />
      )}
      </div>
        <div className="mt-6">
          <Button
            icon={<PieChartOutlined />}
            onClick={() => setChartType("pie")}
            style={{ marginRight: "10px" }}
          />
          <Button
            icon={<BarChartOutlined />}
            onClick={() => setChartType("bar")}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setFormVisible(true)}
          style={{ marginBottom: "20px", marginTop: "25px" }}
        >
          Add Transaction
        </Button>
      </div>
      <div className="border-b-2 w-full"></div>

      {/* Modal for Add Transaction Form */}
      <Modal
        title={editable?"Edit Transaction" : "Add Transaction"}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        centered
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={editable}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please input the amount!" }]}
          >
            <Input type="number" placeholder="Amount" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select the type!" }]}
          >
            <Select placeholder="Select Type">
              {types.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select the category!" }]}
          >
            <Select placeholder="Select Category">
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input placeholder="Reference" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Transaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Table for Transactions */}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
      ) : (
        <Table
        className="px-16 mt-12 mb-12"
          columns={columns}
          dataSource={transactions}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Conditional rendering of charts */}
      {chartType === "pie" && (
        <div>
          <PieChart typeData={typeData} categoryData={catData}/>
        </div>
      )}
      {chartType === "bar" && (
        <div>
          <BarChart data={typeData} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
