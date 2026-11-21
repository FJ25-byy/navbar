import { ChevronRight, Heart, WifiOff, CloudDownload, Smartphone, TrendingUp, Upload,
  History, BarChart3, Users, Mic, Sliders, Settings, Info, LogIn, Search } from 'lucide-react'

const G = ['#c9d63b,#1a1c0c', '#e8a33d,#4a1b0c', '#ff7a45,#3b0f12', '#d9455f,#2a0a1a', '#2f7bff,#071a4a',
  '#a64b8e,#1d0a22', '#c7a24f,#2b210c', '#e9e2d0,#3a3426', '#6a6f7a,#12141a']
const Cover = ({ i, size }) => (
  <div className="cover" style={{ width: size, height: size, background: `linear-gradient(140deg,${G[i % G.length]})` }} />
)
const Head = ({ children }) => <h1 className="title">{children}</h1>
const Row = ({ Icon, children, sub }) => (
  <div className="row"><Icon size={19} /><div><div>{children}</div>{sub && <small>{sub}</small>}</div><ChevronRight size={18} className="chev" /></div>
)

const titles = ['Teh Hijau', 'Negoro Angin', 'Dunia Yang Nyata', 'Terbelah Jadi Dua', 'Terbelah Jadi Biru',
  'Sisa Rasa', 'Tak Pernah Tenang', 'Sesi Potret', 'Jangan Paksa Aku']

export function Beranda() {
  return (<>
    <Head>Selamat pagi</Head>
    <div className="chips">{['Relax', 'Commute', 'Energize', 'Sleep', 'Fokus', 'Workout'].map((c) => <span key={c}>{c}</span>)}</div>
    <h2>Andalanmu</h2>
    <div className="grid3">{titles.map((t, i) => <div key={t}><Cover i={i} /><p>{t}</p></div>)}</div>
    <div className="between"><h2>Quick picks</h2><span className="link">Putar semua</span></div>
    {titles.concat(titles).map((t, i) => (
      <div className="song" key={i}><Cover i={i} size={48} /><div><div>{t}</div><small>Artis {i + 1}</small></div></div>
    ))}
  </>)
}

export function Cari() {
  const g = ['Pop', 'Dangdut', 'Hip Hop', 'Rock', 'Indie', 'Santai', 'Semangat', 'Galau', 'Akustik', 'K-Pop', 'Jazz', 'Koplo', 'Fokus', 'Tidur', 'Gym', 'Perjalanan']
  return (<>
    <div className="search"><Search size={18} /><span>Cari lagu, album, artis...</span></div>
    <div className="seg"><span className="on">YouTube</span><span>Perangkat</span></div>
    <h2>Jelajahi semua</h2>
    <div className="grid2">{g.map((x) => <div className="tile" key={x}>{x}</div>)}</div>
  </>)
}

export function Pustaka() {
  return (<>
    <Head>Pustaka</Head>
    <div className="tabs">{['Semua', 'Playlist', 'Lagu', 'Album', 'Artis'].map((t, i) => <span key={t} className={i ? '' : 'on'}>{t}</span>)}</div>
    <h2>Koleksi</h2>
    {[[Heart, 'Disukai'], [WifiOff, 'Diunduh'], [CloudDownload, 'Tersimpan di cache'], [Smartphone, 'Di perangkat'],
      [TrendingUp, 'Teratas saya 50'], [Upload, 'Diunggah']].map(([I, t]) => (
      <div className="line" key={t}><I size={20} /><span>{t}</span><ChevronRight size={18} className="chev" /></div>
    ))}
  </>)
}

export function Kamu() {
  return (<>
    <Head>Kamu</Head>
    <div className="card"><Row Icon={History}>Riwayat</Row><Row Icon={BarChart3}>Statistik dan recap</Row></div>
    <div className="card"><Row Icon={Users}>Dengar bersama</Row><Row Icon={Mic}>Kenali lagu</Row><Row Icon={Sliders}>Ekualiser</Row></div>
    <div className="card"><Row Icon={LogIn} sub="Sinkronkan lagu disukai, pustaka, dan playlist">Masuk ke YouTube Music</Row></div>
    <div className="card"><Row Icon={Settings}>Pengaturan</Row><Row Icon={Info}>Tentang</Row></div>
  </>)
}
