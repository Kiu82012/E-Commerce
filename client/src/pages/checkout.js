import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../lib/config';
import Navbar from '../components/Navbar';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  if (!user) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">
            Please <a href="/auth/login">login</a> to checkout.
          </Alert>
        </Container>
      </>
    );
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="info">
            Your cart is empty. <a href="/">Browse products</a>
          </Alert>
        </Container>
      </>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format shipping address
    const shippingAddress = `${formData.fullName}\n${formData.address}\n${formData.city}, ${formData.state} ${formData.zipCode}\n${formData.country}\nPhone: ${formData.phone}`;

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod: 'stripe'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Redirect to order confirmation
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h1 className="mb-4">Checkout</h1>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Shipping Information</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>ZIP Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <Card.Title>Payment Method</Card.Title>
                      <Form.Check
                        type="radio"
                        label="Cash on Delivery"
                        name="paymentMethod"
                        defaultChecked
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Pay when you receive your order
                      </Form.Text>
                    </Card.Body>
                  </Card>

                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : '✓ Place Order'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush" className="mb-3">
                  {cart.items.map((item) => (
                    <ListGroup.Item key={item.id} className="px-0">
                      <div className="d-flex justify-content-between">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${Number(cart.total).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>${Number(cart.total).toFixed(2)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
