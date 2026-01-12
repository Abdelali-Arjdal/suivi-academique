import React, { useState, useMemo } from 'react';

const DataTable = ({ data, columns, title, searchable = true, pageSize = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchTerm && searchable) {
      filtered = data.filter(item =>
        columns.some(col =>
          String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle nested objects (e.g., studentId.nom)
        if (typeof aVal === 'object' && aVal !== null) {
          aVal = aVal.nom || aVal.prenom || JSON.stringify(aVal);
        }
        if (typeof bVal === 'object' && bVal !== null) {
          bVal = bVal.nom || bVal.prenom || JSON.stringify(bVal);
        }
        
        // Handle null/undefined
        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';
        
        // Convert to string for comparison
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, columns, searchable]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up text-muted"></i>;
    return sortConfig.direction === 'asc' 
      ? <i className="bi bi-arrow-up text-primary"></i>
      : <i className="bi bi-arrow-down text-primary"></i>;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold">{title}</h5>
        {searchable && (
          <div className="w-25">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-light">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={col.sortable !== false ? 'cursor-pointer user-select-none' : ''}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{ cursor: col.sortable !== false ? 'pointer' : 'default' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{col.label}</span>
                      {col.sortable !== false && getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    Aucune donnée disponible
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="card-footer bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, filteredAndSortedData.length)} sur {filteredAndSortedData.length}
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(page)}>
                          {page}
                        </button>
                      </li>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <li key={page} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

