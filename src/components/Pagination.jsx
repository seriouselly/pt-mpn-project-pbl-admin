import React from "react";

export default function Pagination({ page, totalPage, onPage }) {
  if (totalPage <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => onPage(page - 1)}>Prev</button></li>
        {Array.from({ length: totalPage }).map((_, i) => (
          <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}><button className="page-link" onClick={() => onPage(i + 1)}>{i + 1}</button></li>
        ))}
        <li className={`page-item ${page === totalPage ? "disabled" : ""}`}><button className="page-link" onClick={() => onPage(page + 1)}>Next</button></li>
      </ul>
    </div>
  );
}
