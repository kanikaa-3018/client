import React from 'react';
import { Button, Checkbox, Form, Input, message, Row, Col, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Sending data to the backend API using axios
      const response = await axios.post('/users/login', values);
      console.log(response) // Adjust the endpoint as necessary
      if (response.data.success) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        message.success('User logged in successfully!');
        
        // Redirect to the home route after successful login
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data); // Displaying the error message from the backend
      } else {
        message.error('An error occurred during login.');
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Error in user login!');
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
            Login to your account
          </Text>

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
              Don't have an account? <a href="/register">Register here</a>
            </Text>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
