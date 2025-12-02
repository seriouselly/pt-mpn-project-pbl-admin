import React from 'react';

export default function CardItem({ item, variant, onEdit, onDelete }) {
  return (
    <div className="card-modern" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center', borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 16 }}>
      {item.foto ? (
        <div style={{ width: 72, height: 72, flex: '0 0 72px', borderRadius: 8, overflow: 'hidden', background: '#f5f7fa' }}>
          <img src={item.foto} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ width: 72, height: 72, flex: '0 0 72px', borderRadius: 8, background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa4b2' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 19V7a2 2 0 0 0-2-2h-1l-1-2H7L6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a0 0 0 0 0 0z" stroke="#9aa4b2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{item.nama || item.title || 'Untitled'}</div>
            <div style={{ fontSize: 13, color: '#637381', marginTop: 6 }}>{item.deskripsi || item.message || ''}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {variant === 'layanan' && (
              <span style={{ padding: '6px 10px', borderRadius: 999, fontSize: 12, background: item.status === 'Active' ? '#e6fbeb' : '#ffecec', color: item.status === 'Active' ? '#0a8a2c' : '#b70000' }}>
                {item.status}
              </span>
            )}
            <button onClick={onEdit} className="btn btn-outline" style={{ padding: '6px 8px' }}>Edit</button>
            <button onClick={onDelete} className="btn btn-danger" style={{ padding: '6px 8px' }}>Hapus</button>
          </div>
        </div>
      </div>
    </div>
  );
}
