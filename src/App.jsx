import { useState } from 'react'

function Badge({ ok, label }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}
    </div>
  )
}

function App() {
  const [topic, setTopic] = useState('Optimasi judul YouTube agar CTR naik')
  const [keywords, setKeywords] = useState('judul youtube, CTR, thumbnail')
  const [niche, setNiche] = useState('content creator')
  const [audience, setAudience] = useState('pemula')
  const [platform, setPlatform] = useState('youtube')
  const [region, setRegion] = useState('WIB')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const analyze = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map(s => s.trim()).filter(Boolean),
          niche,
          audience,
          platform: platform === 'shorts' ? 'shorts' : 'youtube',
          region,
        })
      })
      if (!res.ok) throw new Error('Gagal menganalisa')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const criteriaList = data?.criteria || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Analisa Konten YouTube</h1>
          <p className="text-gray-600 mt-2">Dapatkan judul ramah SEO, hook kuat, angle eksekusi, CTA, deskripsi, hashtag, jam posting, dan skor kelayakan otomatis.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={analyze} className="bg-white/80 backdrop-blur rounded-xl shadow p-6 space-y-4 border border-white">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topik/Ide Video</label>
              <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="contoh: Cara riset kata kunci YouTube" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci (pisahkan dengan koma)</label>
              <input value={keywords} onChange={e=>setKeywords(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="contoh: riset keyword, youtube seo, tools gratis" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niche</label>
                <input value={niche} onChange={e=>setNiche(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="misal: edukasi, gaming, finance" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audiens Target</label>
                <input value={audience} onChange={e=>setAudience(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="misal: pemula, UMKM, pro" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select value={platform} onChange={e=>setPlatform(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="youtube">YouTube</option>
                  <option value="shorts">YouTube Shorts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zona Waktu</label>
                <select value={region} onChange={e=>setRegion(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                  <option>WIB</option>
                  <option>WITA</option>
                  <option>WIT</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 shadow disabled:opacity-60">
              {loading ? 'Menganalisa...' : 'Analisa Sekarang'}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <a href="/test" className="inline-block text-sm text-gray-500 hover:text-gray-700">Cek koneksi backend</a>
          </form>

          <div className="bg-white/80 backdrop-blur rounded-xl shadow p-6 border border-white">
            {!data ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center p-8">
                Hasil akan tampil di sini setelah dianalisa.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Ringkasan</h2>
                    <div className="text-sm text-gray-600">Skor Kelayakan: <span className="font-bold text-indigo-700">{data.score}%</span></div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${data.score}%`}} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">Hook</h3>
                      <p className="text-gray-900 font-medium">{data.hook}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">Judul SEO</h3>
                      <p className="text-gray-900 font-medium">{data.seo_title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">Angle/Format</h3>
                      <p className="text-gray-900 font-medium">{data.angle}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">CTA</h3>
                      <p className="text-gray-900 font-medium">{data.cta}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">Deskripsi</h3>
                      <p className="text-gray-700">{data.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">Hashtag</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {data.hashtags.map((h,i)=> (
                          <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-500">Rekomendasi Jam Posting</h3>
                      <p className="text-gray-900 font-medium">{data.post_time}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Kriteria Kelayakan</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Badge ok={criteriaList.hook_6_16_kata} label="Hook 6–16 kata" />
                    <Badge ok={criteriaList.judul_mengandung_kata_kunci} label="Judul mengandung salah satu kata kunci" />
                    <Badge ok={criteriaList.angle_spesifik} label="Angle spesifik & jelas eksekusinya" />
                    <Badge ok={criteriaList.cta_jelas} label="CTA jelas (ajak subscribe/ikuti/simpan/komentar)" />
                    <Badge ok={criteriaList.hashtag_3_10} label="3–10 hashtag relevan" />
                    <Badge ok={criteriaList.deskripsi_80_220} label="Deskripsi 80–220 karakter" />
                    <Badge ok={criteriaList.ada_rekomendasi_jam} label="Ada rekomendasi jam posting" />
                  </div>
                </div>

                <div className="bg-amber-50 text-amber-800 border border-amber-200 p-4 rounded-md text-sm">
                  Tips: Uji 3 variasi hook dan 2 judul. Simpan judul dengan kata kunci terdepan, jaga deskripsi tetap ringkas dan fokus manfaat.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
