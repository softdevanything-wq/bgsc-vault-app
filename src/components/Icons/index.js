// SVG Icons Component (기존 Icons 유지)
const Icons = {
  Logo: () => (
    <div className="logo">
      <div className="logo-bg"></div>
      <div className="logo-icon"></div>
    </div>
  ),
  Shield: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2L2 7v7c0 5.55 3.84 10.78 10 12 6.16-1.22 10-6.45 10-12V7l-10-5z"
      />
    </svg>
  ),
  ArrowUp: () => (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 19V5M12 5L5 12M12 5L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Plus: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line
        x1="7"
        y1="17"
        x2="17"
        y2="7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline
        points="7 7 17 7 17 17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ArrowDownLeft: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line
        x1="17"
        y1="7"
        x2="7"
        y2="17"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline
        points="17 17 7 17 7 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ArrowRightIcon: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10H16M16 10L11 5M16 10L11 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  History: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline
        points="1 4 1 10 7 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.51 15a9 9 0 102.13-9.36L1 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clock: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polyline
        points="12 6 12 12 16 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Info: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="8"
        x2="12.01"
        y2="8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="13"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="17"
        x2="12.01"
        y2="17"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="15 3 21 3 21 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="14"
        x2="21"
        y2="3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Loader: () => (
    <svg
      className="icon loading"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M21 12a9 9 0 11-6-8.485" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Eye: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
      />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Copy: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Fuel: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line
        x1="3"
        y1="22"
        x2="15"
        y2="22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="9"
        x2="14"
        y2="9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 22V4a2 2 0 00-2-2H6a2 2 0 00-2 2v18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="13"
        x2="16"
        y2="13"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="17"
        x2="16"
        y2="17"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 13v-2a2 2 0 012-2v0a2 2 0 012 2v6a2 2 0 01-2 2h-2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  RefreshCw: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline
        points="23 4 23 10 17 10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="1 20 1 14 7 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline
        points="23 6 13.5 15.5 8.5 10.5 1 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="17 6 23 6 23 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Menu: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  X: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline
        points="6 9 12 15 18 9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Activity: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default Icons;
