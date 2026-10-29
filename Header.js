import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🍕</span>
          <span>Пиццерия</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Главная</Nav.Link>
            <Nav.Link as={Link} to="/catalog">Каталог</Nav.Link>
            <Nav.Link as={Link} to="/contacts">Контакты</Nav.Link>
          </Nav>

          <div className="d-flex gap-2">
            <Button as={Link} to="/login" variant="outline-light" size="sm">
              Войти
            </Button>
            <Button as={Link} to="/register" variant="warning" size="sm">
              Регистрация
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;