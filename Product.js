import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { getProducts } from '../utils/productsStorage';
import { useCart } from '../context/CartContext';

function Product() {
  const { id } = useParams();
  const product = getProducts().find((p) => String(p.id) === id);
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  if (!product) {
    return (
      <Container>
        <Alert variant="danger">Товар не найден</Alert>
        <Link to="/catalog">← Вернуться в каталог</Link>
      </Container>
    );
  }

  const inCart = items.find((i) => i.id === product.id)?.quantity || 0;
  const canAdd = product.stock > inCart;

  const handleAddToCart = () => {
    setAdded(false);
    setError('');
    if (!canAdd) {
      setError('Достигнут лимит наличия на складе');
      return;
    }
    addToCart(product, 1);
    setAdded(true);
  };

  return (
    <Container>
      <Link to="/catalog" className="d-inline-block mb-3">
        ← Вернуться в каталог
      </Link>

      <Row>
        <Col md={6} className="mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: '100%', height: 400, objectFit: 'cover' }}
          />
        </Col>

        <Col md={6}>
          <h2>{product.name}</h2>
          <h3 className="text-warning mb-4">{product.price} ₽</h3>

          <h5>Характеристики</h5>
          <ul className="list-unstyled mb-4">
            <li>
              <strong>Страна-производитель:</strong> {product.country}
            </li>
            <li>
              <strong>Год выпуска:</strong> {product.year}
            </li>
            <li>
              <strong>Модель:</strong> {product.model}
            </li>
            <li>
              <strong>В наличии:</strong> {product.stock} шт.
            </li>
          </ul>

          {product.stock === 0 && (
            <Alert variant="warning">Нет в наличии</Alert>
          )}

          <Button
            variant="warning"
            size="lg"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            В корзину
          </Button>

          {inCart > 0 && (
            <p className="mt-2 text-muted">В корзине: {inCart} шт.</p>
          )}

          {added && (
            <Alert variant="success" className="mt-3">
              Товар добавлен в корзину!
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Product;