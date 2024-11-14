import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; 2024 Expense.io. All rights reserved.</p>
        <div className="mt-2">
          <Link to="/privacy" className="hover:text-white mx-2">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white mx-2">Terms of Service</Link>
          <Link to="/contact" className="hover:text-white mx-2">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
