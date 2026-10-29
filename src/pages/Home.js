function Home() {
  return (
    <div>
      <div className="text-center my-4">
        <h1>Горячая пицца с доставкой за 30 минут</h1>
        <p className="lead">Скидка 20% на первый заказ — попробуй нашу Пепперони!</p>
      </div>

      <div id="main-carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://avatars.mds.yandex.net/get-vertis-journal/4220003/e4335548-91e8-4d5d-ae3c-ccc2fb5641c7.jpg/1600x1600"
              className="d-block w-100"
              alt="Пепперони"
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>Пепперони</h3>
              <p>Классика с острой колбаской и сыром моцарелла.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://www.koolinar.ru/all_image/article/4/4164/article-06c088e0-64ee-4489-b94b-c1f87772a907_large.webp"
              className="d-block w-100"
              alt="Маргарита"
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>Маргарита</h3>
              <p>Томаты, базилик и много сыра.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://avatars.mds.yandex.net/i?id=b1954671e21b3f4c3be760a7ea735c69_l-11397886-images-thumbs&n=13"
              className="d-block w-100"
              alt="Четыре сыра"
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>Четыре сыра</h3>
              <p>Моцарелла, горгонзола, пармезан и чеддер.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#main-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#main-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
}

export default Home;