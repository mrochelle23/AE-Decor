import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import BookList from './components/BookList';
import ContactForm from './components/ContactForm';
import About from './components/About';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import BookDetails from './components/BookDetails';
import Appointments from './components/Appointments';
import CancelApp from './components/CancelApp';


function App() {
  const books = [
    {
      id: 1,
      name: 'Distinctive Decor: Tablescaping Book',
      price: 45,
      image: '/images/book.png',
      description: 'This is a great book about...',
      author: 'Arthur White',
      isbn: '1234567890',
      format: 'Hardcover',
      publicationDate: '2023-01-01',
    },
    {
      id: 2,
      name: 'New Edition: Tablescaping Book 2',
      price: 45,
      image: '/images/book.png',
      description: 'This is a great book about...',
      author: 'Arthur White',
      isbn: '1234567890',
      format: 'Hardcover',
      publicationDate: '2023-01-01',
    },
  ];
  
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BookList books={books} />} />
              <Route path="/books/:id" element={<BookDetails books={books} />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/cancel" element={<CancelApp />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;