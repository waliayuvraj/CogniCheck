"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// User type for state
interface User {
  id: string;
  name: string;
  sex: string;
  month: string;
  day: string;
  year: string;
  countryCode: string;
  phone: string;
  createdAt: string;
}

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
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const countryCodes = ["+1", "+44", "+91"];

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
            <div className="w-full max-w-full bg-white rounded-xl border border-[#d9d9d9] p-8 flex flex-col gap-6 shadow-sm">
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
                      {!editMode && (
                        <span className="text-[#20669f]">Age: <span className="font-semibold">{new Date().getFullYear() - Number(selectedUser.year)}</span></span>
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
                          // Save changes to API (no trailing slash)
                          const res = await fetch(`/api/users/${selectedUser.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editUser)
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setUsers(users => users.map(u => u.id === updated.id ? updated : u));
                            setSelectedUser(updated);
                            setEditMode(false);
                            setEditUser(null);
                          }
                        }}
                      >Save</button>
                      <button
                        className="px-5 h-10 rounded-lg border border-[#e74c3c] bg-[#e74c3c]/10 text-[#e74c3c] font-medium text-base hover:bg-[#e74c3c]/20 transition-all min-w-[90px]"
                        onClick={() => { setEditMode(false); setEditUser(null); }}
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
                        // TODO: implement delete logic
                      >Delete</button>
                    </>
                  )}
                </div>
              </div>
              {/* Placeholder for additional content below, e.g. notes, tabs, etc. */}
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
