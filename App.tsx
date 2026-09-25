import { useMemo, useState } from 'react'

type Commodity = 'All crops' | 'Rice' | 'Corn' | 'Coconut' | 'Banana' | 'Sugarcane'
type Region = 'All regions' | 'Luzon' | 'Visayas' | 'Mindanao'

type Market = {
  name: string
  region: Exclude<Region, 'All regions'>
  commodity: Exclude<Commodity, 'All crops'>
  price: number
  change: number
  volume: string
  status: 'Strong' | 'Stable' | 'Watch'
}

const markets: Market[] = [
  { name: 'Nueva Ecija Rice Hub', region: 'Luzon', commodity: 'Rice', price: 46, change: 6.2, volume: '8,400 sacks', status: 'Strong' },
  { name: 'Iloilo Corn Center', region: 'Visayas', commodity: 'Corn', price: 29, change: 4.6, volume: '6,180 sacks', status: 'Strong' },
  { name: 'Davao Coconut Exchange', region: 'Mindanao', commodity: 'Coconut', price: 38, change: 3.1, volume: '4,260 bags', status: 'Stable' },
  { name: 'Batangas Banana Lane', region: 'Luzon', commodity: 'Banana', price: 51, change: -1.4, volume: '7,140 bunches', status: 'Watch' },
  { name: 'Negros Sugar Terminal', region: 'Visayas', commodity: 'Sugarcane', price: 21, change: 2.8, volume: '10,500 tons', status: 'Strong' },
]

const trendByCommodity: Record<Exclude<Commodity, 'All crops'>, number[]> = {
  Rice: [41, 43, 45, 44, 46, 49, 48, 46],
  Corn: [23, 24, 25, 27, 29, 30, 28, 29],
  Coconut: [30, 32, 33, 35, 36, 37, 38, 38],
  Banana: [43, 45, 46, 48, 50, 52, 53, 51],
  Sugarcane: [18, 17, 18, 19, 20, 21, 22, 21],
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

function App() {
  const [commodity, setCommodity] = useState<Commodity>('All crops')
  const [region, setRegion] = useState<Region>('All regions')
  const [period, setPeriod] = useState('Last 8 months')
  const filteredMarkets = useMemo(() => markets.filter((market) =>
    (commodity === 'All crops' || market.commodity === commodity) &&
    (region === 'All regions' || market.region === region),
  ), [commodity, region])

  const trend = commodity === 'All crops'
    ? months.map((_, index) => Math.round(Object.values(trendByCommodity).reduce((sum, series) => sum + series[index], 0) / 5))
    : trendByCommodity[commodity]
  const maxTrend = Math.max(...trend)
  const minTrend = Math.min(...trend)
  const points = trend.map((value, index) => `${(index / (trend.length - 1)) * 100},${92 - ((value - minTrend) / (maxTrend - minTrend || 1)) * 70}`).join(' ')
  const avgMarketPrice = filteredMarkets.length ? Math.round(filteredMarkets.reduce((sum, market) => sum + market.price, 0) / filteredMarkets.length) : 0

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">F</span><span>AgriPrice PH</span></div>
        <div className="sidebar-label">Decision support</div>
        <nav>
          <a className="nav-item active" href="#overview"><span className="nav-icon">::</span>Overview</a>
          <a className="nav-item" href="#markets"><span className="nav-icon">[]</span>Market watch</a>
          <a className="nav-item" href="#trends"><span className="nav-icon">/</span>Price trends</a>
          <a className="nav-item" href="#reports"><span className="nav-icon">=</span>Reports</a>
        </nav>
        <div className="sidebar-footer"><div className="avatar">DA</div><div><strong>DA Philippines</strong><small>Market analytics</small></div><span className="more">...</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">DSS / <strong>Crop pricing overview</strong></div><div className="top-actions"><span className="live-dot" /> Live data <button className="icon-button" aria-label="Notifications">!</button><button className="icon-button" aria-label="Settings">*</button></div></header>

        <section className="page-heading" id="overview"><div><p className="eyebrow">Monday, 18 May 2026</p><h1>Good morning, Maria.</h1><p className="subheading">A clear view of agricultural crop prices across the Philippines.</p></div><button className="export-button"><span>+</span> Export report</button></section>

        <section className="filter-bar" aria-label="Dashboard filters"><div className="filter-title"><span className="filter-icon">≡</span> Filter view</div><label>Crop<select value={commodity} onChange={(event) => setCommodity(event.target.value as Commodity)}>{(['All crops', 'Rice', 'Corn', 'Coconut', 'Banana', 'Sugarcane'] as Commodity[]).map((item) => <option key={item}>{item}</option>)}</select></label><label>Region<select value={region} onChange={(event) => setRegion(event.target.value as Region)}>{(['All regions', 'Luzon', 'Visayas', 'Mindanao'] as Region[]).map((item) => <option key={item}>{item}</option>)}</select></label><label>Time period<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 8 months</option><option>Last 12 months</option><option>This year</option></select></label><button className="clear-button" onClick={() => { setCommodity('All crops'); setRegion('All regions') }}>Clear</button></section>

        <section className="panel calculator-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Pricing calculator</span>
              <h2>Margin analysis</h2>
            </div>
            <span className="calculator-status">Live model</span>
          </div>

          <div className="calculator-grid">
            <div className="calculator-form">
              <label>
                Selling price / kg
                <div className="input-with-prefix">
                  <span>₱</span>
                  <input type="number" min="0" step="0.1" value={46.5} readOnly />
                </div>
              </label>
              <label>
                Yield volume (kg)
                <input type="number" min="0" step="10" value={1200} readOnly />
              </label>
              <label>
                Production cost / kg
                <div className="input-with-prefix">
                  <span>₱</span>
                  <input type="number" min="0" step="0.1" value={31.2} readOnly />
                </div>
              </label>
              <label>
                Logistics / kg
                <div className="input-with-prefix">
                  <span>₱</span>
                  <input type="number" min="0" step="0.1" value={5.8} readOnly />
                </div>
              </label>
              <label>
                Packaging / kg
                <div className="input-with-prefix">
                  <span>₱</span>
                  <input type="number" min="0" step="0.1" value={4.1} readOnly />
                </div>
              </label>
              <label>
                Target margin %
                <input type="number" min="0" max="100" step="0.5" value={18} readOnly />
              </label>
            </div>

            <div className="calculator-results">
              <div className="result-box">
                <span>Net margin</span>
                <strong>₱5.40</strong>
              </div>
              <div className="result-box">
                <span>Revenue</span>
                <strong>₱55,800</strong>
              </div>

              <div className="calculation-breakdown">
                <div className="breakdown-heading">Breakdown</div>
                <div className="breakdown-row"><span>Price per kilo</span><strong>₱46.50</strong></div>
                <div className="breakdown-row"><span>Profit per kilo</span><strong>₱5.40</strong></div>
                <div className="breakdown-row"><span>Break-even</span><strong>₱41.10</strong></div>
                <div className="breakdown-row total"><span>Cost-based</span><strong>₱49.83</strong></div>
              </div>

              <div className="decision-box">
                Recommended pricing remains above the break-even threshold and supports a healthy margin for the current market cycle.
              </div>
            </div>
          </div>
        </section>

        <section className="kpi-grid"><article className="kpi-card accent"><div className="card-top"><span>Avg. farmgate price</span><span className="trend-pill up">+6.8%</span></div><strong>₱{avgMarketPrice || 36}<span className="unit">/ kg</span></strong><small>Across 38 monitored markets</small><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article><article className="kpi-card"><div className="card-top"><span>Trading volume</span><span className="trend-pill up">+12.4%</span></div><strong>24,680<span className="unit"> sacks</span></strong><small>Reported in the last 30 days</small><div className="volume-line" /></article><article className="kpi-card"><div className="card-top"><span>Markets tracked</span><span className="trend-pill neutral">+4 new</span></div><strong>38</strong><small>Across 3 major island groups</small><div className="market-dots"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article><article className="kpi-card alert-card"><div className="card-top"><span>Signals to watch</span><span className="alert-dot" /></div><strong>03</strong><small>Requires attention today</small><button className="text-button">Review signals <span>-&gt;</span></button></article></section>

        <section className="dashboard-grid"><article className="panel trend-panel" id="trends"><div className="panel-header"><div><span className="section-kicker">Market pulse</span><h2>Price movement</h2></div><div className="legend"><span className="legend-line" /> Average price <span className="legend-dash" /> Forecast</div></div><div className="chart-meta"><strong>₱{Math.round(trend.reduce((sum, value) => sum + value, 0) / trend.length)} / kg</strong><span className="green-text">+6.8% vs last period</span></div><div className="chart"><div className="y-axis"><span>₱60</span><span>₱50</span><span>₱40</span><span>₱30</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Average agricultural crop price trend"><polyline points={points} fill="none" stroke="#317a5b" strokeWidth="1.8" vectorEffect="non-scaling-stroke" /><polyline points="88,34 100,31" fill="none" stroke="#b9c6bd" strokeWidth="1.3" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />{trend.map((value, index) => <circle key={value + index} cx={(index / (trend.length - 1)) * 100} cy={92 - ((value - minTrend) / (maxTrend - minTrend || 1)) * 70} r="1.5" fill="#f7f8f3" stroke="#317a5b" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}</svg><div className="x-axis">{months.map((month) => <span key={month}>{month}</span>)}</div></div></div><div className="chart-note"><span className="note-badge">i</span> Price momentum remains positive, led by rice and banana in major agricultural markets.</div></article>

          <article className="panel comparison-panel"><div className="panel-header"><div><span className="section-kicker">By island group</span><h2>Regional comparison</h2></div><button className="panel-menu" aria-label="More options">...</button></div><div className="comparison-list">{[['Luzon', 72, '₱46'], ['Visayas', 61, '₱33'], ['Mindanao', 48, '₱41'], ['Metro', 35, '₱31']].map(([name, width, price]) => <div className="comparison-row" key={name as string}><div className="row-label"><strong>{name}</strong><span>{price}</span></div><div className="bar-track"><div className={`bar-fill ${name === 'Luzon' ? 'highlight' : ''}`} style={{ width: `${width}%` }} /></div><small>{name === 'Luzon' ? '+9.2%' : name === 'Visayas' ? '+7.1%' : name === 'Mindanao' ? '+4.8%' : '+2.6%'}</small></div>)}</div><button className="link-button">View regional breakdown <span>-&gt;</span></button></article></section>

        <section className="panel market-panel" id="markets"><div className="panel-header"><div><span className="section-kicker">Live monitoring</span><h2>Market watchlist</h2></div><button className="link-button">View all markets <span>-&gt;</span></button></div><div className="table-wrap"><table><thead><tr><th>Market</th><th>Crop</th><th>Region</th><th>Price / kg</th><th>Change</th><th>Volume</th><th>Status</th></tr></thead><tbody>{filteredMarkets.map((market) => <tr key={market.name}><td><strong>{market.name}</strong></td><td>{market.commodity}</td><td><span className="region-label"><i /> {market.region}</span></td><td><strong>₱{market.price}</strong></td><td className={market.change >= 0 ? 'green-text' : 'red-text'}>{market.change >= 0 ? '+' : ''}{market.change}%</td><td>{market.volume}</td><td><span className={`status ${market.status.toLowerCase()}`}><i /> {market.status}</span></td></tr>)}</tbody></table>{filteredMarkets.length === 0 && <div className="empty-state">No markets match the selected filters.</div>}</div></section>
        <footer>Data refreshes every 15 minutes <span>Last updated 09:42 PHT</span></footer>
      </main>
    </div>
  )
}

export default App
