export const STUDENT_NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { id: 'test-results', label: 'Test Results', href: '/test-results', icon: 'BarChart3' },
      { id: 'mock-test', label: 'Full Mock Test', href: '/mock-test', icon: 'Award', badge: '2h 40m' },
    ],
  },
  {
    label: 'IELTS Skills',
    items: [
      { id: 'reading', label: 'Reading', href: '/reading', icon: 'BookOpen' },
      { id: 'listening', label: 'Listening', href: '/listening', icon: 'Headphones' },
      { id: 'writing', label: 'Writing', href: '/writing', icon: 'PenTool' },
      { id: 'speaking', label: 'Speaking', href: '/speaking', icon: 'Mic' },
      { id: 'question-types', label: 'Question Types', href: '/question-types', icon: 'Layers' },
    ],
  },
  {
    label: 'Prep Studio',
    items: [
      { id: 'study-plan', label: 'Study Plan', href: '/study-plan', icon: 'CalendarCheck' },
      { id: 'vocabulary', label: 'Vocabulary', href: '/vocabulary', icon: 'Sparkles' },
      { id: 'cue-card-coach', label: 'Cue Card Coach', href: '/cue-card-coach', icon: 'MessageSquareQuote', dot: true },
      { id: 'tools', label: 'More Tools', href: '/tools', icon: 'Wrench' },
    ],
  },
  {
    label: 'Community',
    items: [
      { id: 'band-battle', label: 'Band Battle', href: '/band-battle', icon: 'Swords', dot: true },
      { id: 'community', label: 'Community', href: '/community', icon: 'Users' },
      { id: 'people', label: 'Students / Teachers', href: '/people', icon: 'GraduationCap' },
      { id: 'invite-friends', label: 'Invite Friends', href: '/invite-friends', icon: 'Gift' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile & Settings', href: '/profile', icon: 'UserCog', matchPaths: ['/profile', '/settings'] },
      { id: 'bookmarks', label: 'My Bookmarks', href: '/bookmarks', icon: 'Bookmark' },
      { id: 'achievements', label: 'Achievements', href: '/achievements', icon: 'Trophy' },
      { id: 'help', label: 'Help Center', href: '/help', icon: 'HelpCircle' },
    ],
  },
];

export const ADMIN_NAV_ITEMS = [
  { id: 'overview', label: 'Admin Overview', icon: 'LayoutDashboard' },
  { id: 'students', label: 'Student Management', icon: 'Users' },
  { id: 'teachers', label: 'Teacher Management', icon: 'GraduationCap' },
  { id: 'mock-tests', label: 'Mock Tests', icon: 'Award' },
  { id: 'reading', label: 'Reading Passages', icon: 'BookOpen' },
  { id: 'listening', label: 'Listening Content', icon: 'Headphones' },
  { id: 'writing', label: 'Writing Tasks', icon: 'PenTool' },
  { id: 'speaking', label: 'Speaking Topics', icon: 'Mic' },
  { id: 'vocabulary', label: 'Vocabulary Bank', icon: 'Sparkles' },
  { id: 'community', label: 'Community Moderation', icon: 'MessageSquare' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'CreditCard' },
  { id: 'analytics', label: 'Platform Analytics', icon: 'TrendingUp' },
  { id: 'settings', label: 'Platform Settings', icon: 'Settings' },
];

