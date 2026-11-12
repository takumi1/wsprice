export default function ApiSettings({ live, onChange }) {
  function connect(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const key = form.elements.namedItem('apiKey').value.trim();
    if (!key) return;

    onChange(key);
    form.reset();
  }

  return (
    <details>
      <summary className="small">Настройка API</summary>
      <form className="mt-2" onSubmit={connect}>
        <label className="form-label small" htmlFor="api-key">Тестовый ключ API</label>
        <div className="input-group input-group-sm">
          <input id="api-key" name="apiKey" className="form-control" type="password" autoComplete="off" required />
          <button className="btn btn-outline-secondary" type="submit">Подключить</button>
        </div>
        {live && (
          <button className="btn btn-link btn-sm px-0" type="button" onClick={() => onChange('')}>
            Вернуться в демо
          </button>
        )}
      </form>
    </details>
  );
}
