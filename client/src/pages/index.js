import { useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Button, Alert, Spinner, Toast, ToastContainer, Modal } from 'react-bootstrap';
import { API_BASE } from '../lib/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function Home() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE}/api/products`, fetcher);
  const [addingToCart, setAddingToCart] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toastVariant, setToastVariant] = useState('success');

  const handleAddToCart = async (productId) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await addToCart(productId, 1);
      setToastMessage('Item added to cart!');
      setToastVariant('success');
      setShowToast(true);
    } catch (err) {
      setToastMessage(err.message || 'Failed to add to cart');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      setToastMessage('Product deleted successfully!');
      setToastVariant('success');
      setShowToast(true);
      handleCloseModal();
      mutate(); // Refresh products list
    } catch (err) {
      setToastMessage(err.message);
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Head>
        <title>E-commerce Showcase</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Navbar />
      
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h1 className="display-5">E-commerce Self Project</h1>
            <p className="text-muted">Next.js + Bootstrap frontend, Express backend, MySQL database. By Cheung Chun Kiu.</p>
          </Col>
        </Row>
        
        {isLoading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" />
          </div>
        )}
        
        {error && (
          <Alert variant="danger">Failed to load products.</Alert>
        )}
        
        {data && (
          <Row xs={1} md={3} className="g-4">
            {data.items.map((p) => (
              <Col key={p.id}>
                <Card className="h-100" style={{ cursor: 'pointer' }} onClick={() => handleProductClick(p)}>
                  <Card.Img variant="top" src={p.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="me-2">{p.name}</Card.Title>
                      
                    </div>
                    <Card.Text className="text-muted flex-grow-1" style={{ minHeight: 48 }}>
                      {p.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div>
                        <strong className="fs-5">${Number(p.price).toFixed(2)}</strong>
                      </div>
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p.id);
                        }}
                        disabled={addingToCart[p.id]}
                      >
                        {addingToCart[p.id] ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Col>
              <Col md={6}>
                <h3>{selectedProduct.name}</h3>
                <h4 className="text-primary mb-3">${Number(selectedProduct.price).toFixed(2)}</h4>
                <p className="text-muted">{selectedProduct.description}</p>
                {selectedProduct.ownerId && (
                  <div className="mt-3">
                    <small className="text-muted">
                      Posted by: {selectedProduct.ownerId === user?.id ? 'You' : 'Another user'}
                    </small>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedProduct && selectedProduct.ownerId === user?.id && (
            <Button 
              variant="danger" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={(e) => {
              e.stopPropagation();
              handleCloseModal();
              if (selectedProduct) {
                handleAddToCart(selectedProduct.id);
              }
            }}
            disabled={addingToCart[selectedProduct?.id]}
          >
            {addingToCart[selectedProduct?.id] ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}