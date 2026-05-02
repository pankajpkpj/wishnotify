'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type Contact = {
  id: string
  name: string
  phone_number?: string | null
  notes?: string | null
}

type Event = {
  id: string
  contact_id: string
  event_type: string
  event_name?: string | null
  event_date: string
  reminder_preference: string
  delivery_method: string
  notes?: string | null
  contact?: { name: string } | null
}

export default function DashboardClient({
  user,
  contacts: initialContacts,
  events: initialEvents,
}: {
  user: { email: string; name: string }
  contacts: Contact[]
  events: Event[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const [activeTab, setActiveTab] = useState<'contacts' | 'events'>('contacts')

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', phone: '', notes: '' })

  // Event form state
  const [showEventForm, setShowEventForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    contact_id: '',
    event_type: 'birthday',
    event_name: '',
    event_date: '',
    reminder_preference: 'both',
    delivery_method: 'whatsapp',
    notes: '',
  })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Add contact
  const addContact = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: newContact.name,
        phone_number: newContact.phone || null,
        notes: newContact.notes || null,
      })
      .select()
      .single()

    if (!error && data) {
      setContacts([...contacts, data])
      setNewContact({ name: '', phone: '', notes: '' })
      setShowContactForm(false)
    } else {
      console.error('Error adding contact:', error)
    }
  }

  // Add event
  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('events')
      .insert({
        contact_id: newEvent.contact_id,
        event_type: newEvent.event_type,
        event_name: newEvent.event_name || null,
        event_date: newEvent.event_date,
        reminder_preference: newEvent.reminder_preference,
        delivery_method: newEvent.delivery_method,
        notes: newEvent.notes || null,
      })
      .select('*, contact:contacts(name)')
      .single()

    if (!error && data) {
      setEvents([...events, data])
      setNewEvent({
        contact_id: '',
        event_type: 'birthday',
        event_name: '',
        event_date: '',
        reminder_preference: 'both',
        delivery_method: 'whatsapp',
        notes: '',
      })
      setShowEventForm(false)
    } else {
      console.error('Error adding event:', error)
    }
  }

  // Delete contact
  const deleteContact = async (id: string) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (!error) {
      setContacts(contacts.filter(c => c.id !== id))
      // Also remove events related to this contact from local state
      setEvents(events.filter(e => e.contact_id !== id))
    }
  }

  // Delete event
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (!error) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-black">
            WishNotify<span className="text-gray-400">.</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'events'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Upcoming Events ({events.length})
          </button>
        </div>

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-black">Your Contacts</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
              >
                + Add Contact
              </button>
            </div>

            {/* Add Contact Form */}
            {showContactForm && (
              <form onSubmit={addContact} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                    <input
                      type="text"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea
                      value={newContact.notes}
                      onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                      rows={2}
                      placeholder="Any extra info..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            {/* Contacts List */}
            <div className="grid gap-4">
              {contacts.length === 0 ? (
                <p className="text-gray-500 text-sm">No contacts yet. Add your first one!</p>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start justify-between shadow-sm hover:border-gray-300 transition"
                  >
                    <div>
                      <h3 className="font-semibold text-black">{contact.name}</h3>
                      {contact.phone_number && (
                        <p className="text-sm text-gray-500 mt-1">{contact.phone_number}</p>
                      )}
                      {contact.notes && (
                        <p className="text-sm text-gray-400 mt-1">{contact.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m4 0V4m6 0v2" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-black">Upcoming Reminders</h2>
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
              >
                + Add Event
              </button>
            </div>

            {/* Add Event Form */}
            {showEventForm && (
              <form onSubmit={addEvent} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                    <select
                      required
                      value={newEvent.contact_id}
                      onChange={(e) => setNewEvent({ ...newEvent, contact_id: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                    >
                      <option value="">Select a contact</option>
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                    <select
                      required
                      value={newEvent.event_type}
                      onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                    >
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="graduation">Graduation</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name (if custom)</label>
                    <input
                      type="text"
                      value={newEvent.event_name}
                      onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                      placeholder="e.g., Graduation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Preference</label>
                    <select
                      value={newEvent.reminder_preference}
                      onChange={(e) => setNewEvent({ ...newEvent, reminder_preference: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                    >
                      <option value="day_before">Day before</option>
                      <option value="day_of">Day of</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
                    <select
                      value={newEvent.delivery_method}
                      onChange={(e) => setNewEvent({ ...newEvent, delivery_method: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-black focus:outline-none"
                      rows={2}
                      placeholder="Any extra info..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            )}

            {/* Events List */}
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming events. Add one to start getting reminders!</p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-gray-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-black">
                          {event.contact?.name || 'Unknown'}
                        </h3>
                        <span className="text-gray-400 text-sm">·</span>
                        <span className="text-sm text-gray-600">
                          {event.event_name || event.event_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(event.event_date)} — {event.reminder_preference.replace('_', ' ')} via {event.delivery_method}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m4 0V4m6 0v2" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}