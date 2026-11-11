'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';

function EditProfileForm({ profile, updateProfile, onClose }) {
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city || '');
  const [country, setCountry] = useState(profile.country || '');
  const [track, setTrack] = useState(profile.track || 'Academic');
  const [bio, setBio] = useState(profile.bio || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    updateProfile({ name: name.trim(), city: city.trim(), country: country.trim(), track, bio: bio.trim() });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="field-group">
        <label className="field-label" htmlFor="edit-name">Full Name</label>
        <input id="edit-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
        {error && <span className="field-error">{error}</span>}
      </div>
      <div className="grid-2">
        <div className="field-group">
          <label className="field-label" htmlFor="edit-city">City</label>
          <input id="edit-city" className="input" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="edit-country">Country</label>
          <input id="edit-country" className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="edit-track">IELTS Track</label>
        <select id="edit-track" className="select" value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="Academic">IELTS Academic</option>
          <option value="General Training">IELTS General Training</option>
        </select>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="edit-bio">Study Goal / Bio</label>
        <textarea id="edit-bio" className="textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </div>
    </form>
  );
}

export function EditProfileModal({ open, onClose }) {
  const { profile, updateProfile } = useApp();
  return (
    <Modal open={open} onClose={onClose} title="Edit Student Profile" subtitle="Keep your IELTSWIST learning profile current.">
      {open && <EditProfileForm profile={profile} updateProfile={updateProfile} onClose={onClose} />}
    </Modal>
  );
}

function TargetBandForm({ initialTarget, updateProfile, onClose }) {
  const [target, setTarget] = useState(String(initialTarget));
  const bands = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ targetBand: Number(target) });
    onClose();
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {bands.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setTarget(b)}
            className={`filter-pill ${target === b ? 'active' : ''}`}
            style={{ minWidth: 64, justifyContent: 'center' }}
          >
            Band {b}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Update Target</button>
      </div>
    </form>
  );
}

export function TargetBandModal({ open, onClose }) {
  const { profile, updateProfile } = useApp();
  return (
    <Modal open={open} onClose={onClose} title="Set IELTS Target Band" subtitle="Choose your desired overall band score.">
      {open && <TargetBandForm initialTarget={profile.targetBand} updateProfile={updateProfile} onClose={onClose} />}
    </Modal>
  );
}

function ScheduleExamForm({ initialDate, updateProfile, onClose }) {
  const [examDate, setExamDate] = useState(initialDate || '2026-12-18');

  const handleSave = (e) => {
    e.preventDefault();
    if (!examDate) return;
    updateProfile({ examDate });
    onClose();
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="field-group">
        <label className="field-label" htmlFor="exam-date-input">Exam Date</label>
        <input
          id="exam-date-input"
          type="date"
          className="input"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          required
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Exam Date</button>
      </div>
    </form>
  );
}

export function ScheduleExamModal({ open, onClose }) {
  const { profile, updateProfile } = useApp();
  return (
    <Modal open={open} onClose={onClose} title="Schedule Exam Date" subtitle="Track days remaining to your official IELTS sitting.">
      {open && <ScheduleExamForm initialDate={profile.examDate} updateProfile={updateProfile} onClose={onClose} />}
    </Modal>
  );
}

export function CreateStudyTaskModal({ open, onClose }) {
  const { addStudyTask } = useApp();
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('Writing');
  const [duration, setDuration] = useState('30 min');
  const [error, setError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please describe the study task.');
      return;
    }
    const routeByMod = {
      Reading: '/reading',
      Listening: '/listening',
      Writing: '/writing',
      Speaking: '/speaking',
      Vocabulary: '/vocabulary',
    };
    addStudyTask({
      title: title.trim(),
      module,
      duration,
      day: 'Today',
      href: routeByMod[module] || '/study-plan',
    });
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Study Plan Task" subtitle="Schedule a focused IELTS drill for today.">
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field-group">
          <label className="field-label" htmlFor="task-title">Task Description</label>
          <input
            id="task-title"
            className="input"
            placeholder="e.g., Complete 2 Matching Headings passages"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <span className="field-error">{error}</span>}
        </div>
        <div className="grid-2">
          <div className="field-group">
            <label className="field-label" htmlFor="task-mod">Module</label>
            <select id="task-mod" className="select" value={module} onChange={(e) => setModule(e.target.value)}>
              <option value="Reading">Reading</option>
              <option value="Listening">Listening</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
              <option value="Vocabulary">Vocabulary</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="task-dur">Duration</label>
            <select id="task-dur" className="select" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="15 min">15 min</option>
              <option value="25 min">25 min</option>
              <option value="30 min">30 min</option>
              <option value="45 min">45 min</option>
              <option value="60 min">60 min</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Add to Today</button>
        </div>
      </form>
    </Modal>
  );
}
