export default function SearchStatus({ result, loadingText, emptyText, onRetry }) {
  if (result.status === 'loading') {
    return (
      <p className="mt-2 mb-0 text-body-secondary" role="status">
        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
        {loadingText}
      </p>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="alert alert-danger d-flex align-items-center flex-wrap gap-2 mt-2 mb-0">
        <span role="alert">{result.error}</span>
        <button className="btn btn-sm btn-outline-danger" type="button" onClick={onRetry}>Повторить</button>
      </div>
    );
  }

  if (result.status === 'done' && result.items.length === 0) {
    return <p className="mt-2 mb-0 text-body-secondary" role="status">{emptyText}</p>;
  }

  return null;
}
