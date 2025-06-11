"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { User } from '../types/user';

export default function WebApp() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sex: "",
    month: "",
    day: "",
    year: "",
    countryCode: "+1",
    phone: ""
  });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('call');
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const countryCodes = ["+1", "+44", "+91"];
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const callTabRef = useRef<HTMLButtonElement>(null);
  const resultsTabRef = useRef<HTMLButtonElement>(null);
  const [tabUnderline, setTabUnderline] = useState({ left: 0, width: 0, grayLeft: 0, grayWidth: 0, mid: 0 });

  const isFormValid =
    form.name.trim() &&
    form.sex &&
    form.month &&
    form.day &&
    form.year &&
    form.countryCode &&
    form.phone.trim();

  // Fetch users from API
  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setCalculatedAge(new Date().getFullYear() - Number(selectedUser.year));
      setActiveTab('call');
    } else {
      setCalculatedAge(null);
      setActiveTab('call');
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!callTabRef.current || !resultsTabRef.current || !tabContainerRef.current) return;
    const callRect = callTabRef.current.getBoundingClientRect();
    const resultsRect = resultsTabRef.current.getBoundingClientRect();
    const containerRect = tabContainerRef.current.getBoundingClientRect();
    const buffer = 16; // px buffer on each side (reduced)
    const grayLeft = callRect.left - containerRect.left;
    const grayRight = resultsRect.right - containerRect.left + buffer;
    const grayWidth = grayRight - grayLeft;
    const mid = (callRect.right + resultsRect.left) / 2 - containerRect.left;
    let left = grayLeft;
    let width = mid - grayLeft + 8; // extend blue underline 12px past midpoint
    if (activeTab === 'results') {
      left = mid + 8; // start blue underline 12px past midpoint
      width = grayRight - left;
    }
    setTabUnderline({ left, width, grayLeft, grayWidth, mid });
  }, [activeTab, selectedUser]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newUser: User = await res.json();
      setUsers(u => [...u, newUser]);
      setShowModal(false);
      setForm({ name: "", sex: "", month: "", day: "", year: "", countryCode: "+1", phone: "" });
      setSelectedUser(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden relative">
      {/* Header Bar */}
      <header className="w-full flex items-center justify-between px-8" style={{height: 72, borderBottom: '1px solid #d9d9d9', background: 'white'}}>
        <div className="flex items-center gap-3 py-3">
          <Image src="/logo.png" alt="CogniCheck Logo" width={100} height={40} priority />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-[#303030] font-medium text-base hover:underline" style={{fontSize: 14}}>
            Logout
            <span className="ml-1 flex items-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13.1697H2.33333C1.97971 13.1697 1.64057 13.0292 1.39052 12.7792C1.14048 12.5291 1 12.19 1 11.8363V2.50301C1 2.14939 1.14048 1.81025 1.39052 1.5602C1.64057 1.31015 1.97971 1.16968 2.33333 1.16968H5M9.66667 10.503L13 7.16968M13 7.16968L9.66667 3.83634M13 7.16968H5" stroke="#1E1E1E" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </header>
      {/* Main Content - fills below header, no page scroll */}
      <div className="flex flex-row gap-6 bg-white p-6" style={{height: 'calc(100vh - 72px)', overflow: 'hidden'}}>
        {/* User List Sidebar */}
        <aside className="w-[301px] min-w-[260px] max-w-[340px] bg-white border border-[#d9d9d9] rounded-lg flex flex-col p-6 gap-6 h-full" style={{height: '100%'}}>
          <div className="flex flex-col gap-4">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 h-12 rounded-lg border border-[#20669f] bg-[#20669f]/20 text-[#20669f] font-medium text-lg shadow hover:bg-[#20669f]/30 transition-all"
              style={{fontWeight: 500}}
              onClick={() => setShowModal(true)}
            >
              Create User
            </button>
            <input
              type="text"
              placeholder="Search User"
              className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div
            className="flex-1 flex flex-col gap-2 overflow-y-auto"
            onClick={e => {
              if (editMode) return;
              if (e.target === e.currentTarget) setSelectedUser(null);
            }}
          >
            {/* User list will go here */}
            {users.length === 0 ? (
              <div className="text-[#20669f] text-base text-center mt-8">Add a user to see them here.</div>
            ) : (
              users.map(user => {
                const initials = user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase();
                const isSelected = selectedUser && selectedUser.id === user.id;
                return (
                <button
                  key={user.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-base shadow transition-all text-[#303030] font-medium ${isSelected ? 'bg-[#20669f]/20 border-2 border-[#20669f]' : 'bg-[#20669f]/[.07] border-[#20669f] hover:bg-[#20669f]/20'}`}
                    onClick={() => { if (!editMode) setSelectedUser(user); }}
                    disabled={editMode}
                >
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-[#20669f] text-white font-bold text-lg">
                      {initials}
                    </span>
                    <span className="text-[#303030]">{user.name}</span>
                </button>
                );
              })
            )}
          </div>
        </aside>
        {/* User Content Area */}
        <section className="flex-1 bg-white border border-[#d9d9d9] rounded-lg flex flex-col items-start justify-start h-full p-6" style={{height: '100%'}}>
          {selectedUser ? (
            <div className="w-full max-w-full flex flex-col gap-0 h-full relative">
              {/* User Info/Notes Box (Top) */}
              <div className="bg-white rounded-xl border border-[#d9d9d9] p-8 flex flex-col gap-6 shadow-sm z-10">
                {/* Top Row: Avatar, Name, Info, Actions */}
                <div className="flex flex-row items-center justify-between gap-6">
                  <div className="flex flex-row items-center gap-6">
                    {/* Avatar */}
                    <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#20669f] text-white font-bold text-2xl select-none">
                      {(editMode ? editUser?.name || '' : selectedUser.name).split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                    <div className="flex flex-col gap-1">
                      {editMode ? (
                        <input
                          className="text-2xl font-semibold text-[#181e25] bg-white border border-[#d9d9d9] rounded-lg px-2 py-1 w-[260px]"
                          value={editUser?.name || ''}
                          onChange={e => setEditUser(u => u ? { ...u, name: e.target.value } : u)}
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-[#181e25]">{selectedUser.name}</span>
                      )}
                      <div className="flex flex-row flex-wrap gap-6 text-base items-center">
                        <span className="text-[#20669f] flex flex-row items-center gap-2">Phone Number: {editMode ? (
                          <>
                            <select
                              className="border border-[#d9d9d9] rounded-lg px-2 py-1 text-base"
                              value={editUser?.countryCode || ''}
                              onChange={e => setEditUser(u => u ? { ...u, countryCode: e.target.value } : u)}
                            >
                              {countryCodes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input
                              className="border border-[#d9d9d9] rounded-lg px-2 py-1 w-[120px]"
                              value={editUser?.phone || ''}
                              onChange={e => setEditUser(u => u ? { ...u, phone: e.target.value } : u)}
                            />
                          </>
                        ) : (
                          <span className="font-semibold">{selectedUser.countryCode} {selectedUser.phone}</span>
                        )}</span>
                        <span className="text-[#20669f] flex flex-row items-center gap-2">Date of Birth: {editMode ? (
                          <>
                            <select
                              className="border border-[#d9d9d9] rounded-lg px-2 py-1"
                              value={editUser?.month || ''}
                              onChange={e => setEditUser(u => u ? { ...u, month: e.target.value } : u)}
                            >
                              {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select
                              className="border border-[#d9d9d9] rounded-lg px-2 py-1"
                              value={editUser?.day || ''}
                              onChange={e => setEditUser(u => u ? { ...u, day: e.target.value } : u)}
                            >
                              {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select
                              className="border border-[#d9d9d9] rounded-lg px-2 py-1"
                              value={editUser?.year || ''}
                              onChange={e => setEditUser(u => u ? { ...u, year: e.target.value } : u)}
                            >
                              {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </>
                        ) : (
                          <span className="font-semibold">{selectedUser.month} {selectedUser.day} {selectedUser.year}</span>
                        )}</span>
                        {!editMode && calculatedAge !== null && (
                          <span className="text-[#20669f]">Age: <span className="font-semibold">{calculatedAge}</span></span>
                        )}
                        <span className="text-[#20669f] flex flex-row items-center gap-2">Sex: {editMode ? (
                          <select
                            className="border border-[#d9d9d9] rounded-lg px-2 py-1"
                            value={editUser?.sex || ''}
                            onChange={e => setEditUser(u => u ? { ...u, sex: e.target.value } : u)}
                          >
                            <option value="" disabled>Select sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <span className="font-semibold capitalize">{selectedUser.sex}</span>
                        )}</span>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-row gap-4 min-w-[120px]">
                    {editMode ? (
                      <>
                        <button
                          type="button"
                          className="px-6 h-10 rounded-lg border border-[#20669f] bg-[#20669f]/20 text-[#20669f] font-medium text-base hover:bg-[#20669f]/30 transition-all min-w-[120px] whitespace-nowrap"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!editUser) return;
                            setSaveLoading(true);
                            setSaveError(null);
                            try {
                              const res = await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(editUser)
                              });
                              if (!res.ok) throw new Error('Failed to save changes');
                              const updated = await res.json();
                              setUsers(users => users.map(u => u.id === updated.id ? updated : u));
                              setSelectedUser(updated);
                              setEditMode(false);
                              setEditUser(null);
                            } catch (err: any) {
                              setSaveError(err.message || 'Unknown error');
                            } finally {
                              setSaveLoading(false);
                            }
                          }}
                          disabled={saveLoading}
                        >{saveLoading ? 'Saving...' : 'Save'}</button>
                        {saveError && <span className="text-red-500 text-sm ml-2">{saveError}</span>}
                        <button
                          className="px-5 h-10 rounded-lg border border-[#e74c3c] bg-[#e74c3c]/10 text-[#e74c3c] font-medium text-base hover:bg-[#e74c3c]/20 transition-all min-w-[90px]"
                          onClick={() => { setEditMode(false); setEditUser(null); }}
                          disabled={saveLoading}
                        >Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="px-6 h-10 rounded-lg border border-[#20669f] bg-[#20669f]/20 text-[#20669f] font-medium text-base hover:bg-[#20669f]/30 transition-all min-w-[120px] whitespace-nowrap"
                          onClick={() => { setEditMode(true); setEditUser(selectedUser); }}
                        >Edit Details</button>
                        <button
                          className="px-5 h-10 rounded-lg border border-[#e74c3c] bg-[#e74c3c]/10 text-[#e74c3c] font-medium text-base hover:bg-[#e74c3c]/20 transition-all min-w-[90px]"
                          onClick={async () => {
                            if (!selectedUser) return;
                            if (!window.confirm('Are you sure you want to delete this user?')) return;
                            setDeleteLoading(true);
                            setDeleteError(null);
                            try {
                              const res = await fetch(`/api/users/${selectedUser.id}`, { method: 'DELETE' });
                              if (!res.ok) throw new Error('Failed to delete user');
                              setUsers(users => users.filter(u => u.id !== selectedUser.id));
                              setSelectedUser(null);
                            } catch (err: any) {
                              setDeleteError(err.message || 'Unknown error');
                            } finally {
                              setDeleteLoading(false);
                            }
                          }}
                          disabled={deleteLoading}
                        >{deleteLoading ? 'Deleting...' : 'Delete'}</button>
                        {deleteError && <span className="text-red-500 text-sm ml-2">{deleteError}</span>}
                      </>
                    )}
                  </div>
                </div>
                {/* Notes Box */}
                <div className="w-full mt-2 mb-2">
                  <label className="block text-[#20669f] font-semibold text-base mb-1" htmlFor="notes">Notes:</label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[48px] max-h-[120px] border border-[#d9d9d9] rounded-lg px-4 py-2 text-base text-[#303030] bg-white placeholder-[#b3b3b3] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder={'eg. "Mentioned short-term memory concerns."'}
                    value={selectedUser.notes || ''}
                    onChange={async (e) => {
                      const notes = e.target.value;
                      setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, notes } : u));
                      setSelectedUser(u => u ? { ...u, notes } : u);
                      await fetch(`/api/users/${selectedUser.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes })
                      });
                    }}
                    style={{fontStyle: 'italic'}}
                  />
                </div>
              </div>
              {/* Tabs for Call Configuration and Results (floating in whitespace) */}
              <div className="w-full flex flex-col items-start px-2" style={{ margin: '18px 0 18px 0', position: 'relative' }}>
                <div ref={tabContainerRef} className="flex flex-row gap-2 relative z-10" style={{width: 'fit-content'}}>
                  <button
                    ref={callTabRef}
                    className={`px-2 pb-1 text-base font-medium bg-transparent border-none outline-none transition-all ${activeTab === 'call' ? 'text-[#20669f]' : 'text-[#888]'}`}
                    onClick={() => setActiveTab('call')}
                    type="button"
                  >
                    Call Configuration
                  </button>
                  <button
                    ref={resultsTabRef}
                    className={`px-2 pb-1 text-base font-medium bg-transparent border-none outline-none transition-all ${activeTab === 'results' ? 'text-[#20669f]' : 'text-[#888]'}`}
                    onClick={() => setActiveTab('results')}
                    type="button"
                  >
                    Results
                  </button>
                </div>
                {/* Gray underline (only under tabs + buffer) */}
                <div
                  className="absolute h-[2px] bg-[#e5e7eb] z-0"
                  style={{
                    left: tabUnderline.grayLeft,
                    width: tabUnderline.grayWidth,
                    bottom: 0,
                    borderRadius: 2
                  }}
                />
                {/* Blue underline (active tab only, from buffer to midpoint or midpoint to buffer) */}
                <div
                  className="absolute h-[2px] bg-[#20669f] z-10 transition-all duration-200"
                  style={{
                    left: tabUnderline.left,
                    width: tabUnderline.width,
                    bottom: 0,
                    borderRadius: 2
                  }}
                />
              </div>
              {/* Call Config/Results Box (Bottom) */}
              <div className="bg-white rounded-xl border border-[#d9d9d9] flex-1 min-h-[320px] flex flex-col justify-between p-8 z-0 shadow-sm" style={{paddingBottom: 32}}>
                {activeTab === 'call' && (
                  <div className="w-full flex flex-row gap-6 h-full">
                    {/* Left: Call Config Form */}
                    <div className="flex-1 flex flex-col gap-4 h-full">
                      <div>
                        <span className="text-[#20669f] font-medium text-base">Select Days Available:</span>
                        <div className="flex flex-row gap-2 mt-2 mb-2">
                          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                            <button
                              key={day}
                              type="button"
                              className={`px-4 py-2 rounded-lg border text-base font-medium transition-all focus:outline-none ${selectedUser.daysAvailable?.includes(day) ? 'bg-[#20669f] text-white border-[#20669f]' : 'bg-[#f3f3f3] text-[#888] border-[#e0e0e0]'}`}
                              onClick={async () => {
                                const daysAvailable = selectedUser.daysAvailable?.includes(day)
                                  ? selectedUser.daysAvailable.filter(d => d !== day)
                                  : [...(selectedUser.daysAvailable || []), day];
                                setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, daysAvailable } : u));
                                setSelectedUser(u => u ? { ...u, daysAvailable } : u);
                                await fetch(`/api/users/${selectedUser.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ daysAvailable })
                                });
                              }}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row gap-6 items-end">
                        <div className="flex flex-col">
                          <label className="text-[#20669f] font-medium text-base mb-1">From:</label>
                          <select
                            className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-base min-w-[120px]"
                            value={selectedUser.fromTime || ''}
                            onChange={async (e) => {
                              const fromTime = e.target.value;
                              setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, fromTime } : u));
                              setSelectedUser(u => u ? { ...u, fromTime } : u);
                              await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ fromTime })
                              });
                            }}
                          >
                            <option value="">Select</option>
                            {[
                              "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
                            ].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[#20669f] font-medium text-base mb-1">To:</label>
                          <select
                            className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-base min-w-[120px]"
                            value={selectedUser.toTime || ''}
                            onChange={async (e) => {
                              const toTime = e.target.value;
                              setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, toTime } : u));
                              setSelectedUser(u => u ? { ...u, toTime } : u);
                              await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ toTime })
                              });
                            }}
                          >
                            <option value="">Select</option>
                            {[
                              "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
                            ].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[#20669f] font-medium text-base mb-1">Frequency:</label>
                          <select
                            className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-base min-w-[120px]"
                            value={selectedUser.frequency || 'Bi-Weekly'}
                            onChange={async (e) => {
                              const frequency = e.target.value;
                              setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, frequency } : u));
                              setSelectedUser(u => u ? { ...u, frequency } : u);
                              await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ frequency })
                              });
                            }}
                          >
                            {['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'].map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[#20669f] font-medium text-base mb-1">Callbacks/day:</label>
                          <select
                            className="border border-[#d9d9d9] rounded-lg px-3 py-2 text-base min-w-[80px]"
                            value={selectedUser.callbacksPerDay?.toString() || '3'}
                            onChange={async (e) => {
                              const callbacksPerDay = Number(e.target.value);
                              setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, callbacksPerDay } : u));
                              setSelectedUser(u => u ? { ...u, callbacksPerDay } : u);
                              await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ callbacksPerDay })
                              });
                            }}
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col mt-2 flex-1">
                        <label className="text-[#20669f] font-medium text-base mb-1">Personal Context (about {selectedUser.name.split(' ')[0]}):</label>
                        <textarea
                          className="w-full min-h-[80px] max-h-[160px] border border-[#d9d9d9] rounded-lg px-4 py-2 text-base text-[#303030] bg-white placeholder-[#b3b3b3] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder={`eg. "${selectedUser.name.split(' ')[0]} is a big fan of camping, he goes often"`}
                          value={selectedUser.personalContext || ''}
                          onChange={async (e) => {
                            const personalContext = e.target.value;
                            setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, personalContext } : u));
                            setSelectedUser(u => u ? { ...u, personalContext } : u);
                            await fetch(`/api/users/${selectedUser.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ personalContext })
                            });
                          }}
                          style={{fontStyle: 'italic'}}
                        />
                      </div>
                      {/* Spacer to push controls to bottom */}
                      <div className="flex-1" />
                      {/* Controls at the bottom */}
                      <div className="flex flex-row items-center mt-4 w-full">
                        <div className="flex-1">
                          <button
                            className="px-6 h-10 rounded-lg border border-[#b3b3b3] bg-[#eaeaea] text-[#888] font-medium text-base cursor-not-allowed"
                            type="button"
                            disabled
                          >
                            Initiate Manual Call
                          </button>
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-end">
                          <span className={`font-semibold text-base ${selectedUser.receivingCalls ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedUser.receivingCalls ? 'User Receiving Calls' : 'User Not Receiving Calls'}
                          </span>
                          <button
                            className={`px-6 h-10 rounded-lg border font-medium text-base transition-all ${selectedUser.receivingCalls ? 'border-[#e74c3c] bg-[#e74c3c]/10 text-[#e74c3c] hover:bg-[#e74c3c]/20' : 'border-[#27ae60] bg-[#27ae60]/10 text-[#27ae60] hover:bg-[#27ae60]/20'}`}
                            type="button"
                            onClick={async () => {
                              const receivingCalls = !selectedUser.receivingCalls;
                              setUsers(users => users.map(u => u.id === selectedUser.id ? { ...u, receivingCalls } : u));
                              setSelectedUser(u => u ? { ...u, receivingCalls } : u);
                              await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ receivingCalls })
                              });
                            }}
                          >
                            {selectedUser.receivingCalls ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Right: Call History Placeholder */}
                    <div className="w-[380px] min-w-[320px] max-w-[420px] bg-white border border-[#d9d9d9] rounded-xl p-6 flex flex-col gap-2 h-full">
                      <span className="text-[#20669f] font-semibold text-lg mb-2">Call History</span>
                      <div className="border-b border-[#d9d9d9] mb-2" />
                      <span className="text-[#b3b3b3] text-base italic">Once the user has been called, their call history will appear here.</span>
                    </div>
                  </div>
                )}
                {activeTab === 'results' && (
                  <div className="w-full flex flex-col items-center justify-center h-full text-[#b3b3b3] italic text-lg">No results yet.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[#20669f] text-xl font-medium mt-8 ml-8">Select or add a user to configure and view results.</div>
          )}
        </section>
      </div>
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.12)'}}>
          <div className="bg-white border border-[#d9d9d9] rounded-xl shadow-xl w-[500px] max-w-full p-8 flex flex-col gap-6" style={{boxShadow: '0 2px 16px rgba(0,0,0,0.10)'}}>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Row 1: Full Name & Sex */}
              <div className="flex flex-row gap-4">
                <div className="flex-1 flex flex-col">
                  <label className="block text-[#20669f] font-semibold text-lg mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="w-[180px] flex flex-col">
                  <label className="block text-[#20669f] font-semibold text-lg mb-2">Sex</label>
                  <select
                    className="w-full px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.sex}
                    onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}
                  >
                    <option value="" disabled>Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {/* Row 2: Date of Birth */}
              <div className="flex flex-col">
                <label className="block text-[#20669f] font-semibold text-lg mb-2">Date of Birth</label>
                <div className="flex flex-row gap-4">
                  <select
                    className="flex-1 px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.month}
                    onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                  >
                    <option value="" disabled>Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    className="w-[100px] px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.day}
                    onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
                  >
                    <option value="" disabled>Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select
                    className="w-[110px] px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.year}
                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  >
                    <option value="" disabled>Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              {/* Row 3: Phone Number */}
              <div className="flex flex-col">
                <label className="block text-[#20669f] font-semibold text-lg mb-1">Phone Number</label>
                <span className="text-[#b3b3b3] text-base mb-2">This phone number will be used to call the user.</span>
                <div className="flex flex-row gap-4">
                  <select
                    className="w-[80px] px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.countryCode}
                    onChange={e => setForm(f => ({ ...f, countryCode: e.target.value }))}
                  >
                    <option value="" disabled>Code</option>
                    {countryCodes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="tel"
                    className="flex-1 px-4 py-3 border border-[#d9d9d9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="647 123 4567"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              {/* Modal Actions */}
              <div className="flex flex-row gap-6 justify-between mt-2">
                <button type="button" className="flex-1 h-12 rounded-lg border border-[#e74c3c] bg-[#e74c3c]/10 text-[#e74c3c] font-semibold text-lg hover:bg-[#e74c3c]/20 transition-all" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 h-12 rounded-lg border border-[#20669f] bg-[#20669f]/10 text-[#20669f] font-semibold text-lg transition-all ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#20669f]/20'}`}
                  disabled={!isFormValid}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
