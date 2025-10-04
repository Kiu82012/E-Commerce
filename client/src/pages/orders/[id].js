import { useEffect, useState } from 'react';
import { Container, Card, Alert, Badge, ListGroup, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../lib/config';
import Navbar from '../../components/Navbar';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && id) {
      fetchOrder();
    }
  }, [token, id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">
            Please <a href="/auth/login">login</a> to view order details.
          </Alert>
        </Container>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <p>Loading order...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => router.push('/orders')}>
            Back to Orders
          </Button>
        </Container>
      </>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Order #{order.id}</h1>
          <Badge bg={getStatusVariant(order.status)} className="fs-6">
            {order.status.toUpperCase()}
          </Badge>
        </div>

        <Alert variant="success" className="mb-4">
          <Alert.Heading>Order Confirmed!</Alert.Heading>
          <p className="mb-0">
            Your order has been placed successfully. Order date: {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </Alert>

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Order Items</Card.Title>
                <ListGroup variant="flush">
                  {order.items.map((item) => (
                    <ListGroup.Item key={item.id}>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                          />
                        </Col>
                        <Col md={6}>
                          <h5>{item.product.name}</h5>
                          <p className="text-muted mb-0">${Number(item.price).toFixed(2)} each</p>
                        </Col>
                        <Col md={2}>
                          <p className="mb-0">Amount: {item.quantity}</p>
                        </Col>
                        <Col md={2} className="text-end">
                          <strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Shipping Address</Card.Title>
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {order.shippingAddress}
                </pre>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Order Tracking</Card.Title>
                <div className="mt-3">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) 
                          ? 'bg-success text-white' 
                          : 'bg-secondary text-white'
                      }`}
                      style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    >
                      ✓
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <strong>Order Placed</strong>
                      <div className="text-muted small">Your order has been confirmed</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        ['processing', 'shipped', 'delivered'].includes(order.status)
                          ? 'bg-success text-white' 
                          : order.status === 'pending'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary text-white'
                      }`}
                      style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    >
                      {['processing', 'shipped', 'delivered'].includes(order.status) ? '✓' : '○'}
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <strong>Processing</strong>
                      <div className="text-muted small">We're preparing your items</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        ['shipped', 'delivered'].includes(order.status)
                          ? 'bg-success text-white' 
                          : order.status === 'processing'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary text-white'
                      }`}
                      style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    >
                      {['shipped', 'delivered'].includes(order.status) ? '✓' : '○'}
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <strong>Shipped</strong>
                      <div className="text-muted small">Your order is on the way</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        order.status === 'delivered'
                          ? 'bg-success text-white' 
                          : order.status === 'shipped'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary text-white'
                      }`}
                      style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    >
                      {order.status === 'delivered' ? '✓' : '○'}
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <strong>Delivered</strong>
                      <div className="text-muted small">Order has been delivered</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>${Number(order.total).toFixed(2)}</strong>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Payment Method:</small>
                  <div>{order.paymentMethod === 'stripe' ? 'Cash on Delivery' : order.paymentMethod}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Order Status:</small>
                  <div>
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <div className="mt-3">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => router.push('/orders')}
              >
                Back to Orders
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
