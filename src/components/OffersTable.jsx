const formatPrice = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function OffersTable({ items }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle mb-0" aria-label="Предложения по складам">
        <thead>
          <tr>
            <th scope="col">Название / производитель</th>
            <th scope="col">Склад</th>
            <th scope="col" className="text-end">Цена</th>
            <th scope="col" className="text-end">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                {item.name || item.number}
                <div className="small text-body-secondary">{item.brand} · {item.number}</div>
              </td>
              <td>{item.warehouse ?? '—'}</td>
              <td className="text-end text-nowrap">{item.price == null ? '—' : formatPrice.format(item.price)}</td>
              <td className="text-end">{item.stock ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
