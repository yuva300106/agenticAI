import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Building,
} from 'lucide-react';
import { EventCategory, CampusEvent } from '../../types';

export const DiscoverOpportunities: React.FC = () => {
  const {
    events,
    interestedEventIds,
    registeredEventIds,
    toggleInterest,
    registerForEvent,
    setSelectedEventForModal,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [onlyClosingSoon, setOnlyClosingSoon] = useState(false);
  const [onlyRecommended, setOnlyRecommended] = useState(false);

  const categories = [
    'All',
    'Hackathons',
    'Workshops',
    'Competitions',
    'Seminars',
    'Internships',
    'Scholarships',
    'Club Events',
    'External Opportunities',
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = evt.title.toLowerCase().includes(q);
        const matchesOrg = evt.organizer.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesSkills = evt.skills.some((s) => s.toLowerCase().includes(q));
        const matchesCategory = evt.category.toLowerCase().includes(q);
        if (!matchesName && !matchesOrg && !matchesDesc && !matchesSkills && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'External Opportunities') {
          if (evt.isInternal) return false;
        } else {
          // Normalize plural vs singular (Hackathons vs Hackathon, etc.)
          const catClean = selectedCategory.replace(/s$/, '').toLowerCase();
          const evtCatClean = evt.category.toLowerCase();
          if (!evtCatClean.includes(catClean)) return false;
        }
      }

      // Mode filter
      if (selectedMode !== 'All' && evt.mode !== selectedMode) return false;

      // Source filter
      if (selectedSource === 'Internal' && !evt.isInternal) return false;
      if (selectedSource === 'Verified External' && !evt.isVerifiedExternal) return false;

      // Department filter
      if (selectedDept !== 'All') {
        const targetAll = evt.targetDepartment.includes('All Engineering Departments') || evt.targetDepartment.includes('All Departments');
        if (!targetAll && !evt.targetDepartment.includes(selectedDept)) return false;
      }

      // Year filter
      if (selectedYear !== 'All') {
        const matchesYear = evt.targetYear.includes(selectedYear) || evt.targetYear.includes('All');
        if (!matchesYear) return false;
      }

      // Closing Soon
      if (onlyClosingSoon && !evt.isClosingSoon) return false;

      // Recommended
      if (onlyRecommended && !evt.isRecommended) return false;

      return true;
    });
  }, [
    events,
    searchQuery,
    selectedCategory,
    selectedMode,
    selectedSource,
    selectedDept,
    selectedYear,
    onlyClosingSoon,
    onlyRecommended,
  ]);

  const handleShare = (evt: CampusEvent) => {
    navigator.clipboard?.writeText(window.location.href);
    addToast(`Link to "${evt.title}" copied!`, 'info');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedMode('All');
    setSelectedSource('All');
    setSelectedDept('All');
    setSelectedYear('All');
    setOnlyClosingSoon(false);
    setOnlyRecommended(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Discover Opportunities
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore campus workshops, hackathons, competitions, verified external corporate programs, and scholarships.
        </p>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by event title, technology, skills (e.g. PyTorch, AI, Cloud), organizer, or keywords..."
          className="w-full pl-12 pr-10 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary Filters Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dept */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>

          {/* Year */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="All">All Years</option>
              <option value="I">I Year</option>
              <option value="II">II Year</option>
              <option value="III">III Year</option>
              <option value="IV">IV Year</option>
            </select>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Mode:</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="All">All Modes</option>
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Source */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="All">All Sources</option>
              <option value="Internal">Internal Only</option>
              <option value="Verified External">Verified External</option>
            </select>
          </div>

          {/* Quick Toggles */}
          <button
            onClick={() => setOnlyClosingSoon(!onlyClosingSoon)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition ${
              onlyClosingSoon
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Closing Soon
          </button>

          <button
            onClick={() => setOnlyRecommended(!onlyRecommended)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition ${
              onlyRecommended
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Recommended Only
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredEvents.length}</strong> opportunities
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedMode !== 'All' || selectedDept !== 'All' || selectedYear !== 'All' || onlyClosingSoon || onlyRecommended) && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-400 hover:underline ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching opportunities found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search query, department filter, or resetting category filters to see all available campus events.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((evt) => {
            const isInterested = interestedEventIds.includes(evt.id);
            const isRegistered = registeredEventIds.includes(evt.id);

            return (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/20 group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      {evt.category}
                    </span>

                    {evt.isInternal ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> INTERNAL
                      </span>
                    ) : evt.isVerifiedExternal ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED EXTERNAL
                      </span>
                    ) : null}

                    {evt.isClosingSoon && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25 animate-pulse">
                        CLOSING SOON
                      </span>
                    )}

                    {evt.isRecommended && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> RECOMMENDED
                      </span>
                    )}
                  </div>

                  {/* Title & Organizer */}
                  <h3
                    onClick={() => setSelectedEventForModal(evt)}
                    className="text-base font-bold text-white mb-1.5 group-hover:text-blue-300 transition cursor-pointer line-clamp-2"
                  >
                    {evt.title}
                  </h3>
                  <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{evt.organizer}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-300 mb-3.5 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Metadata tags */}
                  <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-medium text-white">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-amber-300/90 truncate">Deadline: {evt.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate text-slate-300">{evt.location} ({evt.mode})</span>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {evt.skills.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {s}
                      </span>
                    ))}
                    {evt.skills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-500">
                        +{evt.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedEventForModal(evt)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => toggleInterest(evt.id)}
                      className={`p-1.5 rounded-xl border transition ${
                        isInterested
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={isInterested ? 'Interested' : 'Mark Interested'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInterested ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleShare(evt)}
                      className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    {isRegistered ? (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => registerForEvent(evt.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
