function Catalog() {
  return (
    <div>
      <h2 className="mb-4">Наше меню</h2>
      <p className="text-muted">Здесь скоро появятся все наши пиццы, напитки и десерты.</p>

      <div className="row">
        {[1, 2, 3, 4].map((item) => (
          <div className="col-md-3 mb-3" key={item}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Пицца #{item}</h5>
                <p className="card-text">Описание скоро появится.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;