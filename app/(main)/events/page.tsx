'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Check, Globe, Clock, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [locationType, setLocationType] = useState<'online' | 'in_person'>('online');
  const [locationDetails, setLocationDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = () => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRsvp = async (eventId: string, currentRsvp: string | null) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentRsvp ? null : 'going' }),
      });
      const data = await res.json();
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === eventId) {
            const hadRsvp = Boolean(e.user_rsvp);
            return {
              ...e,
              user_rsvp: data.rsvp,
              attendees_count: hadRsvp ? Math.max(0, e.attendees_count - 1) : e.attendees_count + 1,
            };
          }
          return e;
        })
      );
    } catch (err) {
      console.error('RSVP error:', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startTime) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          start_time: startTime,
          location_type: locationType,
          location_details: locationDetails,
        }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setStartTime('');
        setLocationDetails('');
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) {
      console.error('Create event error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-reelo-border">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-reelo-secondary" />
            <h1 className="text-xl sm:text-2xl font-black text-reelo-primary tracking-tight">
              Events & Gatherings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-reelo-muted mt-1">
            Discover design jams, developer hackathons, and creative meetups.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="self-start sm:self-auto font-bold"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Schedule Event
        </Button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-8 text-center text-reelo-muted space-y-2">
          <div className="w-7 h-7 rounded-full border-2 border-reelo-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-xs">Loading upcoming universe events...</p>
        </div>
      ) : events.length === 0 ? (
        <Card className="p-8 text-center text-reelo-muted bg-white border-reelo-border">
          <p className="text-sm font-medium">No events scheduled yet. Host your first meetup!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => {
            const isGoing = ev.user_rsvp === 'going';
            const dateStr = new Date(ev.start_time).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Card
                key={ev.id}
                className="overflow-hidden bg-white border-reelo-border shadow-subtle hover:border-reelo-borderHover transition-all flex flex-col justify-between"
              >
                <div>
                  {ev.cover_url && (
                    <div className="relative h-44 w-full bg-reelo-surfaceMuted overflow-hidden">
                      <img src={ev.cover_url} alt={ev.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-reelo-primary/90 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-reelo-primary leading-snug">{ev.title}</h3>
                      <p className="text-xs text-reelo-muted leading-relaxed line-clamp-2">{ev.description}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-reelo-muted pt-1 border-t border-reelo-border">
                      <div className="flex items-center gap-1.5">
                        {ev.location_type === 'online' ? (
                          <Globe className="w-3.5 h-3.5 text-reelo-secondary" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-reelo-secondary" />
                        )}
                        <span className="font-medium text-reelo-text truncate">
                          {ev.location_details || (ev.location_type === 'online' ? 'Online Session' : 'Venue TBA')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-reelo-secondary" />
                        <span>{ev.attendees_count} people attending</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <Button
                    variant={isGoing ? 'secondary' : 'primary'}
                    size="sm"
                    className="w-full font-bold justify-center"
                    onClick={() => handleRsvp(ev.id, ev.user_rsvp)}
                  >
                    {isGoing ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 stroke-[3]" />
                        <span>RSVP Confirmed (Going)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-white" />
                        <span>RSVP for Event</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-reelo-border shadow-card space-y-4">
            <h3 className="text-lg font-black text-reelo-primary">Schedule a Gathering</h3>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <Input
                label="Event Title"
                placeholder="e.g. Creative Code & Shader Jam"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-reelo-text">Description</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-reelo-border text-xs text-reelo-text bg-white outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary"
                  rows={3}
                  placeholder="What will happen during this session?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Date & Time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />

              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-reelo-text">Location Format</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="locType"
                      checked={locationType === 'online'}
                      onChange={() => setLocationType('online')}
                    />
                    <span>Online (URL / Live Stage)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="locType"
                      checked={locationType === 'in_person'}
                      onChange={() => setLocationType('in_person')}
                    />
                    <span>In-Person</span>
                  </label>
                </div>
              </div>

              <Input
                label="Location Details / Join Link"
                placeholder="e.g. Live Room #42 or Bangalore Tech Hub"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Publish Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
