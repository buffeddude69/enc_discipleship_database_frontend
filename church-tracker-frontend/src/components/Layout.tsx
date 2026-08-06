import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseNavItems = [
  { to: "/groups", label: "Groups", icon: HomeIcon },
  { to: "/members", label: "Members", icon: PeopleIcon },
];

const staffNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/leaders", label: "Leaders", icon: LeadersIcon },
  { to: "/manage-lists", label: "Lists", icon: ListIcon },
];

const profileNavItem = { to: "/profile", label: "Profile", icon: ProfileIcon };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [...baseNavItems, ...(user?.is_staff ? staffNavItems : []), profileNavItem];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper">
      {/* Sidebar -- desktop only */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r border-sage-light bg-white">
        <div className="px-6 py-6 border-b border-sage-light">
          <h1 className="font-display text-xl font-semibold text-pine">ENC Discipleship Database</h1>
          {user && (
            <div className="mt-1">
              <p className="text-sm text-charcoal-soft">
                {user.first_name} {user.last_name}
              </p>
              {user.is_staff && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-pine bg-sage-light rounded-full px-2 py-0.5">
                  ★ Staff
                </span>
              )}
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-pine text-white"
                    : "text-charcoal-soft hover:bg-sage-light"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-sage-light">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-brick hover:bg-brick-light transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-sage-light bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-semibold text-pine">Group Tracker</h1>
          {user?.is_staff && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-pine bg-sage-light rounded-full px-2 py-0.5">
              ★ Staff
            </span>
          )}
        </div>
        <button onClick={handleLogout} className="text-sm font-medium text-brick">
          Log out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom tab bar -- mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sage-light flex justify-around py-2 z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive ? "text-pine" : "text-charcoal-soft"
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14a4.8 4.8 0 0 1 5.5 4.7" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="4" rx="1.5" />
      <rect x="13" y="10" width="7" height="10" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function LeadersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 5.5 12 3l8 2.5v5c0 5-3.4 8.5-8 10.5-4.6-2-8-5.5-8-10.5v-5Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" strokeLinecap="round" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" strokeWidth={2.5} />
    </svg>
  );
}
