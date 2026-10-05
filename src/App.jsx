import { useEffect, useMemo, useState } from 'react'
import { createClient, getInventory, createInventoryItem, getPublicUrl } from './lib/supabase.js'

const initialData = [
  {
    id: 'demo-1',
    name: 'STOCK 1',
    game: 'Free Fire',
    type: 'Jual',
    price: 150000,
    status: 'READY',
    spec: 'Skin, akun aktif, email terhubung',
    images: []
  },
  {
    id: 'demo-2',
    name: 'STOCK 2',
    game: 'Free Fire',
    type: 'Jual',
    price: 200000,
    status: 'READY',
    spec: 'Akun aman, login via Google',
    images: []
  }
]

function App() {
  const [items, setItems] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [adminMode, setAdminMode] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [form, setForm] = useState({
    name: '',
    game: 'Free Fire',
    type: 'Jual',
    price: 0,
    status: 'READY',
    spec: '',
    files: []
  })

  useEffect(() => {
    const boot = async () => {
      try {
        const supabase = createClient()
        if (supabase) {
          const rows = await getInventory(supabase)
          if (rows && rows.length) {
            setItems(rows)
          }
        }
      } catch (error) {
        console.warn('Supabase not configured or unreachable:', error.message)
      } finally {
        setLoading(false)
      }
    }

    boot()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => item.status !== 'TERJUAL' || adminMode)
  }, [items, adminMode])

  const handleAdminLogin = () => {
    const expected = import.meta.env.VITE_ADMIN_PIN || '1234'
    if (pin === expected) {
      setAdminMode(true)
      setPinError('')
      return
    }
    setPinError('PIN salah')
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || [])
    setForm((prev) => ({ ...prev, files }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.price) return

    const supabase = createClient()
    const payload = {
      name: form.name,
      game: form.game,
      type: form.type,
      price: Number(form.price),
      status: form.status,
      spec: form.spec,
      images: []
    }

    let saved = { ...payload, id: crypto.randomUUID() }

    if (supabase) {
      const created = await createInventoryItem(supabase, payload)
      saved = { ...created, images: created.images || [] }
    }

    setItems((prev) => [saved, ...prev])
    setForm({
      name: '',
      game: 'Free Fire',
      type: 'Jual',
      price: 0,
      status: 'READY',
      spec: '',
      files: []
    })
  }

  const totalValue = filtered.reduce((sum, item) => sum + Number(item.price || 0), 0)

  if (loading) {
    return <div className="loader">Loading inventory...</div>
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">SHINKY REAL</div>
          <div className="tag">ALL STOCK // MANAGEMENT</div>
        </div>

        <div className="admin-panel">
          {!adminMode ? (
            <div className="admin-box">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN admin"
              />
              <button onClick={handleAdminLogin}>Masuk</button>
              {pinError && <span className="error">{pinError}</span>}
            </div>
          ) : (
            <button className="admin-on" onClick={() => setAdminMode(false)}>Admin Mode ON</button>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">PUSAT GAME INDONESIA</span>
          <h1>STOK AMAN. DEAL NYAMAN.</h1>
          <p>Katalog akun game pilihan untuk jual dan sewa. Data bisa dikelola dari admin panel dan siap diperluas ke Supabase.</p>
        </div>
      </section>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <small>STOK TERDETEKSI</small>
            <strong>{filtered.length}</strong>
          </div>
          <div className="stat-card">
            <small>ESTIMASI NILAI</small>
            <strong>Rp {Number(totalValue).toLocaleString('id-ID')}</strong>
          </div>
        </section>

        {adminMode && (
          <section className="panel form-panel">
            <h3>Tambah Stok Baru</h3>
            <form className="inventory-form" onSubmit={handleSubmit}>
              <label>
                Nama Akun
                <input name="name" value={form.name} onChange={handleFormChange} required />
              </label>
              <label>
                Game
                <select name="game" value={form.game} onChange={handleFormChange}>
                  <option>Free Fire</option>
                  <option>Mobile Legends</option>
                  <option>TikTok</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label>
                Tipe
                <select name="type" value={form.type} onChange={handleFormChange}>
                  <option>Jual</option>
                  <option>Sewa</option>
                </select>
              </label>
              <label>
                Harga
                <input name="price" type="number" value={form.price} onChange={handleFormChange} required />
              </label>
              <label>
                Status
                <select name="status" value={form.status} onChange={handleFormChange}>
                  <option>READY</option>
                  <option>HOLD</option>
                  <option>TERJUAL</option>
                </select>
              </label>
              <label>
                Spesifikasi
                <textarea name="spec" value={form.spec} onChange={handleFormChange} rows="3" />
              </label>
              <label>
                Gambar
                <input type="file" multiple accept="image/*" onChange={handleFiles} />
              </label>
              <button type="submit" className="primary-btn">Simpan Stok</button>
            </form>
          </section>
        )}

        <section className="cards-grid">
          {filtered.map((item) => (
            <article key={item.id} className="card">
              <div className="media">
                {item.images && item.images.length ? (
                  <img src={getPublicUrl(item.images[0]?.path || item.images[0]?.url || '') || item.images[0]?.url} alt={item.name} />
                ) : (
                  <div className="placeholder">NO IMAGE</div>
                )}
                <span className={`badge ${item.status}`}>{item.status}</span>
              </div>

              <div className="card-body">
                <div className="card-top">
                  <span className="type">{item.type}</span>
                  <span className="game-tag">{item.game}</span>
                </div>
                <h3>{item.name}</h3>
                <p className="spec">{item.spec}</p>

                <div className="prices">
                  <div>
                    <small>Harga</small>
                    <strong>Rp {Number(item.price || 0).toLocaleString('id-ID')}</strong>
                  </div>
                  <div>
                    <small>DP 30%</small>
                    <strong>Rp {Math.ceil((Number(item.price || 0) * 30) / 100).toLocaleString('id-ID')}</strong>
                  </div>
                </div>

                <div className="actions">
                  <button type="button" className="secondary-btn">HITUNG DP</button>
                  <a href="https://wa.me/6285641260260" target="_blank" rel="noreferrer" className="primary-btn">BELI VIA WA</a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
