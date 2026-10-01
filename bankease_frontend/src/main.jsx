import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Clipboard,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FileDown,
  FileText,
  Filter,
  Gauge,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'
import './styles.css'
import { api, getUser, login, logout, register } from './api'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const compactMoney = (value) => {
  const num = Number(value || 0)
  if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`
  if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  if (Math.abs(num) >= 1000) return `₹${(num / 1000).toFixed(1)}K`
  return money(num)
}

const formatDate = (value) => value
    ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

const formatTime = (value) => value
    ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '—'

const monthLabel = (offset = 0) => {
  const date = new Date()
  date.setMonth(date.getMonth() + offset)
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

const statusClass = (value = '') => String(value).toLowerCase().replaceAll('_', '-')

function cx(...names) {
  return names.filter(Boolean).join(' ')
}

function makeId(prefix = 'REQ') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function App() {
  const [session, setSession] = useState(getUser())

  useEffect(() => {
    const handleLogout = () => setSession(null)
    window.addEventListener('bankease:logout', handleLogout)
    return () => window.removeEventListener('bankease:logout', handleLogout)
  }, [])

  return (
      <BrowserRouter>
        {!session ? (
            <LoginPage onLoggedIn={setSession} />
        ) : session.role === 'ADMIN' ? (
            <AdminApp user={session} onLogout={() => { logout(); setSession(null) }} />
        ) : (
            <CustomerApp user={session} onLogout={() => { logout(); setSession(null) }} />
        )}
      </BrowserRouter>
  )
}

function LoginPage({ onLoggedIn }) {
  const [mode, setMode] = useState('login')
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const signup = mode === 'signup'

  function switchMode(next) {
    setMode(next)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')

    try {
      if (!signup) {
        const data = await login(email.trim(), password)
        onLoggedIn({
          id: data.id,
          fullname: data.fullname,
          email: data.email,
          role: data.role,
          status: data.status,
        })
        return
      }

      if (fullname.trim().length < 2) throw new Error('Enter your full name.')
      if (!/^[0-9]{10}$/.test(phone.trim())) throw new Error('Enter a valid 10-digit phone number.')
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error('Enter a valid email address.')
      if (password.length < 8) throw new Error('Password must be at least 8 characters.')
      if (password !== confirmPassword) throw new Error('Passwords do not match.')

      await register(fullname.trim(), email.trim(), phone.trim(), password)
      setSuccess('Account created. Sign in to enter your BankEase workspace.')
      setMode('login')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
      <div className="auth-shell">
        <div className="auth-grid" />
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />

        <section className="auth-panel">
          <div className="brand-lockup large">
            <BrandMark />
            <div><strong>BankEase</strong><span>NextGen Net Banking</span></div>
          </div>

          <div className="auth-copy">
            <span className="eyebrow"><Sparkles size={15} /> Private digital banking</span>
            <h1>{signup ? <>Your money, <span>your command.</span></> : <>Banking with a <span>clearer view.</span></>}</h1>
            <p>
              {signup
                  ? 'Create one secure workspace for balances, transfers, bills and credit — without the clutter.'
                  : 'Balances, movement, lending and administration arranged like a working banking desk rather than a generic dashboard.'}
            </p>
            <div className="auth-command-row">
              <span className="command-orb"><ArrowLeftRight size={17} /></span>
              <span>Every money movement gets a traceable request identity.</span>
            </div>
          </div>

          <div className="auth-benefits">
            <Benefit icon={<ShieldCheck size={18} />} title="Role-aware access" text="Customer and admin workspaces remain separated." />
            <Benefit icon={<WalletCards size={18} />} title="Financial cockpit" text="Balances and movement remain visible without noise." />
            <Benefit icon={<BadgeCheck size={18} />} title="Traceable operations" text="Critical administrative actions are recorded." />
          </div>
        </section>

        <form className="login-card" onSubmit={submit}>
          <div className="login-card-head">
            <div>
              <span className="kicker">{signup ? 'NEW CUSTOMER' : 'SECURE ACCESS'}</span>
              <h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
              <p>{signup ? 'Set up your customer profile.' : 'Sign in to your BankEase workspace.'}</p>
            </div>
            <div className="secure-chip"><ShieldCheck size={15} /> Protected</div>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          {signup && (
              <>
                <Field label="Full name" value={fullname} onChange={setFullname} placeholder="Your full name" autoComplete="name" required />
                <Field label="Phone number" value={phone} onChange={setPhone} placeholder="10-digit mobile number" inputMode="numeric" maxLength="10" autoComplete="tel" required />
              </>
          )}

          <Field label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" autoComplete="email" required />

          <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              setVisible={setShowPassword}
              placeholder="Enter your password"
              autoComplete={signup ? 'new-password' : 'current-password'}
          />

          {signup && (
              <PasswordField
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  visible={showPassword}
                  setVisible={setShowPassword}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
              />
          )}

          <button className="primary-button full" disabled={busy}>
            {busy ? <><Spinner /> {signup ? 'Creating account…' : 'Signing in…'}</> : <>{signup ? 'Create account' : 'Enter workspace'} <ChevronRight size={18} /></>}
          </button>

          <div className="auth-switch">
            <span>{signup ? 'Already have an account?' : 'New to BankEase?'}</span>
            <button type="button" className="text-button" onClick={() => switchMode(signup ? 'login' : 'signup')}>
              {signup ? 'Sign in' : 'Create an account'}
            </button>
          </div>

          <div className="login-foot">
            <span><BadgeCheck size={14} /> Protected session</span>
            <span>{signup ? 'BCrypt password hashing' : 'JWT session'}</span>
          </div>
        </form>
      </div>
  )
}

function CustomerApp({ user, onLogout }) {
  return <AppShell user={user} role="CUSTOMER" onLogout={onLogout} />
}

function AdminApp({ user, onLogout }) {
  return <AppShell user={user} role="ADMIN" onLogout={onLogout} />
}

const customerNav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: WalletCards },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/bills', label: 'Bills & Pay', icon: Receipt },
  { to: '/loans', label: 'Loans', icon: Landmark },
  { to: '/activity', label: 'Activity', icon: Gauge },
  { to: '/statement', label: 'Statement', icon: FileText },
]

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: UsersRound },
  { to: '/admin/accounts', label: 'Accounts', icon: WalletCards },
  { to: '/admin/billers', label: 'Billers', icon: Building2 },
  { to: '/admin/loans', label: 'Loan Desk', icon: FileCheck2 },
  { to: '/admin/audit', label: 'Audit Center', icon: ShieldCheck },
]

function AppShell({ user, role, onLogout }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const navItems = role === 'ADMIN' ? adminNav : customerNav
  const location = useLocation()
  const navigate = useNavigate()
  const commandRef = useRef(null)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(v => !v)
      }
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        event.preventDefault()
        setCommandOpen(true)
      }
      if (event.key === 'Escape') {
        setCommandOpen(false)
        setNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (commandOpen) setTimeout(() => commandRef.current?.focus(), 0)
  }, [commandOpen])

  const title = useMemo(() => {
    const exact = navItems.find(item => item.to === location.pathname)
    if (exact) return exact.label
    if (location.pathname.startsWith('/accounts')) return 'Accounts'
    if (location.pathname.startsWith('/loans')) return 'Loans'
    if (location.pathname.startsWith('/admin/')) return 'Admin'
    return role === 'ADMIN' ? 'Command Center' : 'Overview'
  }, [location.pathname, navItems, role])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function go(path) {
    navigate(path)
    setCommandOpen(false)
    setMobileOpen(false)
  }

  function submitGlobalSearch(event) {
    event.preventDefault()
    if (!search.trim()) return
    navigate(role === 'ADMIN' ? `/admin/audit?q=${encodeURIComponent(search.trim())}` : `/activity?q=${encodeURIComponent(search.trim())}`)
    setMobileOpen(false)
  }

  return (
      <div className="app-shell">
        {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

        <aside className={cx('sidebar', collapsed && 'collapsed', mobileOpen && 'mobile-open')}>
          <div className="sidebar-top">
            <div className="brand-lockup compact">
              <BrandMark />
              <div className="brand-text"><strong>BankEase</strong><span>Banking OS</span></div>
            </div>
            <button className="collapse-button" onClick={() => setCollapsed(v => !v)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          <div className="workspace-label">{role === 'ADMIN' ? 'COMMAND CENTER' : 'PERSONAL BANKING'}</div>

          <nav className="main-nav">
            {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/' || to === '/admin'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cx('nav-link', isActive && 'active')}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{label}</span>
                </NavLink>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <SupportCard />
            <div className="trust-card">
              <div className="trust-icon"><ShieldCheck size={17} /></div>
              <div><strong>Secure by design</strong><span>Protected API session</span></div>
            </div>
            <button className="nav-link subtle" onClick={onLogout}><LogOut size={19} /><span>Sign out</span></button>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="topbar-title">
              <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)}><Menu size={21} /></button>
              <div><span className="muted-label">BANKEASE / {role}</span><h1>{title}</h1></div>
            </div>

            <div className="topbar-actions">
              <form className="global-search" onSubmit={submitGlobalSearch}>
                <Search size={17} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={role === 'ADMIN' ? 'Search audit records…' : 'Search activity…'} />
                <kbd>/</kbd>
              </form>

              <div className="notify-wrap">
                <button className="round-button" title="Notifications" onClick={() => setNotificationsOpen(v => !v)}>
                  <Bell size={18} />
                  {role === 'ADMIN' && <span className="notification-dot" />}
                </button>
                {notificationsOpen && <NotificationPopover role={role} onNavigate={go} />}
              </div>

              <button className="profile-pill" onClick={() => go(role === 'ADMIN' ? '/admin/users' : '/accounts')}>
                <Avatar name={user.fullname} />
                <div className="profile-copy"><strong>{user.fullname}</strong><span>{user.role}</span></div>
                <ChevronRight size={16} className="profile-arrow" />
              </button>
            </div>
          </header>

          <div className="content-wrap">
            <Routes>
              {role === 'CUSTOMER' ? (
                  <>
                    <Route path="/" element={<CustomerOverview user={user} toast={showToast} />} />
                    <Route path="/accounts" element={<CustomerAccounts toast={showToast} />} />
                    <Route path="/transfer" element={<TransferPage toast={showToast} />} />
                    <Route path="/bills" element={<BillsPage toast={showToast} />} />
                    <Route path="/loans" element={<LoansPage toast={showToast} />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="/statement" element={<StatementPage toast={showToast} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </>
              ) : (
                  <>
                    <Route path="/admin" element={<AdminOverview />} />
                    <Route path="/admin/users" element={<AdminUsers toast={showToast} />} />
                    <Route path="/admin/accounts" element={<AdminAccounts toast={showToast} />} />
                    <Route path="/admin/billers" element={<AdminBillers toast={showToast} />} />
                    <Route path="/admin/loans" element={<AdminLoans toast={showToast} />} />
                    <Route path="/admin/audit" element={<AdminAudit />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </>
              )}
            </Routes>
          </div>
        </main>

        {commandOpen && (
            <CommandPalette
                ref={commandRef}
                role={role}
                query={search}
                setQuery={setSearch}
                onClose={() => setCommandOpen(false)}
                onNavigate={go}
            />
        )}

        {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      </div>
  )
}

function SupportCard() {
  return (
      <div className="support-card">
        <div className="support-mark">?</div>
        <div className="support-card-content">
          <span className="support-kicker">CONTACT SUPPORT</span>
          <strong>Need a hand?</strong>
          <a href="mailto:aryanmishra1182@gmail.com">aryanmishra1182@gmail.com</a>
          <a href="tel:+918318560337">+91 83185 60337</a>
        </div>
      </div>
  )
}

function NotificationPopover({ role, onNavigate }) {
  return (
      <div className="notification-popover">
        <div className="popover-head">
          <div><span className="kicker">WORKSPACE SIGNALS</span><strong>{role === 'ADMIN' ? 'Operations' : 'Your workspace'}</strong></div>
          <span className="live-dot">LIVE</span>
        </div>

        {role === 'ADMIN' ? (
            <>
              <button className="popover-item" onClick={() => onNavigate('/admin/loans')}><FileCheck2 size={17} /><div><strong>Loan queue</strong><span>Review pending applications</span></div><ChevronRight size={15} /></button>
              <button className="popover-item" onClick={() => onNavigate('/admin/audit')}><ShieldCheck size={17} /><div><strong>Audit center</strong><span>Inspect administrative actions</span></div><ChevronRight size={15} /></button>
            </>
        ) : (
            <>
              <button className="popover-item" onClick={() => onNavigate('/statement')}><FileText size={17} /><div><strong>Statement</strong><span>Prepare a printable account statement</span></div><ChevronRight size={15} /></button>
              <button className="popover-item" onClick={() => onNavigate('/loans')}><Landmark size={17} /><div><strong>Loan desk</strong><span>Applications and repayments</span></div><ChevronRight size={15} /></button>
            </>
        )}
      </div>
  )
}

const CommandPalette = React.forwardRef(function CommandPalette({ role, query, setQuery, onClose, onNavigate }, ref) {
  const items = role === 'ADMIN' ? adminNav : customerNav
  const filtered = items.filter(item => `${item.label} ${item.to}`.toLowerCase().includes(query.toLowerCase()))

  return (
      <div className="command-backdrop" onMouseDown={onClose}>
        <div className="command-palette" onMouseDown={e => e.stopPropagation()}>
          <div className="command-input-row">
            <Search size={18} />
            <input ref={ref} value={query} onChange={e => setQuery(e.target.value)} placeholder="Jump to a workspace…" />
            <kbd>ESC</kbd>
          </div>
          <div className="command-section">
            <span>GO TO</span>
            {filtered.length ? filtered.map(({ to, label, icon: Icon }) => (
                <button key={to} className="command-item" onClick={() => onNavigate(to)}>
                  <span className="command-icon"><Icon size={17} /></span>
                  <span>{label}</span>
                  <ChevronRight size={15} />
                </button>
            )) : <div className="command-empty">No destination matches “{query}”.</div>}
          </div>
          <div className="command-foot"><span>Ctrl / ⌘ K</span><span>Navigation</span><span>/</span><span>Search</span></div>
        </div>
      </div>
  )
})

function CustomerOverview({ user, toast }) {
  const [state, setState] = useState({ accounts: [], transactions: [], loans: [], bills: [], loading: true })
  const [hideBalances, setHideBalances] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showAllActivity, setShowAllActivity] = useState(false)

  async function load() {
    setState(s => ({ ...s, loading: true }))
    const results = await Promise.allSettled([
      api.get('/accounts'),
      api.get('/transactions'),
      api.get('/loans'),
      api.get('/bills/payments'),
    ])

    const next = {
      accounts: results[0].status === 'fulfilled' ? results[0].value : [],
      transactions: results[1].status === 'fulfilled' ? results[1].value : [],
      loans: results[2].status === 'fulfilled' ? results[2].value : [],
      bills: results[3].status === 'fulfilled' ? results[3].value : [],
      loading: false,
    }

    if (results.some(result => result.status === 'rejected')) {
      toast('Some dashboard data could not be loaded.', 'error')
    }

    setState(next)
  }

  useEffect(() => { load() }, [])

  const derived = useMemo(() => deriveFinance(state.accounts, state.transactions, state.bills, state.loans), [state])

  if (state.loading) return <LoadingPage label="Assembling your financial cockpit…" />

  const firstName = (user.fullname || 'there').split(' ')[0]
  const visibleActivity = derived.activity.slice(0, showAllActivity ? 9 : 5)

  return (
      <div className="page-stack">
        <PageHeader
            eyebrow="PERSONAL FINANCE"
            title={`Good morning, ${firstName}.`}
            description="A live view of your balance, current-month movement and credit position."
            action={(
                <div className="header-actions">
                  <button className="ghost-button" onClick={() => setHideBalances(v => !v)}>
                    {hideBalances ? <Eye size={16} /> : <EyeOff size={16} />}
                    {hideBalances ? 'Show balances' : 'Hide balances'}
                  </button>
                  <button className="ghost-button" onClick={load}><RefreshCw size={16} /> Refresh</button>
                </div>
            )}
        />

        <div className="hero-grid">
          <div className="balance-card">
            <div className="balance-card-noise" />
            <div className="balance-top">
              <span>Total available balance</span>
              <div className="balance-chip"><BadgeCheck size={14} /> LIVE</div>
            </div>
            <div className="balance-amount">{hideBalances ? '₹ ••••••••' : money(derived.totalBalance)}</div>
            <div className="balance-footer">
              <span><WalletCards size={15} /> {derived.activeAccounts} active account{derived.activeAccounts !== 1 ? 's' : ''}</span>
              <span>Updated {formatTime(new Date())}</span>
            </div>
            <MiniFlowChart values={derived.activity.slice(0, 8).map(item => item.amount).reverse()} />
          </div>

          <div className="insight-card">
            <div className="insight-head">
              <div className="insight-icon"><Sparkles size={18} /></div>
              <div><span className="kicker">CURRENT MONTH</span><h3>{monthLabel(0)}</h3></div>
            </div>
            <p>This snapshot is calculated from the activity currently exposed by your BankEase accounts, transfers and bill payments.</p>
            <div className="flow-split">
              <div><span>Money in</span><strong className="positive">+{compactMoney(derived.monthIncoming)}</strong></div>
              <div><span>Money out</span><strong className="negative">−{compactMoney(derived.monthOutgoing)}</strong></div>
            </div>
            <div className="insight-metric"><span>Net movement</span><strong className={derived.monthNet >= 0 ? 'positive' : 'negative'}>{derived.monthNet >= 0 ? '+' : '−'}{compactMoney(Math.abs(derived.monthNet))}</strong></div>
            <div className="insight-metric"><span>Loan outstanding</span><strong>{compactMoney(derived.outstanding)}</strong></div>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard label="Available balance" value={hideBalances ? '••••' : compactMoney(derived.totalBalance)} meta={`${derived.activeAccounts} active accounts`} icon={<CircleDollarSign size={18} />} />
          <StatCard label="Money received" value={compactMoney(derived.monthIncoming)} meta="This month" icon={<ArrowDownLeft size={18} />} />
          <StatCard label="Money out" value={compactMoney(derived.monthOutgoing)} meta="This month" icon={<ArrowUpRight size={18} />} />
          <StatCard label="Loan outstanding" value={compactMoney(derived.outstanding)} meta={derived.activeLoans.length ? `${derived.activeLoans.length} active loan(s)` : 'No active loans'} icon={<Landmark size={18} />} />
        </div>

        <div className="quick-actions-row">
          <QuickAction icon={<ArrowLeftRight size={18} />} title="Transfer" text="Move funds" href="/transfer" />
          <QuickAction icon={<Receipt size={18} />} title="Pay a bill" text="Utilities & services" href="/bills" />
          <QuickAction icon={<FileText size={18} />} title="Statement" text="View account activity" href="/statement" />
          <QuickAction icon={<Landmark size={18} />} title="Loan desk" text="Credit & repayments" href="/loans" />
        </div>

        <div className="split-grid">
          <div className="panel">
            <SectionTitle title="Recent movement" action={<button className="text-link" onClick={() => setShowAllActivity(v => !v)}>{showAllActivity ? 'Collapse' : 'View all'}</button>} />
            {visibleActivity.length ? <div className="activity-list">{visibleActivity.map((item, index) => <ActivityRow key={`${item.key}-${index}`} item={item} />)}</div> : <EmptyState icon={<Gauge size={25} />} title="No activity yet" text="Transfers and bill payments will appear here once they happen." />}
          </div>

          <div className="panel">
            <SectionTitle title="Accounts at a glance" action={<span className="muted-count">{state.accounts.length} total</span>} />
            <div className="account-mini-list">
              {state.accounts.map(account => <AccountMini key={account.id} account={account} hidden={hideBalances} onClick={() => setSelectedAccount(account)} />)}
              {!state.accounts.length && <EmptyState icon={<WalletCards size={25} />} title="No accounts" text="Open your first BankEase account." />}
            </div>
          </div>
        </div>

        {selectedAccount && (
            <AccountDetailModal
                account={selectedAccount}
                transactions={state.transactions}
                bills={state.bills}
                ownAccounts={derived.ownAccounts}
                hidden={hideBalances}
                onClose={() => setSelectedAccount(null)}
                onToast={toast}
            />
        )}
      </div>
  )
}

function deriveFinance(accounts, transactions, bills, loans) {
  const ownAccounts = accounts.map(a => String(a.accountNumber))
  const own = new Set(ownAccounts)
  const activity = buildActivity(transactions, bills, ownAccounts)
  const incoming = transactions
      .filter(t => own.has(String(t.receiverAccountNumber)) && !own.has(String(t.senderAccountNumber)))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const outgoingTransfers = transactions
      .filter(t => own.has(String(t.senderAccountNumber)))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const billTotal = bills.reduce((sum, b) => sum + Number(b.amount || 0), 0)
  const activeLoans = loans.filter(l => l.status === 'ACTIVE')
  const outstanding = activeLoans.reduce((sum, l) => sum + Number(l.outstandingAmount || 0), 0)
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const monthActivity = activity.filter(item => new Date(item.date).getTime() >= monthStart.getTime())
  const monthIncoming = monthActivity.filter(item => item.direction === 'in').reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const monthOutgoing = monthActivity.filter(item => item.direction === 'out').reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return {
    ownAccounts,
    incoming,
    outgoing: outgoingTransfers + billTotal,
    monthIncoming,
    monthOutgoing,
    monthNet: monthIncoming - monthOutgoing,
    activeAccounts: accounts.filter(a => a.status === 'ACTIVE').length,
    activeLoans,
    outstanding,
    activity,
    totalBalance: accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0),
  }
}

function QuickAction({ icon, title, text, href }) {
  const navigate = useNavigate()
  return (
      <button className="quick-action" onClick={() => navigate(href)}>
        <span className="quick-action-icon">{icon}</span>
        <span><strong>{title}</strong><small>{text}</small></span>
        <ChevronRight size={17} />
      </button>
  )
}

function CustomerAccounts({ toast }) {
  const [accounts, setAccounts] = useState([])
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(null)
  const [type, setType] = useState('SAVINGS')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function load() {
    setAccounts(await api.get('/accounts'))
  }

  useEffect(() => { load().catch(err => toast(err.message, 'error')) }, [])

  async function createAccount(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const saved = await api.post('/accounts', { accountType: type })
      setAccounts(prev => [...prev, saved])
      setOpen(false)
      toast('New account created successfully.')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function copy(value) {
    try {
      await navigator.clipboard.writeText(String(value))
      toast('Account number copied.')
    } catch {
      toast('Copy is unavailable in this browser.', 'error')
    }
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="ACCOUNTS" title="Your accounts" description="Balances, account status and statement access in one place." action={<button className="primary-button" onClick={() => setOpen(true)}><Plus size={18} /> Open account</button>} />

        <div className="account-grid account-grid-premium">
          {accounts.map(account => (
              <AccountCard
                  key={account.id}
                  account={account}
                  onCopy={copy}
                  onDetails={() => setDetails(account)}
                  onStatement={() => navigate('/statement')}
              />
          ))}
          {!accounts.length && <EmptyState icon={<WalletCards size={26} />} title="No accounts yet" text="Open a savings or current account to get started." />}
        </div>

        <div className="accounts-note">
          <ShieldCheck size={18} />
          <div><strong>Ownership stays server-side.</strong><span>Only accounts returned for the authenticated customer are shown here.</span></div>
        </div>

        {open && (
            <Modal title="Open a new account" onClose={() => !busy && setOpen(false)}>
              <form className="form-stack" onSubmit={createAccount}>
                <FieldSelect label="Account type" value={type} onChange={setType} options={['SAVINGS', 'CURRENT']} />
                <div className="info-box"><ShieldCheck size={17} /><span>New accounts start active with a zero balance.</span></div>
                <button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <Plus size={18} />} Create account</button>
              </form>
            </Modal>
        )}

        {details && <SimpleAccountModal account={details} onCopy={copy} onClose={() => setDetails(null)} onStatement={() => navigate('/statement')} />}
      </div>
  )
}

function TransferPage({ toast }) {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ senderAccountNumber: '', receiverAccountNumber: '', amount: '', remarks: '' })
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(1)

  useEffect(() => {
    api.get('/accounts').then(data => {
      setAccounts(data)
      const active = data.find(a => a.status === 'ACTIVE')
      if (active) setForm(current => ({ ...current, senderAccountNumber: active.accountNumber }))
    }).catch(err => toast(err.message, 'error'))
  }, [])

  const sender = accounts.find(a => String(a.accountNumber) === String(form.senderAccountNumber))
  const amount = Number(form.amount || 0)

  function review(event) {
    event.preventDefault()
    if (!sender || !form.receiverAccountNumber || amount <= 0) {
      toast('Complete the transfer details first.', 'error')
      return
    }
    if (String(sender.accountNumber) === String(form.receiverAccountNumber)) {
      toast('Sender and receiver accounts cannot be the same.', 'error')
      return
    }
    setStep(2)
  }

  async function submit() {
    setBusy(true)
    try {
      const data = await api.post('/transactions/transfer', {
        ...form,
        amount,
        idempotencyKey: makeId('TRF'),
      })
      setResult(data)
      toast('Transfer completed successfully.')
      setStep(3)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    setResult(null)
    setStep(1)
    setForm(current => ({ ...current, receiverAccountNumber: '', amount: '', remarks: '' }))
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="MONEY MOVEMENT" title="Transfer money" description="A deliberate review-before-submit flow for moving funds between accounts." />
        <div className="journey-steps"><StepPill number="01" label="Details" active={step === 1} done={step > 1} /><StepPill number="02" label="Review" active={step === 2} done={step > 2} /><StepPill number="03" label="Complete" active={step === 3} done={step === 3} /></div>

        {step === 1 && (
            <div className="transfer-layout">
              <div className="panel transfer-form-panel">
                <div className="step-head"><span className="step-badge">01</span><div><strong>Transfer details</strong><span>Ownership, status and balance are checked by the backend.</span></div></div>
                <form className="form-stack" onSubmit={review}>
                  <FieldSelect label="From account" value={form.senderAccountNumber} onChange={value => setForm({ ...form, senderAccountNumber: value })} options={accounts.filter(a => a.status === 'ACTIVE').map(a => `${a.accountNumber} — ${a.accountType} (${money(a.balance)})`)} values={accounts.filter(a => a.status === 'ACTIVE').map(a => a.accountNumber)} placeholder="Choose account" required />
                  <Field label="Receiver account number" value={form.receiverAccountNumber} onChange={value => setForm({ ...form, receiverAccountNumber: value })} placeholder="12-digit account number" inputMode="numeric" maxLength="12" required />
                  <div className="two-col">
                    <Field label="Amount" value={form.amount} onChange={value => setForm({ ...form, amount: value })} placeholder="₹ 0.00" type="number" min="0.01" step="0.01" required />
                    <Field label="Remarks" value={form.remarks} onChange={value => setForm({ ...form, remarks: value })} placeholder="Optional note" />
                  </div>
                  <div className="transfer-summary"><div><span>Available</span><strong>{sender ? money(sender.balance) : '—'}</strong></div><ArrowUpRight size={20} /><div className="summary-end"><span>Sending</span><strong>{amount ? money(amount) : '—'}</strong></div></div>
                  <button className="primary-button full" disabled={!sender}>Review transfer <ArrowUpRight size={18} /></button>
                </form>
              </div>
              <TransferProtocol />
            </div>
        )}

        {step === 2 && (
            <div className="panel review-shell">
              <div className="step-head"><span className="step-badge">02</span><div><strong>Confirm the movement</strong><span>No funds are debited until you confirm.</span></div></div>
              <div className="review-transfer-amount"><span>You're sending</span><strong>{money(amount)}</strong></div>
              <div className="review-grid"><Detail label="From account" value={form.senderAccountNumber} /><Detail label="Receiver" value={form.receiverAccountNumber} /><Detail label="Remarks" value={form.remarks || '—'} /><Detail label="Request identity" value="Generated on submit" /></div>
              <div className="review-actions"><button className="ghost-button" onClick={() => setStep(1)} disabled={busy}>Back</button><button className="primary-button" onClick={submit} disabled={busy}>{busy ? <><Spinner /> Processing…</> : <><Check size={18} /> Confirm transfer</>}</button></div>
            </div>
        )}

        {step === 3 && result && (
            <div className="completion-panel panel">
              <div className="completion-orbit"><Check size={32} /></div>
              <span className="kicker">TRANSFER COMPLETE</span>
              <h2>Money moved successfully.</h2>
              <p>{result.transactionReference} · {money(result.amount)} · {formatDate(result.createdAt)} {formatTime(result.createdAt)}</p>
              <div className="completion-grid"><Detail label="Sender" value={result.senderAccountNumber} /><Detail label="Receiver" value={result.receiverAccountNumber} /><Detail label="Status" value={result.transactionStatus} /><Detail label="Reference" value={result.transactionReference} /></div>
              <div className="review-actions"><button className="primary-button" onClick={reset}><ArrowLeftRight size={18} /> Make another transfer</button></div>
            </div>
        )}
      </div>
  )
}

function TransferProtocol() {
  return (
      <div className="panel transfer-side">
        <div className="side-illustration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="transfer-symbol"><ArrowLeftRight size={30} /></div></div>
        <span className="kicker">BANK-EASE PROTOCOL</span>
        <h3>Retries without duplicate charges.</h3>
        <p>Each transfer receives a unique idempotency key and the backend locks the account rows before balances change.</p>
        <div className="check-row"><Check size={16} /> Sender ownership is verified</div>
        <div className="check-row"><Check size={16} /> Account status is verified</div>
        <div className="check-row"><Check size={16} /> Balance is checked server-side</div>
      </div>
  )
}

function BillsPage({ toast }) {
  const [billers, setBillers] = useState([])
  const [payments, setPayments] = useState([])
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ senderAccountNumber: '', billerId: '', consumerNumber: '', amount: '', remarks: '' })
  const [busy, setBusy] = useState(false)
  const [receipt, setReceipt] = useState(null)

  async function load() {
    const [b, p, a] = await Promise.all([api.get('/billers'), api.get('/bills/payments'), api.get('/accounts')])
    setBillers(b)
    setPayments(p)
    setAccounts(a)
    const active = a.find(item => item.status === 'ACTIVE')
    if (active) setForm(current => ({ ...current, senderAccountNumber: active.accountNumber }))
  }

  useEffect(() => { load().catch(err => toast(err.message, 'error')) }, [])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const data = await api.post('/bills/payments', {
        ...form,
        billerId: Number(form.billerId),
        amount: Number(form.amount),
        idempotencyKey: makeId('BILL'),
      })
      setReceipt(data)
      toast('Bill payment completed.')
      setPayments(await api.get('/bills/payments'))
      setForm(current => ({ ...current, consumerNumber: '', amount: '', remarks: '' }))
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="PAYMENTS" title="Bills & utilities" description="Pay active billers from your active accounts and keep the receipt trail nearby." action={<button className="ghost-button" onClick={() => load()}><RefreshCw size={16} /> Refresh</button>} />

        <div className="bills-layout">
          <div className="panel">
            <SectionTitle title="Pay a bill" action={<span className="muted-count">{billers.length} visible billers</span>} />
            <form className="form-stack" onSubmit={submit}>
              <FieldSelect label="Pay from" value={form.senderAccountNumber} onChange={value => setForm({ ...form, senderAccountNumber: value })} options={accounts.filter(a => a.status === 'ACTIVE').map(a => `${a.accountNumber} — ${a.accountType}`)} values={accounts.filter(a => a.status === 'ACTIVE').map(a => a.accountNumber)} placeholder="Choose account" required />
              <FieldSelect label="Biller" value={form.billerId} onChange={value => setForm({ ...form, billerId: value })} options={billers.filter(b => b.status === 'ACTIVE').map(b => `${b.id} — ${b.name} • ${b.category}`)} values={billers.filter(b => b.status === 'ACTIVE').map(b => String(b.id))} placeholder="Choose an active biller" required />
              <div className="two-col"><Field label="Consumer number" value={form.consumerNumber} onChange={value => setForm({ ...form, consumerNumber: value })} placeholder="Provider reference" required /><Field label="Amount" value={form.amount} onChange={value => setForm({ ...form, amount: value })} placeholder="₹ 0.00" type="number" min="0.01" step="0.01" required /></div>
              <Field label="Remarks" value={form.remarks} onChange={value => setForm({ ...form, remarks: value })} placeholder="Optional note" />
              <div className="info-box"><ShieldCheck size={18} /><span>Payments are protected by account ownership, balance checks and an idempotency key.</span></div>
              <button className="primary-button full" disabled={busy}>{busy ? <><Spinner /> Paying…</> : <><Receipt size={18} /> Pay now</>}</button>
            </form>
          </div>

          <div className="panel">
            <SectionTitle title="Available billers" action={<span className="muted-count">Active only</span>} />
            {billers.filter(b => b.status === 'ACTIVE').length ? (
                <div className="biller-list large">
                  {billers.filter(b => b.status === 'ACTIVE').map(biller => (
                      <div className="biller-item" key={biller.id}>
                        <div className="biller-avatar">{String(biller.name || 'B').slice(0, 2).toUpperCase()}</div>
                        <div><strong>{biller.name}</strong><span>{biller.category}</span></div>
                        <span className="status-pill active">LIVE</span>
                      </div>
                  ))}
                </div>
            ) : <EmptyState icon={<Building2 size={25} />} title="No active billers" text="An administrator needs to activate a service provider first." />}
          </div>
        </div>

        <div className="panel">
          <SectionTitle title="Payment history" action={<span className="muted-count">{payments.length} records</span>} />
          {payments.length ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Reference</th><th>Biller</th><th>Consumer</th><th>Amount</th><th>Date</th><th>Status</th><th /></tr></thead>
                  <tbody>
                  {payments.map(payment => (
                      <tr key={payment.id}>
                        <td><strong>{payment.paymentReference}</strong></td>
                        <td>{payment.billerName}</td>
                        <td>{payment.consumerNumber}</td>
                        <td>{money(payment.amount)}</td>
                        <td>{formatDate(payment.paidAt)}</td>
                        <td><span className={cx('status-pill', statusClass(payment.status))}>{payment.status}</span></td>
                        <td><button className="small-button" onClick={() => setReceipt(payment)}>Receipt</button></td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          ) : <EmptyState icon={<Receipt size={25} />} title="No bill payments" text="Completed bill payments will appear here." />}
        </div>

        {receipt && <BillReceiptModal payment={receipt} onClose={() => setReceipt(null)} />}
      </div>
  )
}

function LoansPage({ toast }) {
  const [applications, setApplications] = useState([])
  const [loans, setLoans] = useState([])
  const [showApply, setShowApply] = useState(false)
  const [applyForm, setApplyForm] = useState({ loanType: 'PERSONAL', requestedAmount: '', tenureMonths: '', purpose: '' })
  const [repay, setRepay] = useState(null)
  const [repaymentHistory, setRepaymentHistory] = useState(null)
  const [repaymentReceipt, setRepaymentReceipt] = useState(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    const [a, l] = await Promise.all([api.get('/loans/applications'), api.get('/loans')])
    setApplications(a)
    setLoans(l)
  }

  useEffect(() => { load().catch(err => toast(err.message, 'error')) }, [])

  async function apply(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await api.post('/loans/applications', {
        ...applyForm,
        requestedAmount: Number(applyForm.requestedAmount),
        tenureMonths: Number(applyForm.tenureMonths),
      })
      toast('Loan application submitted.')
      setShowApply(false)
      setApplyForm({ loanType: 'PERSONAL', requestedAmount: '', tenureMonths: '', purpose: '' })
      await load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function pay(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const data = await api.post(`/loans/${repay.loanReference}/repay`, {
        idempotencyKey: makeId('LREP'),
        amount: Number(repay.amount),
        remarks: repay.remarks,
      })
      setRepaymentReceipt(data)
      setRepay(null)
      toast('Loan repayment recorded.')
      await load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function openHistory(loan) {
    try {
      const data = await api.get(`/loans/${loan.loanReference}/repayments`)
      setRepaymentHistory({ loan, repayments: data })
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const outstanding = loans.reduce((sum, loan) => sum + Number(loan.outstandingAmount || 0), 0)

  return (
      <div className="page-stack">
        <PageHeader eyebrow="CREDIT & BORROWING" title="Loans" description="Follow every application through approval, disbursement and repayment." action={<div className="header-actions"><button className="ghost-button" onClick={load}><RefreshCw size={16} /> Refresh</button><button className="primary-button" onClick={() => setShowApply(true)}><Plus size={18} /> Apply for a loan</button></div>} />

        <div className="loan-kpi-grid">
          <StatCard label="Applications" value={applications.length} meta="Submitted to BankEase" icon={<FileText size={18} />} />
          <StatCard label="Active loans" value={loans.filter(l => l.status === 'ACTIVE').length} meta="Currently running" icon={<Landmark size={18} />} />
          <StatCard label="Outstanding" value={compactMoney(outstanding)} meta="Across your loans" icon={<CircleDollarSign size={18} />} />
        </div>

        <div className="split-grid">
          <div className="panel">
            <SectionTitle title="Application journey" action={<span className="muted-count">{applications.length} total</span>} />
            {applications.length ? (
                <div className="loan-journey-list">
                  {applications.map(application => (
                      <div className="loan-journey-card" key={application.id}>
                        <div className="loan-journey-head">
                          <div><strong>{application.loanType} loan</strong><span>{application.applicationReference}</span></div>
                          <span className={cx('status-pill', statusClass(application.status))}>{application.status}</span>
                        </div>
                        <div className="loan-journey-amount"><span>{application.approvedAmount ? 'Approved amount' : 'Requested amount'}</span><strong>{money(application.approvedAmount ?? application.requestedAmount)}</strong></div>
                        <LoanTimeline status={application.status} />
                        <div className="loan-journey-meta"><span>{application.tenureMonths} months</span><span>{formatDate(application.appliedAt)}</span><span>{application.purpose}</span></div>
                      </div>
                  ))}
                </div>
            ) : <EmptyState icon={<FileText size={25} />} title="No applications" text="Start an application when you need credit." />}
          </div>

          <div className="panel">
            <SectionTitle title="Active & closed loans" />
            <div className="loan-list">
              {loans.map(loan => (
                  <div className="loan-item" key={loan.id}>
                    <div className={cx('loan-icon', loan.status === 'ACTIVE' && 'active')}><Landmark size={18} /></div>
                    <div className="loan-main"><strong>{loan.loanType}</strong><span>{loan.loanReference}</span></div>
                    <div className="loan-meta">
                      <strong>{money(loan.outstandingAmount)}</strong>
                      <div className="row-actions"><button className="small-button" onClick={() => openHistory(loan)}>History</button><button className="small-button" disabled={loan.status !== 'ACTIVE'} onClick={() => setRepay({ loanReference: loan.loanReference, amount: '', remarks: '' })}>Repay</button></div>
                    </div>
                  </div>
              ))}
              {!loans.length && <EmptyState icon={<Landmark size={25} />} title="No loans" text="Approved and disbursed loans will appear here." />}
            </div>
          </div>
        </div>

        <div className="panel">
          <SectionTitle title="Loan portfolio" />
          <div className="loan-table">
            <div className="loan-row loan-header"><span>Reference</span><span>Type</span><span>Principal</span><span>Outstanding</span><span>Rate</span><span>Status</span></div>
            {loans.length ? loans.map(loan => (
                <div className="loan-row" key={loan.id}><span>{loan.loanReference}</span><span>{loan.loanType}</span><span>{money(loan.principalAmount)}</span><span>{money(loan.outstandingAmount)}</span><span>{loan.interestRate}%</span><span className={cx('status-pill', statusClass(loan.status))}>{loan.status}</span></div>
            )) : <EmptyState icon={<Landmark size={25} />} title="No loan portfolio" text="Disbursed loans become visible here." />}
          </div>
        </div>

        {showApply && (
            <Modal title="Apply for a loan" onClose={() => !busy && setShowApply(false)}>
              <form className="form-stack" onSubmit={apply}>
                <FieldSelect label="Loan type" value={applyForm.loanType} onChange={value => setApplyForm({ ...applyForm, loanType: value })} options={['PERSONAL', 'HOME', 'EDUCATION', 'VEHICLE']} />
                <div className="two-col"><Field label="Requested amount" value={applyForm.requestedAmount} onChange={value => setApplyForm({ ...applyForm, requestedAmount: value })} type="number" min="1" required /><Field label="Tenure (months)" value={applyForm.tenureMonths} onChange={value => setApplyForm({ ...applyForm, tenureMonths: value })} type="number" min="1" required /></div>
                <Field label="Purpose" value={applyForm.purpose} onChange={value => setApplyForm({ ...applyForm, purpose: value })} placeholder="What is the loan for?" required />
                <button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <FileCheck2 size={18} />} Submit application</button>
              </form>
            </Modal>
        )}

        {repay && (
            <Modal title={`Repay ${repay.loanReference}`} onClose={() => !busy && setRepay(null)}>
              <form className="form-stack" onSubmit={pay}>
                <Field label="Repayment amount" value={repay.amount} onChange={value => setRepay({ ...repay, amount: value })} type="number" min="0.01" step="0.01" required />
                <Field label="Remarks" value={repay.remarks} onChange={value => setRepay({ ...repay, remarks: value })} placeholder="Optional note" />
                <div className="info-box"><ShieldCheck size={18} /><span>The backend verifies ownership, status and the available balance before changing the loan.</span></div>
                <button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <CircleDollarSign size={18} />} Make repayment</button>
              </form>
            </Modal>
        )}

        {repaymentHistory && <RepaymentHistoryModal data={repaymentHistory} onClose={() => setRepaymentHistory(null)} />}
        {repaymentReceipt && <RepaymentReceiptModal repayment={repaymentReceipt} onClose={() => setRepaymentReceipt(null)} />}
      </div>
  )
}

function ActivityPage() {
  const location = useLocation()
  const initialQuery = new URLSearchParams(location.search).get('q') || ''
  const [txns, setTxns] = useState([])
  const [bills, setBills] = useState([])
  const [accounts, setAccounts] = useState([])
  const [q, setQ] = useState(initialQuery)
  const [type, setType] = useState('ALL')
  const [direction, setDirection] = useState('ALL')
  const [range, setRange] = useState('ALL')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setQ(new URLSearchParams(location.search).get('q') || '')
  }, [location.search])

  useEffect(() => {
    Promise.all([api.get('/transactions'), api.get('/bills/payments'), api.get('/accounts')]).then(([t, b, a]) => {
      setTxns(t); setBills(b); setAccounts(a)
    }).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const own = accounts.map(a => String(a.accountNumber))
    let items = buildActivity(txns, bills, own)
    if (type !== 'ALL') items = items.filter(item => item.kind === type.toLowerCase())
    if (direction !== 'ALL') items = items.filter(item => item.direction === direction.toLowerCase())
    if (range !== 'ALL') {
      const since = Date.now() - Number(range) * 86400000
      items = items.filter(item => new Date(item.date).getTime() >= since)
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      items = items.filter(item => JSON.stringify(item).toLowerCase().includes(needle))
    }
    return items
  }, [txns, bills, accounts, q, type, direction, range])

  function reset() {
    setQ('')
    setType('ALL')
    setDirection('ALL')
    setRange('ALL')
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="ACTIVITY" title="Money movement" description="Search and filter the transfers and bill payments currently exposed by BankEase." action={<div className="search-inline wide"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search references, billers, accounts…" /></div>} />

        <div className="filter-bar">
          <div className="filter-label"><Filter size={15} /> Filters</div>
          <FilterSelect value={type} onChange={setType} options={['ALL', 'TRANSFER', 'BILL']} labels={{ ALL: 'All activity', TRANSFER: 'Transfers', BILL: 'Bills' }} />
          <FilterSelect value={direction} onChange={setDirection} options={['ALL', 'INCOMING', 'OUTGOING']} labels={{ ALL: 'Both directions', INCOMING: 'Money in', OUTGOING: 'Money out' }} />
          <FilterSelect value={range} onChange={setRange} options={['ALL', '7', '30', '90']} labels={{ ALL: 'Any time', '7': 'Last 7 days', '30': 'Last 30 days', '90': 'Last 90 days' }} />
          <button className="ghost-button" onClick={reset}>Reset</button>
        </div>

        <div className="panel">
          <SectionTitle title="Filtered activity" action={<span className="muted-count">{filtered.length} records</span>} />
          {filtered.length ? (
              <div className="activity-list roomy">
                {filtered.map((item, index) => <button className="activity-row-button" key={`${item.key}-${index}`} onClick={() => setSelected(item)}><ActivityRow item={item} /></button>)}
              </div>
          ) : <EmptyState icon={<Gauge size={25} />} title="No matching activity" text="Adjust your filters or make a transfer or payment first." />}
        </div>

        {selected && <ActivityDetailModal item={selected} onClose={() => setSelected(null)} />}
      </div>
  )
}

function StatementPage({ toast }) {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [bills, setBills] = useState([])
  const [accountId, setAccountId] = useState('ALL')
  const [range, setRange] = useState('30')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [a, t, b] = await Promise.all([api.get('/accounts'), api.get('/transactions'), api.get('/bills/payments')])
      setAccounts(a); setTransactions(t); setBills(b)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const accountSet = useMemo(() => accountId === 'ALL' ? accounts.map(a => String(a.accountNumber)) : [accountId], [accountId, accounts])
  const items = useMemo(() => {
    let rows = buildActivity(transactions, bills, accountSet)
    const since = Date.now() - Number(range) * 86400000
    return rows.filter(item => new Date(item.date).getTime() >= since)
  }, [transactions, bills, accountSet, range])

  const credits = items.filter(item => item.direction === 'in').reduce((sum, item) => sum + item.amount, 0)
  const debits = items.filter(item => item.direction === 'out').reduce((sum, item) => sum + item.amount, 0)
  const selectedAccount = accounts.find(a => String(a.accountNumber) === accountId)

  function downloadCSV() {
    const header = ['Date', 'Type', 'Reference', 'Description', 'Amount', 'Direction', 'Status']
    const rows = items.map(item => [formatDate(item.date), item.kind, item.reference, item.subtitle, item.amount, item.direction, item.status])
    const csv = [header, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `bankease-statement-${new Date().toISOString().slice(0,10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    toast('Statement CSV prepared.')
  }

  if (loading) return <LoadingPage label="Preparing your statement…" />

  return (
      <div className="page-stack statement-page">
        <PageHeader eyebrow="STATEMENT" title="Account statement" description="A printable, downloadable view built from the activity currently returned by BankEase." action={<div className="header-actions"><button className="ghost-button" onClick={() => window.print()}><Printer size={16} /> Print</button><button className="primary-button" onClick={downloadCSV}><Download size={16} /> Download CSV</button></div>} />

        <div className="panel statement-controls">
          <div className="statement-control"><span>Account</span><select value={accountId} onChange={e => setAccountId(e.target.value)}><option value="ALL">All accounts</option>{accounts.map(a => <option value={a.accountNumber} key={a.id}>{a.accountType} •••• {String(a.accountNumber).slice(-4)}</option>)}</select></div>
          <div className="statement-control"><span>Period</span><select value={range} onChange={e => setRange(e.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></div>
          <div className="statement-control statement-metric"><span>Credits</span><strong className="positive">+{money(credits)}</strong></div>
          <div className="statement-control statement-metric"><span>Debits</span><strong className="negative">−{money(debits)}</strong></div>
        </div>

        <div className="statement-paper panel">
          <div className="statement-heading">
            <div><span className="kicker">BANKEASE</span><h2>Statement of account</h2><p>{selectedAccount ? `${selectedAccount.accountType} •••• ${String(selectedAccount.accountNumber).slice(-4)}` : 'All customer accounts'}</p></div>
            <div><span>Generated</span><strong>{formatDate(new Date())}</strong></div>
          </div>

          {selectedAccount && (
              <div className="statement-summary">
                <Detail label="Account number" value={selectedAccount.accountNumber} />
                <Detail label="Account type" value={selectedAccount.accountType} />
                <Detail label="Current balance" value={money(selectedAccount.balance)} />
              </div>
          )}

          {items.length ? (
              <div className="table-wrap statement-table">
                <table>
                  <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th>Description</th><th>Direction</th><th>Amount</th></tr></thead>
                  <tbody>
                  {items.map(item => (
                      <tr key={`${item.key}-${item.date}`}><td>{formatDate(item.date)}</td><td>{item.kind}</td><td>{item.reference}</td><td>{item.subtitle}</td><td>{item.direction === 'in' ? 'Credit' : 'Debit'}</td><td className={item.direction === 'in' ? 'positive' : 'negative'}>{item.direction === 'in' ? '+' : '−'}{money(item.amount)}</td></tr>
                  ))}
                  </tbody>
                </table>
              </div>
          ) : <EmptyState icon={<FileText size={25} />} title="No movement in this period" text="Try a wider date range or another account." />}

          <div className="statement-foot"><span>BankEase digital statement · Preview generated from current application data</span><span>{items.length} entries</span></div>
        </div>
      </div>
  )
}

function AdminOverview() {
  const [users, setUsers] = useState([])
  const [billers, setBillers] = useState([])
  const [logs, setLogs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [usersResult, billersResult, logsResult, applicationsResult] = await Promise.allSettled([
      api.get('/admin/users'),
      api.get('/billers'),
      api.get('/admin/audit-logs'),
      api.getAdminLoanApplications('PENDING'),
    ])
    setUsers(usersResult.status === 'fulfilled' ? usersResult.value : [])
    setBillers(billersResult.status === 'fulfilled' ? billersResult.value : [])
    setLogs(logsResult.status === 'fulfilled' ? logsResult.value : [])
    setApplications(applicationsResult.status === 'fulfilled' ? applicationsResult.value : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])
  if (loading) return <LoadingPage label="Loading command center…" />

  const activeUsers = users.filter(u => u.status === 'ACTIVE').length
  const activeBillers = billers.filter(b => b.status === 'ACTIVE').length
  const actionsToday = logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length

  return (
      <div className="page-stack">
        <PageHeader eyebrow="ADMIN COMMAND" title="Operational overview" description="Users, account controls, credit workflows and audit signals in one control plane." action={<button className="ghost-button" onClick={load}><RefreshCw size={16} /> Refresh</button>} />

        <div className="admin-banner"><div className="admin-banner-icon"><ShieldCheck size={25} /></div><div><span className="kicker">CONTROL LAYER</span><h3>BankEase operations are live.</h3><p>Successful administrative actions are written to the audit pipeline.</p></div><div className="banner-code">/admin/**<span>ROLE_ADMIN</span></div></div>

        <div className="stats-grid">
          <StatCard label="Registered users" value={users.length} meta={`${activeUsers} active`} icon={<UsersRound size={18} />} />
          <StatCard label="Active billers" value={activeBillers} meta="Available to customers" icon={<Building2 size={18} />} />
          <StatCard label="Audit actions today" value={actionsToday} meta="Successful admin actions" icon={<ShieldCheck size={18} />} />
          <StatCard label="Pending loans" value={applications.length} meta="Awaiting review" icon={<FileCheck2 size={18} />} />
        </div>

        <div className="admin-today-strip">
          <div><span>Customers</span><strong>{users.length}</strong></div>
          <div><span>Active customers</span><strong>{activeUsers}</strong></div>
          <div><span>Pending loans</span><strong>{applications.length}</strong></div>
          <div><span>Actions today</span><strong>{actionsToday}</strong></div>
        </div>

        <div className="split-grid">
          <div className="panel">
            <SectionTitle title="Loan queue pulse" action={<span className="muted-count">{applications.length} pending</span>} />
            {applications.slice(0, 5).map(application => (
                <div className="queue-mini" key={application.id}><div><strong>{application.loanType} loan</strong><span>{application.applicantName || 'Applicant'} · {application.applicationReference}</span></div><strong>{money(application.requestedAmount)}</strong><span className="status-pill pending">PENDING</span></div>
            ))}
            {!applications.length && <EmptyState icon={<FileCheck2 size={25} />} title="Queue is clear" text="No pending applications are waiting for review." />}
          </div>

          <div className="panel">
            <SectionTitle title="System posture" />
            <div className="posture"><PostureRow label="JWT authorization" state="ENABLED" /><PostureRow label="Customer boundary" state="ENABLED" /><PostureRow label="Admin boundary" state="ENABLED" /><PostureRow label="Audit pipeline" state="ENABLED" /><PostureRow label="Transfer locking" state="ENABLED" /></div>
          </div>
        </div>

        <div className="panel">
          <SectionTitle title="Recent audit signals" action={<span className="muted-count">{logs.length} total</span>} />
          {logs.length ? <div className="audit-list">{logs.slice(0, 9).map(log => <AuditRow key={log.id} log={log} />)}</div> : <EmptyState icon={<ShieldCheck size={25} />} title="No audit entries" text="Successful administrative actions will appear here." />}
        </div>
      </div>
  )
}

function AdminUsers({ toast }) {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')

  async function load() { setUsers(await api.get('/admin/users')) }
  useEffect(() => { load().catch(err => toast(err.message, 'error')) }, [])

  async function toggle(user) {
    const next = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      const updated = await api.patch(`/admin/users/${user.id}/status`, { status: next })
      setUsers(prev => prev.map(item => item.id === updated.id ? updated : item))
      toast(`User marked ${next.toLowerCase()}.`)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const filtered = users.filter(user => `${user.fullname} ${user.email} ${user.phone}`.toLowerCase().includes(q.toLowerCase()))

  return (
      <div className="page-stack">
        <PageHeader eyebrow="USER OPERATIONS" title="Users" description="Review customer access and change active/inactive status." action={<div className="search-inline wide"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email or phone…" /></div>} />
        <div className="panel">
          <SectionTitle title="Customer directory" action={<span className="muted-count">{filtered.length} users</span>} />
          {filtered.length ? (
              <div className="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>
              {filtered.map(user => <tr key={user.id}><td><div className="table-user"><Avatar name={user.fullname} /><div><strong>{user.fullname}</strong><span>ID #{user.id}</span></div></div></td><td>{user.email}</td><td>{user.phone}</td><td><span className="role-pill">{user.role}</span></td><td><span className={cx('status-pill', statusClass(user.status))}>{user.status}</span></td><td><button className="small-button" onClick={() => toggle(user)}>{user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</button></td></tr>)}
              </tbody></table></div>
          ) : <EmptyState icon={<UsersRound size={25} />} title="No users match" text="Try a different search term." />}
        </div>
      </div>
  )
}

function AdminAccounts({ toast }) {
  const [accountNumber, setAccountNumber] = useState('')
  const [status, setStatus] = useState('BLOCKED')
  const [deposit, setDeposit] = useState({ amount: '', remarks: '' })
  const [busy, setBusy] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  async function changeStatus(event) {
    event.preventDefault(); setBusy(true)
    try {
      const data = await api.patch(`/admin/accounts/${accountNumber}/status`, { status })
      setLastResult(data); toast(`Account ${accountNumber} is now ${data.status}.`)
    } catch (err) { toast(err.message, 'error') } finally { setBusy(false) }
  }

  async function addFunds(event) {
    event.preventDefault(); setBusy(true)
    try {
      const data = await api.post(`/admin/accounts/${accountNumber}/deposit`, { amount: Number(deposit.amount), remarks: deposit.remarks })
      setLastResult(data); toast(`Deposit of ${money(deposit.amount)} applied.`); setDeposit({ amount: '', remarks: '' })
    } catch (err) { toast(err.message, 'error') } finally { setBusy(false) }
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="ACCOUNT OPERATIONS" title="Accounts" description="Administrative account status and development funding controls." />
        <div className="loan-desk-banner"><div className="desk-icon"><ShieldCheck size={24} /></div><div><strong>Reference-driven controls</strong><span>The backend performs ownership and row-lock validation before changing an account.</span></div></div>
        <div className="split-grid">
          <div className="panel"><SectionTitle title="Change account status" /><form className="form-stack" onSubmit={changeStatus}><Field label="Account number" value={accountNumber} onChange={setAccountNumber} placeholder="12-digit account number" inputMode="numeric" required /><FieldSelect label="New status" value={status} onChange={setStatus} options={['ACTIVE', 'BLOCKED']} /><button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <Settings size={18} />} Update account</button></form></div>
          <div className="panel"><SectionTitle title="Development funding" /><form className="form-stack" onSubmit={addFunds}><Field label="Account number" value={accountNumber} onChange={setAccountNumber} placeholder="12-digit account number" inputMode="numeric" required /><Field label="Amount" value={deposit.amount} onChange={value => setDeposit({ ...deposit, amount: value })} placeholder="₹ 0.00" type="number" min="0.01" step="0.01" required /><Field label="Remarks" value={deposit.remarks} onChange={value => setDeposit({ ...deposit, remarks: value })} placeholder="Funding note" /><button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <CircleDollarSign size={18} />} Add funds</button></form></div>
        </div>
        {lastResult && <div className="success-banner"><div className="success-icon"><Check size={21} /></div><div><strong>Account updated</strong><span>{lastResult.accountType} · {lastResult.accountNumber} · {lastResult.status}</span></div><div className="success-ref">Balance<br /><strong>{money(lastResult.balance)}</strong></div></div>}
      </div>
  )
}

function AdminBillers({ toast }) {
  const [billers, setBillers] = useState([])
  const [form, setForm] = useState({ name: '', category: '' })
  const [statusId, setStatusId] = useState('')
  const [status, setStatus] = useState('INACTIVE')
  const [busy, setBusy] = useState(false)

  async function load() { setBillers(await api.get('/billers')) }
  useEffect(() => { load().catch(err => toast(err.message, 'error')) }, [])

  async function create(event) {
    event.preventDefault(); setBusy(true)
    try { await api.post('/admin/billers', form); toast('Biller created.'); setForm({ name: '', category: '' }); await load() }
    catch (err) { toast(err.message, 'error') }
    finally { setBusy(false) }
  }

  async function changeStatus(event) {
    event.preventDefault(); setBusy(true)
    try { const data = await api.patch(`/admin/billers/${statusId}/status?status=${status}`); toast(`Biller ${data.name} is now ${data.status}.`); setStatusId(''); await load() }
    catch (err) { toast(err.message, 'error') }
    finally { setBusy(false) }
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="BILLER OPERATIONS" title="Billers" description="Create service providers and control which billers customers can pay." />
        <div className="split-grid">
          <div className="panel"><SectionTitle title="Create biller" /><form className="form-stack" onSubmit={create}><Field label="Biller name" value={form.name} onChange={value => setForm({ ...form, name: value })} placeholder="Service provider" required /><Field label="Category" value={form.category} onChange={value => setForm({ ...form, category: value })} placeholder="Utilities / Telecom / Internet" required /><button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <Plus size={18} />} Create biller</button></form></div>
          <div className="panel"><SectionTitle title="Change biller status" /><form className="form-stack" onSubmit={changeStatus}><FieldSelect label="Biller" value={statusId} onChange={setStatusId} options={billers.map(b => `${b.id} — ${b.name}`)} values={billers.map(b => String(b.id))} placeholder="Select biller" required /><FieldSelect label="New status" value={status} onChange={setStatus} options={['ACTIVE', 'INACTIVE']} /><button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <Settings size={18} />} Update biller</button></form></div>
        </div>
        <div className="panel"><SectionTitle title="Biller directory" action={<span className="muted-count">{billers.length} records</span>} />{billers.length ? <div className="biller-list large">{billers.map(biller => <div className="biller-item" key={biller.id}><div className="biller-avatar">{String(biller.name).slice(0, 2).toUpperCase()}</div><div><strong>{biller.name}</strong><span>{biller.category} · ID #{biller.id}</span></div><span className={cx('status-pill', statusClass(biller.status))}>{biller.status}</span></div>)}</div> : <EmptyState icon={<Building2 size={25} />} title="No visible billers" text="Create a biller to make it discoverable to customers." />}</div>
      </div>
  )
}

function AdminLoans({ toast }) {
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState('PENDING')
  const [selected, setSelected] = useState(null)
  const [decision, setDecision] = useState({ status: 'APPROVED', approvedAmount: '', remarks: '' })
  const [disbursement, setDisbursement] = useState({ accountNumber: '', interestRate: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showDisburse, setShowDisburse] = useState(false)

  async function loadApplications(nextFilter = filter) {
    setLoading(true)
    try {
      const data = await api.getAdminLoanApplications(nextFilter === 'ALL' ? null : nextFilter)
      setApplications(data || [])
    } catch (err) {
      toast(err.message, 'error')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadApplications('PENDING') }, [])

  function openReview(application) {
    setSelected(application)
    setDecision({ status: application.status === 'PENDING' ? 'APPROVED' : application.status, approvedAmount: application.approvedAmount ?? '', remarks: application.remarks ?? '' })
    setShowReview(true)
  }

  function openDisbursement(application) {
    setSelected(application)
    setDisbursement({ accountNumber: '', interestRate: '' })
    setShowDisburse(true)
  }

  async function submitReview(event) {
    event.preventDefault(); if (!selected) return
    setBusy(true)
    try {
      await api.patch(`/admin/loans/applications/${selected.applicationReference}/status`, {
        status: decision.status,
        approvedAmount: decision.status === 'APPROVED' ? Number(decision.approvedAmount) : null,
        remarks: decision.remarks,
      })
      toast(decision.status === 'APPROVED' ? 'Loan application approved.' : 'Loan application rejected.')
      setShowReview(false); setSelected(null); await loadApplications(filter)
    } catch (err) { toast(err.message, 'error') }
    finally { setBusy(false) }
  }

  async function submitDisbursement(event) {
    event.preventDefault(); if (!selected) return
    setBusy(true)
    try {
      await api.post(`/admin/loans/applications/${selected.applicationReference}/disburse`, { accountNumber: disbursement.accountNumber, interestRate: Number(disbursement.interestRate) })
      toast('Loan disbursed successfully.')
      setShowDisburse(false); setSelected(null); await loadApplications(filter)
    } catch (err) { toast(err.message, 'error') }
    finally { setBusy(false) }
  }

  return (
      <div className="page-stack">
        <PageHeader eyebrow="CREDIT OPERATIONS" title="Loan desk" description="See applications directly, review applicants and disburse approved credit without manual reference lookup." action={<button className="ghost-button" onClick={() => loadApplications(filter)}><RefreshCw size={16} /> Refresh</button>} />
        <div className="loan-desk-banner"><div className="desk-icon"><FileCheck2 size={24} /></div><div><strong>Live application queue</strong><span>Newest applications surface first. Admin actions remain protected by the backend role boundary.</span></div><div className="banner-code">/admin/loans/applications<span>ROLE_ADMIN</span></div></div>

        <div className="panel">
          <SectionTitle title="Application queue" action={<div className="filter-tabs">{['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(status => <button key={status} className={cx('filter-tab', filter === status && 'active')} onClick={() => { setFilter(status); loadApplications(status) }}>{status}</button>)}</div>} />
          {loading ? <LoadingPage label="Loading loan applications…" /> : applications.length ? (
              <div className="loan-application-grid">
                {applications.map(application => {
                  const pending = application.status === 'PENDING'
                  const approved = application.status === 'APPROVED'
                  return (
                      <div className="loan-application-card" key={application.id}>
                        <div className="loan-application-top"><div className="loan-application-icon"><FileCheck2 size={20} /></div><div className="loan-application-heading"><strong>{application.loanType} Loan</strong><span>{application.applicationReference}</span></div><span className={cx('status-pill', statusClass(application.status))}>{application.status}</span></div>
                        <div className="applicant-strip"><Avatar name={application.applicantName || 'Applicant'} /><div><strong>{application.applicantName || 'Applicant'}</strong><span>{application.applicantEmail || 'Customer email unavailable'}</span></div></div>
                        <div className="loan-application-amount"><span>{approved ? 'Approved amount' : 'Requested amount'}</span><strong>{money(application.approvedAmount ?? application.requestedAmount)}</strong></div>
                        <div className="loan-application-details"><div><span>Requested</span><strong>{money(application.requestedAmount)}</strong></div><div><span>Tenure</span><strong>{application.tenureMonths} months</strong></div><div><span>Applied</span><strong>{formatDate(application.appliedAt)}</strong></div></div>
                        <div className="loan-application-purpose"><span>Purpose</span><p>{application.purpose}</p></div>
                        {application.remarks && <div className="loan-application-remarks"><span>Remarks</span><p>{application.remarks}</p></div>}
                        <div className="loan-application-actions">
                          {pending && <button className="primary-button" onClick={() => openReview(application)}><FileCheck2 size={17} /> Review</button>}
                          {approved && <><button className="ghost-button" onClick={() => openReview(application)}>View decision</button><button className="primary-button" onClick={() => openDisbursement(application)}><CircleDollarSign size={17} /> Disburse</button></>}
                          {application.status === 'REJECTED' && <button className="ghost-button" onClick={() => openReview(application)}>View decision</button>}
                        </div>
                      </div>
                  )
                })}
              </div>
          ) : <EmptyState icon={<FileText size={25} />} title={`No ${filter.toLowerCase()} applications`} text="Applications matching this filter will appear here." />}
        </div>

        {showReview && selected && (
            <Drawer title="Review loan application" onClose={() => !busy && setShowReview(false)}>
              <div className="drawer-summary"><Detail label="Applicant" value={selected.applicantName || 'Applicant'} /><Detail label="Email" value={selected.applicantEmail || '—'} /><Detail label="Requested" value={money(selected.requestedAmount)} /><Detail label="Tenure" value={`${selected.tenureMonths} months`} /><Detail label="Loan type" value={selected.loanType} /><Detail label="Purpose" value={selected.purpose} /></div>
              <LoanTimeline status={selected.status} />
              <form className="form-stack" onSubmit={submitReview}>
                <FieldSelect label="Decision" value={decision.status} onChange={value => setDecision({ ...decision, status: value })} options={['APPROVED', 'REJECTED']} />
                {decision.status === 'APPROVED' && <Field label="Approved amount" value={decision.approvedAmount} onChange={value => setDecision({ ...decision, approvedAmount: value })} placeholder="₹ 0.00" type="number" min="1" max={selected.requestedAmount} step="0.01" required />}
                <Field label="Remarks" value={decision.remarks} onChange={value => setDecision({ ...decision, remarks: value })} placeholder="Decision note" />
                <button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <Check size={18} />} Save decision</button>
              </form>
            </Drawer>
        )}

        {showDisburse && selected && (
            <Modal title="Disburse approved loan" onClose={() => !busy && setShowDisburse(false)}>
              <div className="review-summary"><Detail label="Applicant" value={selected.applicantName || 'Applicant'} /><Detail label="Approved amount" value={money(selected.approvedAmount)} /><Detail label="Application" value={selected.applicationReference} /></div>
              <form className="form-stack" onSubmit={submitDisbursement}>
                <Field label="Destination account" value={disbursement.accountNumber} onChange={value => setDisbursement({ ...disbursement, accountNumber: value })} placeholder="Customer account number" inputMode="numeric" required />
                <Field label="Interest rate (%)" value={disbursement.interestRate} onChange={value => setDisbursement({ ...disbursement, interestRate: value })} placeholder="8.5" type="number" min="0.01" step="0.01" required />
                <div className="info-box"><ShieldCheck size={18} /><span>The backend verifies that the destination account belongs to the applicant.</span></div>
                <button className="primary-button full" disabled={busy}>{busy ? <Spinner /> : <CircleDollarSign size={18} />} Disburse loan</button>
              </form>
            </Modal>
        )}
      </div>
  )
}

function AdminAudit() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState(new URLSearchParams(window.location.search).get('q') || '')

  useEffect(() => { api.get('/admin/audit-logs').then(setLogs).catch(() => {}) }, [])

  const filtered = logs.filter(log => `${log.action} ${log.performedBy} ${log.targetType} ${log.targetId} ${log.description}`.toLowerCase().includes(filter.toLowerCase()))

  return (
      <div className="page-stack">
        <PageHeader eyebrow="COMPLIANCE" title="Audit center" description="Read-only records of successful administrative actions captured by BankEase." action={<div className="search-inline wide"><Search size={16} /><input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter action, admin, target…" /></div>} />
        <div className="panel">
          <SectionTitle title="Audit log" action={<span className="muted-count">{filtered.length} records</span>} />
          {filtered.length ? <div className="table-wrap"><table><thead><tr><th>Action</th><th>Admin</th><th>Target</th><th>Description</th><th>Timestamp</th></tr></thead><tbody>{filtered.map(log => <tr key={log.id}><td><span className="audit-tag">{log.action}</span></td><td>{log.performedBy}</td><td><strong>{log.targetType}</strong><br /><span className="subtle-cell">{log.targetId}</span></td><td>{log.description}</td><td>{formatDate(log.createdAt)} {formatTime(log.createdAt)}</td></tr>)}</tbody></table></div> : <EmptyState icon={<ShieldCheck size={25} />} title="No audit entries" text="Successful administrative actions will appear here." />}
        </div>
      </div>
  )
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
      <div className="page-header">
        <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
        {action && <div className="header-actions">{action}</div>}
      </div>
  )
}

function SectionTitle({ title, action }) {
  return <div className="section-title"><h3>{title}</h3>{action}</div>
}

function StatCard({ label, value, meta, icon }) {
  return <div className="stat-card"><div className="stat-top"><div className="stat-icon">{icon}</div></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-meta">{meta}</span></div>
}

function StepPill({ number, label, active, done }) {
  return <div className={cx('step-pill', active && 'active', done && 'done')}><span>{done ? <Check size={13} /> : number}</span><strong>{label}</strong></div>
}

function FilterSelect({ value, onChange, options, labels = {} }) {
  return <div className="filter-select"><select value={value} onChange={e => onChange(e.target.value)}>{options.map(option => <option key={option} value={option}>{labels[option] || option}</option>)}</select><ChevronDown size={14} /></div>
}

function Detail({ label, value }) {
  return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>
}

function AccountMini({ account, hidden = false, onClick }) {
  return (
      <button className="account-mini account-mini-button" onClick={onClick}>
        <div className="account-type-icon"><CreditCard size={18} /></div>
        <div><strong>{account.accountType}</strong><span>•••• {String(account.accountNumber || '').slice(-4)}</span></div>
        <div className="account-mini-right"><strong>{hidden ? '••••' : money(account.balance)}</strong><span className={cx('status-pill', statusClass(account.status))}>{account.status}</span></div>
        <ChevronRight size={16} className="mini-chevron" />
      </button>
  )
}

function AccountCard({ account, onCopy, onDetails, onStatement }) {
  return (
      <div className="account-card">
        <div className="account-card-shine" />
        <div className="account-card-top"><span className="account-label">BANKEASE · {account.accountType}</span><CreditCard size={21} /></div>
        <div className="account-balance">{money(account.balance)}</div>
        <div className="account-number">{String(account.accountNumber).replace(/(.{4})/g, '$1 ').trim()}</div>
        <div className="account-card-bottom">
          <span className={cx('status-pill', statusClass(account.status))}>{account.status}</span>
          <div className="account-card-actions">
            <button type="button" onClick={() => onDetails(account)}><MoreHorizontal size={15} /> Details</button>
            <button type="button" onClick={() => onStatement(account)}><FileText size={14} /> Statement</button>
            <button type="button" onClick={() => onCopy(account.accountNumber)}><Copy size={14} /> Copy</button>
          </div>
        </div>
      </div>
  )
}

function AccountDetailModal({ account, transactions, bills, ownAccounts, hidden, onClose, onToast }) {
  const accountNo = String(account.accountNumber)
  const items = buildActivity(transactions, bills, ownAccounts).filter(item => item.subtitle.includes(accountNo)).slice(0, 8)
  const navigate = useNavigate()

  return (
      <Modal title={`${account.accountType} account`} onClose={onClose}>
        <div className="account-modal-number"><span>Account number</span><strong>{accountNo}</strong></div>
        <div className="account-modal-balance"><span>Available balance</span><strong>{hidden ? '₹ ••••••••' : money(account.balance)}</strong></div>
        <div className="account-modal-grid"><Detail label="Account ID" value={`#${account.id}`} /><Detail label="Type" value={account.accountType} /><Detail label="Status" value={account.status} /></div>
        <SectionTitle title="Recent account movement" action={<button className="small-button" onClick={async () => { try { await navigator.clipboard.writeText(accountNo); onToast('Account number copied.') } catch { onToast('Copy is unavailable.', 'error') } }}><Copy size={14} /> Copy</button>} />
        {items.length ? <div className="activity-list compact">{items.map((item, index) => <ActivityRow key={`${item.key}-${index}`} item={item} />)}</div> : <EmptyState icon={<Gauge size={23} />} title="No movement for this account" text="Transfer or bill activity will appear here." />}
        <button className="primary-button full" onClick={() => navigate('/statement')}><FileText size={17} /> Open statement</button>
      </Modal>
  )
}

function SimpleAccountModal({ account, onCopy, onClose, onStatement }) {
  return (
      <Modal title="Account details" onClose={onClose}>
        <div className="account-modal-top"><span className="kicker">{account.accountType}</span><span className={cx('status-pill', statusClass(account.status))}>{account.status}</span></div>
        <div className="account-modal-number"><span>Account number</span><strong>{account.accountNumber}</strong></div>
        <div className="account-modal-balance"><span>Available balance</span><strong>{money(account.balance)}</strong></div>
        <div className="account-modal-grid"><Detail label="Account ID" value={`#${account.id}`} /><Detail label="Type" value={account.accountType} /><Detail label="Status" value={account.status} /></div>
        <div className="review-actions"><button className="ghost-button" onClick={() => onCopy(account.accountNumber)}><Copy size={16} /> Copy</button><button className="primary-button" onClick={onStatement}><FileText size={16} /> View statement</button></div>
      </Modal>
  )
}

function ActivityRow({ item }) {
  const icon = item.kind === 'bill' ? <Receipt size={17} /> : item.direction === 'in' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />
  return (
      <div className="activity-row">
        <div className={cx('activity-icon', item.kind, item.direction)}>{icon}</div>
        <div className="activity-main"><strong>{item.title}</strong><span>{item.subtitle}</span></div>
        <div className="activity-ref"><span>{item.reference}</span><small>{formatDate(item.date)} {formatTime(item.date)}</small></div>
        <div className="activity-amount"><strong className={item.direction === 'in' ? 'incoming-amount' : ''}>{item.direction === 'in' ? '+' : '−'} {money(item.amount)}</strong><span className={cx('status-pill', statusClass(item.status))}>{item.status}</span></div>
      </div>
  )
}

function buildActivity(transactions, bills, ownAccounts = []) {
  const own = new Set(ownAccounts.map(String))

  return [
    ...transactions.map(transaction => {
      const incoming = own.has(String(transaction.receiverAccountNumber)) && !own.has(String(transaction.senderAccountNumber))
      return {
        key: transaction.transactionReference,
        kind: 'transfer',
        title: incoming ? 'Money received' : 'Transfer sent',
        subtitle: `${transaction.senderAccountNumber} → ${transaction.receiverAccountNumber}`,
        amount: Number(transaction.amount || 0),
        direction: incoming ? 'in' : 'out',
        status: transaction.transactionStatus || 'SUCCESS',
        date: transaction.createdAt,
        reference: transaction.transactionReference,
      }
    }),
    ...bills.map(payment => ({
      key: payment.paymentReference,
      kind: 'bill',
      title: payment.billerName || 'Bill payment',
      subtitle: payment.consumerNumber,
      amount: Number(payment.amount || 0),
      direction: 'out',
      status: payment.status || 'SUCCESS',
      date: payment.paidAt,
      reference: payment.paymentReference,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function LoanTimeline({ status }) {
  const normalized = String(status || '').toUpperCase()
  const steps = normalized === 'REJECTED'
      ? ['APPLICATION', 'REVIEW', 'REJECTED']
      : normalized === 'ACTIVE'
          ? ['APPLICATION', 'APPROVED', 'DISBURSED', 'ACTIVE']
          : normalized === 'APPROVED'
              ? ['APPLICATION', 'APPROVED', 'DISBURSEMENT']
              : ['APPLICATION', 'REVIEW', 'PENDING']

  return (
      <div className="loan-timeline">
        {steps.map((step, index) => (
            <React.Fragment key={`${step}-${index}`}>
              <div className={cx('timeline-step', index === steps.length - 1 && 'current')}><span>{index === steps.length - 1 ? <CircleCheck size={13} /> : <Check size={13} />}</span><strong>{step}</strong></div>
              {index < steps.length - 1 && <div className="timeline-line" />}
            </React.Fragment>
        ))}
      </div>
  )
}

function LoanJourneyCard() {
  return null
}

function MiniFlowChart({ values = [] }) {
  const nums = values.length >= 2 ? values : [12, 18, 16, 24, 22, 29, 27]
  const max = Math.max(...nums, 1)
  const min = Math.min(...nums, 0)
  const points = nums.map((value, index) => {
    const x = nums.length === 1 ? 0 : (index / (nums.length - 1)) * 100
    const y = 75 - ((value - min) / Math.max(max - min, 1)) * 53
    return `${x},${y}`
  }).join(' ')

  return (
      <svg className="mini-flow-chart" viewBox="0 0 100 80" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="#c4865c" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
  )
}

function PostureRow({ label, state }) {
  return <div className="posture-row"><div className="posture-dot" /><span>{label}</span><strong>{state}</strong></div>
}

function AuditRow({ log }) {
  return <div className="audit-row"><div className="audit-dot" /><div><strong>{log.action}</strong><span>{log.performedBy} · {log.targetType} {log.targetId}</span></div><small>{formatDate(log.createdAt)} {formatTime(log.createdAt)}</small></div>
}

function Avatar({ name = 'U' }) {
  const letters = String(name).trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U'
  return <div className="avatar">{letters}</div>
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false, ...props }) {
  return <div className="field-wrap"><label>{label}</label><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} type={type} required={required} {...props} /></div>
}

function PasswordField({ label, value, onChange, visible, setVisible, placeholder, autoComplete }) {
  return (
      <div className="field-wrap">
        <label>{label}</label>
        <div className="password-field">
          <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} type={visible ? 'text' : 'password'} autoComplete={autoComplete} required />
          <button type="button" className="icon-button" onClick={() => setVisible(value => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>
        </div>
      </div>
  )
}

function FieldSelect({ label, value, onChange, options, values = options, placeholder, required = false }) {
  return <div className="field-wrap"><label>{label}</label><select value={value} onChange={event => onChange(event.target.value)} required={required}><option value="">{placeholder || 'Select an option'}</option>{options.map((option, index) => <option key={`${option}-${index}`} value={values[index] ?? option.split(' — ')[0]}>{option}</option>)}</select></div>
}

function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop"><div className="modal-card"><div className="modal-head"><div><span className="kicker">BANKEASE</span><h3>{title}</h3></div><button className="round-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</div></div>
}

function Drawer({ title, onClose, children }) {
  return (
      <div className="drawer-backdrop" onMouseDown={onClose}>
        <aside className="drawer-panel" onMouseDown={event => event.stopPropagation()}>
          <div className="drawer-head"><div><span className="kicker">BANKEASE / ADMIN</span><h3>{title}</h3></div><button className="round-button" onClick={onClose}><X size={18} /></button></div>
          <div className="drawer-body">{children}</div>
        </aside>
      </div>
  )
}

function ActivityDetailModal({ item, onClose }) {
  return <Modal title="Activity detail" onClose={onClose}><div className="review-summary"><Detail label="Description" value={item.title} /><Detail label="Reference" value={item.reference} /><Detail label="Amount" value={`${item.direction === 'in' ? '+' : '−'} ${money(item.amount)}`} /></div><div className="account-modal-grid"><Detail label="Type" value={item.kind === 'bill' ? 'Bill payment' : 'Transfer'} /><Detail label="Status" value={item.status} /><Detail label="Date" value={formatDate(item.date)} /><Detail label="Time" value={formatTime(item.date)} /><Detail label="Direction" value={item.direction === 'in' ? 'Incoming' : 'Outgoing'} /><Detail label="Details" value={item.subtitle} /></div></Modal>
}

function BillReceiptModal({ payment, onClose }) {
  return <Modal title="Payment receipt" onClose={onClose}><ReceiptDocument title="BILL PAYMENT" reference={payment.paymentReference} amount={payment.amount} date={payment.paidAt} status={payment.status} rows={[['Biller', payment.billerName], ['Consumer number', payment.consumerNumber], ['Amount', money(payment.amount)], ['Status', payment.status]]} /></Modal>
}

function RepaymentReceiptModal({ repayment, onClose }) {
  return <Modal title="Repayment receipt" onClose={onClose}><ReceiptDocument title="LOAN REPAYMENT" reference={repayment.repaymentReference} amount={repayment.amount} date={repayment.paidAt} status="SUCCESS" rows={[['Amount', money(repayment.amount)], ['Remarks', repayment.remarks || '—'], ['Status', 'SUCCESS']]}/></Modal>
}

function ReceiptDocument({ title, reference, amount, date, status, rows }) {
  return (
      <div className="receipt-document">
        <div className="receipt-mark"><CircleCheck size={24} /></div>
        <span className="kicker">{title}</span>
        <strong className="receipt-amount">{money(amount)}</strong>
        <span className="receipt-status">{status} · {formatDate(date)} {formatTime(date)}</span>
        <div className="receipt-meta">{rows.map(([label, value]) => <Detail key={label} label={label} value={value} />)}</div>
        <div className="receipt-reference"><span>REFERENCE</span><strong>{reference}</strong></div>
      </div>
  )
}

function RepaymentHistoryModal({ data, onClose }) {
  return <Modal title={`Repayment history · ${data.loan.loanReference}`} onClose={onClose}>{data.repayments.length ? <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Amount</th><th>Remarks</th><th>Paid at</th></tr></thead><tbody>{data.repayments.map(repayment => <tr key={repayment.id}><td><strong>{repayment.repaymentReference}</strong></td><td>{money(repayment.amount)}</td><td>{repayment.remarks || '—'}</td><td>{formatDate(repayment.paidAt)} {formatTime(repayment.paidAt)}</td></tr>)}</tbody></table></div> : <EmptyState icon={<CircleDollarSign size={24} />} title="No repayments yet" text="Repayment records will appear here after a payment." />}</Modal>
}

function Alert({ type, message }) {
  return <div className={cx('alert', type)}><span>{message}</span></div>
}

function Spinner() {
  return <span className="spinner" />
}

function LoadingPage({ label }) {
  return <div className="loading-page"><div className="loading-orbit"><Spinner /></div><strong>{label}</strong><span>Securing your workspace…</span></div>
}

function EmptyState({ icon, title, text }) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><strong>{title}</strong><span>{text}</span></div>
}

function Toast({ toast, onClose }) {
  return <div className={cx('toast', toast.type)}><div className="toast-icon">{toast.type === 'error' ? <CircleAlert size={16} /> : <CircleCheck size={16} />}</div><span>{toast.message}</span><button onClick={onClose}><X size={14} /></button></div>
}

function Benefit({ icon, title, text }) {
  return <div className="benefit"><div className="benefit-icon">{icon}</div><div><strong>{title}</strong><span>{text}</span></div></div>
}

function BrandMark() {
  return <div className="brand-mark"><Landmark size={23} strokeWidth={1.8} /></div>
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
)
