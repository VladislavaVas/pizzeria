import { Container, Row, Col } from 'react-bootstrap';

function Contacts() {
  return (
    <Container>
      <h2 className="mb-4">Контакты</h2>

      <Row>
        <Col md={5} className="mb-4">
          <h5>Наш адрес</h5>
          <p>г. Москва, ул. Пиццерийная, д. 1</p>

          <h5>Телефон</h5>
          <p>
            <a href="tel:+79991234567">+7 (999) 123-45-67</a>
          </p>

          <h5>Email</h5>
          <p>
            <a href="mailto:info@pizzeria.ru">info@pizzeria.ru</a>
          </p>

          <h5>Режим работы</h5>
          <p>Ежедневно с 10:00 до 23:00</p>
        </Col>

        <Col md={7} className="mb-4">
          <h5>Мы на карте</h5>
          <iframe
            title="Карта пиццерии"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: 8 }}
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=37.6%2C55.74%2C37.64%2C55.76&layer=mapnik&marker=55.75%2C37.62"
          ></iframe>
        </Col>
      </Row>
    </Container>
  );
}

export default Contacts;