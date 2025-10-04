import { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Form, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');

  if (!user) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">
            Please <a href="/auth/login">login</a> to view your cart.
          </Alert>
        </Container>
      </>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    setError('');
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemove = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    setError('');
    
    try {
      await removeFromCart(itemId);
    } catch (err) {
      setError(err.message || 'Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <p>Loading cart...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h1 className="mb-4">
          Shopping Cart 
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            fill="currentColor" 
            className="ms-3" 
            viewBox="0 0 16 16"
            style={{ verticalAlign: 'middle' }}
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </h1>
        
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {cart.items.length === 0 ? (
          <Alert variant="info">
            Your cart is empty. <a href="/">Browse products</a>
          </Alert>
        ) : (
          <Row>
            <Col lg={8}>
              <ListGroup>
                {cart.items.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                      </Col>
                      <Col md={4}>
                        <h5>{item.product.name}</h5>
                        <p className="text-muted mb-0">${Number(item.product.price).toFixed(2)}</p>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Quantity</Form.Label>
                          <div className="d-flex align-items-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={updating[item.id] || item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              min="1"
                              disabled={updating[item.id]}
                              className="mx-2 text-center"
                              style={{ width: '70px' }}
                            />
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={updating[item.id]}
                            >
                              +
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <strong>${(Number(item.product.price) * item.quantity).toFixed(2)}</strong>
                      </Col>
                      <Col md={1}>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                          disabled={updating[item.id]}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            fill="currentColor" 
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({cart.itemCount}):</span>
                    <span>${Number(cart.total).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>${Number(cart.total).toFixed(2)}</strong>
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
