import React from 'react';
import { Button, Checkbox, Form, Input, message, Row, Col, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Register = () => {
    const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      // Sending data to the backend API using axios
      const response = await axios.post('/users/register', values); // Adjust the endpoint as necessary
      if (response.data.success) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.newUser));
        
        message.success('User registered successfully!');
        navigate("/login");
        // Optionally redirect or reload the page if needed
        setTimeout(() => {
          window.location.reload(); // Reloads the register page
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data); // Displaying the error message from the backend
      } else {
        message.error('An error occurred during registration.');
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Error in user registration!');
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, margin: '0 auto' }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Text strong className="text-3xl font-bold" style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}>
            Register your account
          </Text>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ textAlign: 'center' }}
          >
            <Text>
              Already have an account? <a href="/login">Login here</a>
            </Text>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
