'use client';
import styles from './PeopleDirectoryView.module.css';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Calendar,
  GraduationCap,
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { Modal } from '@/components/common/Modal';

import teachersData from '@/data/teachers/teachers.json';
import studentsData from '@/data/students/students.json';

export function PeopleDirectoryView() {
  const { bookings, addBooking, showToast } = useApp();
  const rootRef = useGsapEntrance('people');

  const [tab, setTab] = useState('teachers'); // teachers | students | sessions
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingTopic, setBookingTopic] = useState('Writing Task 2 & Strategy Review');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const param = new URLSearchParams(window.location.search).get('tab');
        if (param === 'sessions' || param === 'students' || param === 'teachers') {
          setTab(param);
        }
      } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const filteredTeachers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachersData.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.specialties.some((s) => s.toLowerCase().includes(q))
    );
  }, [search]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return studentsData.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.studyGoal.toLowerCase().includes(q)
    );
  }, [search]);

  const confirmBooking = (e) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedSlot) return;
    addBooking({
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      topic: bookingTopic,
      slot: selectedSlot,
    });
    setSelectedTeacher(null);
    setTab('sessions');
  };

  return (
    <div ref={rootRef} className={styles.peop_div_1}>
      <PageHeader
        title="IELTS Teachers & Study Partners"
        description="Book 1-on-1 diagnostic consultations with verified IELTS coaches or connect with study partners targeting your band score."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Students / Teachers' }]}
      />

      <div className={styles.peop_div_2}>
        <div className="tabs-list">
          {[
            { id: 'teachers', label: 'IELTS Teachers', icon: GraduationCap, count: teachersData.length },
            { id: 'students', label: 'Study Partners', icon: Users, count: studentsData.length },
            { id: 'sessions', label: 'My Sessions', icon: Calendar, count: bookings.length },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tab-trigger ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={15} />
              <span>{t.label}</span>
              <span className="text-xs text-muted">({t.count})</span>
            </button>
          ))}
        </div>
        {tab !== 'sessions' && (
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or specialty..." className={styles.peop_searchbar_3} />
        )}
      </div>

      {/* Teachers Grid */}
      {tab === 'teachers' && (
        <div className="grid-2">
          {filteredTeachers.map((tch) => (
            <div key={tch.id} data-animate="card" className={`card card-interactive ${styles.peop_div_4}`} >
              <div className={styles.peop_div_5}>
                <SafeAvatar src={tch.avatar} name={tch.name} size={52} radius="14px" />
                <div className={styles.peop_div_6}>
                  <div className={styles.peop_div_7}>
                    <h3 className="h3">{tch.name}</h3>
                    <span className="badge badge-yellow">
                      <Star size={12} fill="currentColor" /> {tch.rating} ({tch.reviewsCount})
                    </span>
                  </div>
                  <div className="text-xs text-muted">{tch.title}</div>
                  <div className={`text-xs text-muted ${styles.peop_div_8}`} >{tch.country} • {tch.experienceYears} yrs exp</div>
                </div>
              </div>

              <p className={`text-xs text-muted ${styles.peop_p_9}`} >{tch.bio}</p>

              <div className={styles.peop_div_10}>
                {tch.specialties.map((s) => (
                  <Badge key={s} variant="purple">{s}</Badge>
                ))}
              </div>

              <div className={styles.peop_div_11}>
                <span className={styles.peop_span_12}>{tch.hourlyRate}</span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedTeacher(tch);
                    setSelectedSlot(tch.availability[0] || '');
                  }}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Partners Directory */}
      {tab === 'students' && (
        <div className="grid-3">
          {filteredStudents.map((stu) => (
            <div key={stu.id} data-animate="card" className={`card ${styles.peop_div_13}`} >
              <div className={styles.peop_div_14}>
                <SafeAvatar src={stu.avatar} name={stu.name} size={44} />
                <div>
                  <div className={styles.peop_div_15}>{stu.name}</div>
                  <div className="text-xs text-muted">{stu.country} • {stu.track}</div>
                </div>
              </div>
              <div className={styles.peop_div_16}>
                <Badge variant="dark">Current {stu.currentBand}</Badge>
                <Badge variant="yellow">Target {stu.targetBand}</Badge>
              </div>
              <p className="text-xs text-muted">{stu.studyGoal}</p>
              <div className={`text-xs text-muted ${styles.peop_div_17}`} >
                <Clock size={12} /> {stu.availability}
              </div>
              <button
                type="button"
                className={`btn btn-secondary btn-sm ${styles.peop_button_18}`}
                
                onClick={() => showToast(`Partner request sent to ${stu.name}`, 'success')}
              >
                <MessageSquare size={14} /> Connect Study Partner
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Booked Sessions */}
      {tab === 'sessions' && (
        <div className={styles.peop_div_4}>
          {bookings.map((bk) => (
            <div key={bk.id} className={`card card-compact ${styles.peop_div_2}`} >
              <div>
                <div className={styles.peop_div_19}>{bk.topic}</div>
                <div className="text-xs text-muted">with {bk.teacherName} • {bk.slot} • {bk.format}</div>
              </div>
              <Badge variant={bk.status === 'Confirmed' ? 'success' : 'neutral'}>
                <CheckCircle2 size={12} /> {bk.status}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Teacher Booking Modal */}
      <Modal
        open={Boolean(selectedTeacher)}
        onClose={() => setSelectedTeacher(null)}
        title={selectedTeacher ? `Book Session with ${selectedTeacher.name}` : ''}
        subtitle={selectedTeacher?.title}
      >
        {selectedTeacher && (
          <form onSubmit={confirmBooking} className={styles.peop_form_20}>
            <div className="field-group">
              <label className="field-label" htmlFor="bk-topic">Session Focus</label>
              <input
                id="bk-topic"
                className="input"
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                required
              />
            </div>

            <div>
              <div className={`field-label ${styles.peop_div_21}`} >Select Available Slot</div>
              <div className="filter-pills">
                {selectedTeacher.availability.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`filter-pill ${selectedSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted">
              Demo booking creates a confirmed placeholder consultation in My Sessions.
            </div>

            <div className={styles.peop_div_22}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeacher(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Confirm Booking</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

