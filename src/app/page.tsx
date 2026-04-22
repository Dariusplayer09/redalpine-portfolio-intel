"use client";

import { useState, useMemo } from "react";
import { portfolio, sectors, Company } from "@/lib/portfolio";

export default function Home() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Company | null>(null);
  const [memos, setMemos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    return portfolio.filter((c) => {
      const q = search.toLowerCase();
      return (
        (!q || c.name.includes(q) || c.desc.includes(q)) &&
        (!sectorFilter || c.sector === sectorFilter) &&
        (!statusFilter || c.status === statusFilter)
      );
    });
  }, [search, sectorFilter, statusFilter]);

  async function generateMemo(company: Company) {
    if (memos[company.name]) return;
    setLoading(true);
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: company.name,
          desc: company.desc,
          sector: company.sector,
        }),
      });
      const data = await res.json();
      setMemos((prev) => ({ ...prev, [company.name]: data.memo }));
    } catch {
      setMemos((prev) => ({ ...prev, [company.name]: "Error generating memo." }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f9f8] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase mb-1">redalpine</p>
          <h1 className="text-2xl font-medium text-neutral-900">Portfolio Intelligence</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Select a company to generate an AI-powered investment thesis memo.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] text-sm px-3 h-9 rounded-lg border border-neutral-200 bg-white text-neutral-900 outline-none focus:border-neutral-400 placeholder:text-neutral-400"
          />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-sm px-3 h-9 rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="">All sectors</option>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 h-9 rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="exited">Exited</option>
          </select>
        </div>

        <p className="text-xs text-neutral-400 mb-5">{filtered.length} companies</p>

        <div className="grid grid-cols-[1fr_360px] gap-6 items-start">

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.length === 0 && (
              <div className="col-span-3 text-sm text-neutral-400 py-12 text-center">No companies match your filters.</div>
            )}
            {filtered.map((c) => (
              <div
                key={c.name}
                onClick={() => setSelected(c)}
                className={`bg-white rounded-xl border cursor-pointer p-4 transition-all ${
                  selected?.name === c.name
                    ? "border-blue-500 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <p className="text-sm font-medium text-neutral-900 capitalize mb-1">{c.name}</p>
                <p className="text-xs text-neutral-500 leading-relaxed mb-3">{c.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{c.sector}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    c.status === "active" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Memo Panel */}
          <div className="sticky top-6">
            {!selected ? (
              <div className="bg-white border border-neutral-200 rounded-xl p-6 text-sm text-neutral-400 text-center">
                Select a company to generate a thesis memo.
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase mb-1">{selected.sector}</p>
                <h2 className="text-lg font-medium text-neutral-900 capitalize mb-1">{selected.name}</h2>
                <p className="text-xs text-neutral-500 mb-5">{selected.desc}</p>

                {memos[selected.name] ? (
                  <div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Thesis memo</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{memos[selected.name]}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => generateMemo(selected)}
                    disabled={loading}
                    className="w-full text-sm h-9 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Generating..." : "Generate thesis memo →"}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
