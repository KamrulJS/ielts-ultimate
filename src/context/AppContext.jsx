'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultProfile from '@/data/students/profile.json';
import defaultNotifications from '@/data/notifications/notifications.json';
import defaultResults from '@/data/tests/test-results.json';
import defaultPlan from '@/data/study-plan/plans.json';
import defaultTasks from '@/data/study-plan/tasks.json';
import defaultWritingSubs from '@/data/writing/submissions.json';
import defaultPosts from '@/data/community/posts.json';
import defaultComments from '@/data/community/comments.json';
import defaultGroups from '@/data/community/groups.json';
import defaultBookings from '@/data/teachers/bookings.json';
import defaultReferrals from '@/data/referrals/referrals.json';
import defaultStudents from '@/data/students/students.json';

const STORAGE_KEY = 'ielts_ultimate_platform_v1';

const AppContext = createContext(null);

const INITIAL_BOOKMARKS = {
  tests: ['rd-test-01', 'ls-test-04'],
  questions: ['rq-04', 'rq-15'],
  vocabulary: ['v-01', 'v-03', 'v-06', 'v-10'],
  resources: ['qt-reading-tfng', 'qt-writing-task1'],
};

export function AppProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [testResults, setTestResults] = useState(defaultResults);
  const [studyPlan, setStudyPlan] = useState(defaultPlan);
  const [studyTasks, setStudyTasks] = useState(defaultTasks);
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);
  const [masteredWords, setMasteredWords] = useState(['v-01', 'v-05', 'v-16']);
  const [writingSubmissions, setWritingSubmissions] = useState(defaultWritingSubs);
  const [speakingRecordings, setSpeakingRecordings] = useState([]);
  const [posts, setPosts] = useState(defaultPosts);
  const [likedPosts, setLikedPosts] = useState(['post-01']);
  const [comments, setComments] = useState(defaultComments);
  const [groups, setGroups] = useState(defaultGroups);
  const [bookings, setBookings] = useState(defaultBookings);
  const [referrals, setReferrals] = useState(defaultReferrals);
  const [adminStudents, setAdminStudents] = useState(defaultStudents);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Hydrate persisted LocalStorage state on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.testResults) setTestResults(parsed.testResults);
          if (parsed.studyPlan) setStudyPlan(parsed.studyPlan);
          if (parsed.studyTasks) setStudyTasks(parsed.studyTasks);
          if (parsed.bookmarks) setBookmarks(parsed.bookmarks);
          if (parsed.masteredWords) setMasteredWords(parsed.masteredWords);
          if (parsed.writingSubmissions) setWritingSubmissions(parsed.writingSubmissions);
          if (parsed.speakingRecordings) setSpeakingRecordings(parsed.speakingRecordings);
          if (parsed.posts) setPosts(parsed.posts);
          if (parsed.likedPosts) setLikedPosts(parsed.likedPosts);
          if (parsed.comments) setComments(parsed.comments);
          if (parsed.groups) setGroups(parsed.groups);
          if (parsed.bookings) setBookings(parsed.bookings);
          if (parsed.referrals) setReferrals(parsed.referrals);
          if (parsed.adminStudents) setAdminStudents(parsed.adminStudents);
          if (typeof parsed.sidebarCollapsed === 'boolean') setSidebarCollapsed(parsed.sidebarCollapsed);
        }
      } catch {
        // Ignore malformed storage
      } finally {
        setHydrated(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Persist key user state changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          notifications,
          testResults,
          studyPlan,
          studyTasks,
          bookmarks,
          masteredWords,
          writingSubmissions,
          speakingRecordings,
          posts,
          likedPosts,
          comments,
          groups,
          bookings,
          referrals,
          adminStudents,
          sidebarCollapsed,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    hydrated,
    profile,
    notifications,
    testResults,
    studyPlan,
    studyTasks,
    bookmarks,
    masteredWords,
    writingSubmissions,
    speakingRecordings,
    posts,
    likedPosts,
    comments,
    groups,
    bookings,
    referrals,
    adminStudents,
    sidebarCollapsed,
  ]);

  const showToast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const updateProfile = useCallback(
    (patch) => {
      setProfile((prev) => ({
        ...prev,
        ...patch,
        preferences: patch.preferences
          ? { ...prev.preferences, ...patch.preferences }
          : prev.preferences,
      }));
      showToast('Profile settings updated', 'success');
    },
    [showToast]
  );

  const toggleStudyTask = useCallback(
    (taskId) => {
      setStudyTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
      setProfile((prev) => ({ ...prev, xp: prev.xp + 15 }));
    },
    []
  );

  const addStudyTask = useCallback(
    (task) => {
      const next = {
        id: `task-${Date.now()}`,
        day: task.day || 'Today',
        weekday: task.weekday || 'Wed',
        module: task.module || 'Reading',
        title: task.title,
        duration: task.duration || '30 min',
        completed: false,
        href: task.href || '/study-plan',
      };
      setStudyTasks((prev) => [next, ...prev]);
      showToast('Task added to your study plan', 'success');
    },
    [showToast]
  );

  const saveStudyPlan = useCallback(
    (newPlan) => {
      setStudyPlan((prev) => ({ ...prev, ...newPlan }));
      setProfile((prev) => ({
        ...prev,
        targetBand: Number(newPlan.targetBand) || prev.targetBand,
        examDate: newPlan.examDate || prev.examDate,
      }));
      showToast('Study plan saved', 'success');
    },
    [showToast]
  );

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  }, [showToast]);

  const toggleBookmark = useCallback(
    (group, itemId, label = 'Bookmark') => {
      setBookmarks((prev) => {
        const current = prev[group] || [];
        const exists = current.includes(itemId);
        const updated = exists ? current.filter((x) => x !== itemId) : [...current, itemId];
        showToast(exists ? `Removed from ${label}` : `Saved to ${label}`, 'info');
        return { ...prev, [group]: updated };
      });
    },
    [showToast]
  );

  const toggleMasteredWord = useCallback((wordId) => {
    setMasteredWords((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  }, []);

  const addTestResult = useCallback(
    (result) => {
      setTestResults((prev) => [result, ...prev]);
      setProfile((prev) => ({
        ...prev,
        completedTests: prev.completedTests + 1,
        xp: prev.xp + 75,
      }));
      showToast('Test submitted and added to Test Results', 'success');
    },
    [showToast]
  );

  const addWritingSubmission = useCallback((submission) => {
    setWritingSubmissions((prev) => [submission, ...prev]);
  }, []);

  const addSpeakingRecording = useCallback((record) => {
    setSpeakingRecordings((prev) => [record, ...prev]);
  }, []);

  const togglePostLike = useCallback((postId) => {
    setLikedPosts((prev) => {
      const liked = prev.includes(postId);
      setPosts((pList) =>
        pList.map((p) =>
          p.id === postId ? { ...p, likes: Math.max(0, p.likes + (liked ? -1 : 1)) } : p
        )
      );
      return liked ? prev.filter((id) => id !== postId) : [...prev, postId];
    });
  }, []);

  const addCommunityPost = useCallback(
    ({ title, category, content, tags }) => {
      const newPost = {
        id: `post-${Date.now()}`,
        category,
        title,
        content,
        author: {
          name: profile.name,
          avatar: profile.avatar,
          band: String(profile.currentBand),
          country: profile.country,
        },
        createdAt: 'Just now',
        likes: 1,
        tags: tags?.length ? tags : [category],
      };
      setPosts((prev) => [newPost, ...prev]);
      showToast('Post published to Community', 'success');
      return newPost;
    },
    [profile, showToast]
  );

  const addPostComment = useCallback(
    (postId, text) => {
      const newCmt = {
        id: `cmt-${Date.now()}`,
        postId,
        author: profile.name,
        avatar: profile.avatar,
        text,
        createdAt: 'Just now',
        replies: [],
      };
      setComments((prev) => [newCmt, ...prev]);
      showToast('Comment added', 'success');
    },
    [profile, showToast]
  );

  const toggleJoinGroup = useCallback(
    (groupId) => {
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id !== groupId) return g;
          const nextJoined = !g.joined;
          showToast(nextJoined ? `Joined ${g.name}` : `Left ${g.name}`, 'info');
          return {
            ...g,
            joined: nextJoined,
            members: nextJoined ? g.members + 1 : Math.max(0, g.members - 1),
          };
        })
      );
    },
    [showToast]
  );

  const addBooking = useCallback(
    (booking) => {
      const item = {
        id: `bk-${Date.now()}`,
        status: 'Confirmed',
        format: 'Live Video Room (Demo)',
        ...booking,
      };
      setBookings((prev) => [item, ...prev]);
      showToast(`Session confirmed with ${booking.teacherName}`, 'success');
      return item;
    },
    [showToast]
  );

  const addReferralInvite = useCallback(
    (name, email) => {
      const invite = {
        id: `ref-${Date.now()}`,
        name,
        email,
        date: new Date().toISOString().slice(0, 10),
        status: 'Invitation Sent',
        reward: 'Pending',
      };
      setReferrals((prev) => ({
        ...prev,
        rewardSummary: {
          ...prev.rewardSummary,
          invitedCount: prev.rewardSummary.invitedCount + 1,
        },
        invitedFriends: [invite, ...prev.invitedFriends],
      }));
      showToast(`Invitation sent to ${name}`, 'success');
    },
    [showToast]
  );

  const resetDemoProgress = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(defaultProfile);
    setNotifications(defaultNotifications);
    setTestResults(defaultResults);
    setStudyPlan(defaultPlan);
    setStudyTasks(defaultTasks);
    setBookmarks(INITIAL_BOOKMARKS);
    setWritingSubmissions(defaultWritingSubs);
    setPosts(defaultPosts);
    setComments(defaultComments);
    setGroups(defaultGroups);
    setBookings(defaultBookings);
    setReferrals(defaultReferrals);
    showToast('Local demo state reset to defaults', 'info');
  }, [showToast]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        hydrated,
        profile,
        updateProfile,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        testResults,
        addTestResult,
        studyPlan,
        studyTasks,
        toggleStudyTask,
        addStudyTask,
        saveStudyPlan,
        bookmarks,
        toggleBookmark,
        masteredWords,
        toggleMasteredWord,
        writingSubmissions,
        addWritingSubmission,
        speakingRecordings,
        addSpeakingRecording,
        posts,
        likedPosts,
        togglePostLike,
        addCommunityPost,
        comments,
        addPostComment,
        groups,
        toggleJoinGroup,
        bookings,
        addBooking,
        referrals,
        addReferralInvite,
        adminStudents,
        setAdminStudents,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        setMobileNavOpen,
        searchOpen,
        setSearchOpen,
        showToast,
        resetDemoProgress,
      }}
    >
      {children}
      {toasts.length > 0 && (
        <div className="toast-stack" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className="toast-item">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '999px',
                  backgroundColor:
                    t.type === 'success'
                      ? '#39966B'
                      : t.type === 'error'
                      ? '#D95B55'
                      : '#F6BD28',
                  flexShrink: 0,
                }}
              />
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

