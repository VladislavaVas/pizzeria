import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';

function Catalog() {
  const [sortBy, setSortBy] = useState('new');
  const [category, setCategory] = useState('all');

  const visibleProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.stock > 0);

    if (category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    const sorted = [...list];
    switch (sortBy) {
      case 'year':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      default: 
        sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
    return sorted;
  }, [sortBy, category]);

  return (
    <Container>
      <h2 className="mb-4">Каталог</h2>

      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        <div>
          <strong className="me-2">Сортировка:</strong>
          <Form.Select
            style={{ display: 'inline-block', width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="new">По новизне</option>
            <option value="year">По году</option>
            <option value="name">По наименованию</option>
            <option value="price">По цене</option>
          </Form.Select>
        </div>

        <div>
          <strong className="me-2">Категория:</strong>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={category === cat.id ? 'warning' : 'outline-secondary'}
              className="me-2"
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <p className="text-muted">Товаров не найдено.</p>
      ) : (
        <Row>
          {visibleProducts.map((product) => (
            <Col md={4} sm={6} xs={12} key={product.id} className="mb-4">
              <Card
                as={Link}
                to={`/product/${product.id}`}
                className="h-100 text-decoration-none text-dark"
              >
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  style={{ height: 200, objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="fw-bold">{product.price} ₽</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Catalog;