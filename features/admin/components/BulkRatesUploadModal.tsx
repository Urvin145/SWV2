/**
 * BulkRatesUploadModal
 * Allows admins to download an Excel/CSV template of current scrap rates,
 * edit prices in Excel/Google Sheets, upload the file, preview diffs live,
 * and apply all changes in one click.
 */

'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Download,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  FileText,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrapItem {
  id: string;
  name: string;
  slug: string;
  unit: string;
  category: { name: string; slug: string };
  rates: Array<{ id: string; price_per_unit: number; is_current: boolean; city?: string }>;
}

interface ParsedDiffItem {
  itemId: string;
  name: string;
  category: string;
  unit: string;
  oldPrice: number;
  newPrice: number;
  diff: number;
  hasChanged: boolean;
  status: 'matched' | 'unmatched' | 'invalid';
}

export function BulkRatesUploadModal({
  items,
  onClose,
  onUpdated,
}: {
  items: ScrapItem[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedDiff, setParsedDiff] = useState<ParsedDiffItem[] | null>(null);
  const [filterView, setFilterView] = useState<'all' | 'changed' | 'unchanged'>('all');
  const [parsing, setParsing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ────────── Download Template ────────── */
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const rows = items.map((item) => {
      const currentRate = item.rates.find((r) => r.is_current) ?? item.rates[0];
      const rateVal = currentRate ? Number(currentRate.price_per_unit) : 0;
      return {
        'Item ID': item.id,
        'Category': item.category.name,
        'Item Name': item.name,
        'Unit': item.unit,
        'Current Rate (₹)': rateVal,
        'New Rate (₹)': rateVal,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto column widths
    worksheet['!cols'] = [
      { wch: 38 }, // Item ID
      { wch: 18 }, // Category
      { wch: 30 }, // Item Name
      { wch: 10 }, // Unit
      { wch: 18 }, // Current Rate (₹)
      { wch: 18 }, // New Rate (₹)
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scrap Rates');

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `scrapwala_rates_${dateStr}.${format}`;

    if (format === 'xlsx') {
      XLSX.writeFile(workbook, fileName);
    } else {
      XLSX.writeFile(workbook, fileName, { bookType: 'csv' });
    }
  };

  /* ────────── Parse Uploaded File ────────── */
  const processUploadedFile = async (uploadedFile: File) => {
    setParsing(true);
    setError(null);
    setSuccessMessage(null);
    setFile(uploadedFile);

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        throw new Error('No sheets found in uploaded spreadsheet.');
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      if (!rows || rows.length === 0) {
        throw new Error('Spreadsheet appears to be empty. Please check your file.');
      }

      // Map rows against available items
      const diffList: ParsedDiffItem[] = [];

      for (const row of rows) {
        // Find ID or name
        const rawId = String(row['Item ID'] || row['id'] || row['scrap_item_id'] || '').trim();
        const rawName = String(row['Item Name'] || row['item_name'] || row['name'] || row['Scrap Item'] || '').trim();

        // Find matched item
        let matched = items.find((i) => i.id.toLowerCase() === rawId.toLowerCase());
        if (!matched && rawName) {
          matched = items.find((i) => i.name.toLowerCase() === rawName.toLowerCase());
        }

        if (!matched) {
          if (rawName || rawId) {
            diffList.push({
              itemId: rawId || 'unknown',
              name: rawName || 'Unknown Item',
              category: String(row['Category'] || 'Other'),
              unit: String(row['Unit'] || 'kg'),
              oldPrice: 0,
              newPrice: 0,
              diff: 0,
              hasChanged: false,
              status: 'unmatched',
            });
          }
          continue;
        }

        const currentRate = matched.rates.find((r) => r.is_current) ?? matched.rates[0];
        const oldPrice = currentRate ? Number(currentRate.price_per_unit) : 0;

        // Resolve new price from possible column names
        const rawNewPrice =
          row['New Rate (₹)'] ??
          row['New Rate'] ??
          row['new_rate'] ??
          row['Rate (₹)'] ??
          row['Rate'] ??
          row['Price'] ??
          row['Current Rate (₹)'] ??
          row['price_per_unit'];

        const newPrice = parseFloat(String(rawNewPrice ?? oldPrice).replace(/[^0-9.-]+/g, ''));

        if (isNaN(newPrice) || newPrice < 0) {
          diffList.push({
            itemId: matched.id,
            name: matched.name,
            category: matched.category.name,
            unit: matched.unit,
            oldPrice,
            newPrice: 0,
            diff: 0,
            hasChanged: false,
            status: 'invalid',
          });
          continue;
        }

        const diff = Number((newPrice - oldPrice).toFixed(2));
        const hasChanged = diff !== 0;

        diffList.push({
          itemId: matched.id,
          name: matched.name,
          category: matched.category.name,
          unit: matched.unit,
          oldPrice,
          newPrice,
          diff,
          hasChanged,
          status: 'matched',
        });
      }

      setParsedDiff(diffList);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse file. Please verify it is a valid .xlsx or .csv.');
      setParsedDiff(null);
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  /* ────────── Apply Rates to Supabase ────────── */
  const handleApplyUpdates = async () => {
    if (!parsedDiff) return;

    const updates = parsedDiff
      .filter((d) => d.status === 'matched' && d.hasChanged)
      .map((d) => ({
        scrap_item_id: d.itemId,
        price_per_unit: d.newPrice,
      }));

    if (updates.length === 0) {
      setError('No rate changes detected to apply.');
      return;
    }

    setApplying(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/rates/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to update rates');

      setSuccessMessage(`Successfully updated rates for ${json.data.updatedCount} scrap items!`);
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setApplying(false);
    }
  };

  // Stats calculation
  const totalItems = parsedDiff?.length ?? 0;
  const changedItems = parsedDiff?.filter((d) => d.status === 'matched' && d.hasChanged) ?? [];
  const unchangedCount = (parsedDiff?.filter((d) => d.status === 'matched' && !d.hasChanged) ?? []).length;
  const invalidOrUnmatched = (parsedDiff?.filter((d) => d.status !== 'matched') ?? []).length;

  const displayList = parsedDiff?.filter((item) => {
    if (filterView === 'changed') return item.hasChanged;
    if (filterView === 'unchanged') return !item.hasChanged;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-3 sm:p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-outline-variant/15 bg-surface-container/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">Bulk Update Scrap Rates</h3>
              <p className="text-xs text-on-surface-variant">
                Download spreadsheet, edit rates in Excel, and upload to update all prices instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0">
          {/* Step 1: Download Sample Sheet */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/30 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Step 1: Download Sheet</p>
                <p className="text-sm font-semibold text-on-surface mt-0.5">
                  Get pre-filled sheet with all {items.length} current scrap items
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Contains item IDs, names, units, and current prices ready to edit.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('xlsx')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Excel (.xlsx)
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('csv')}
                  className="flex items-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition"
                >
                  <FileText className="h-3.5 w-3.5 text-on-surface-variant" />
                  CSV (.csv)
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Upload Dropzone */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Step 2: Upload Updated Spreadsheet
            </p>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 cursor-pointer transition text-center',
                isDragOver
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-outline-variant/30 bg-surface-container/20 hover:border-primary/50 hover:bg-surface-container/40',
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processUploadedFile(e.target.files[0]);
                  }
                }}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />

              <div className="rounded-2xl bg-primary/10 p-3 text-primary group-hover:scale-105 transition">
                {parsing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )}
              </div>

              <p className="mt-3 text-sm font-semibold text-on-surface">
                {file ? file.name : 'Click to browse or drag and drop your spreadsheet'}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)
              </p>
            </div>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-error-container/50 p-3.5 text-xs text-on-error-container">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Step 3: Live Diff Preview */}
          {parsedDiff && parsedDiff.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Step 3: Review Price Changes</p>
                  <p className="text-xs text-on-surface-variant">
                    Found {totalItems} items. Please verify the new rates below before applying.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterView('all')}
                    className={cn(
                      'rounded-lg px-2.5 py-1 font-medium transition',
                      filterView === 'all'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    All ({totalItems})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterView('changed')}
                    className={cn(
                      'rounded-lg px-2.5 py-1 font-semibold transition',
                      filterView === 'changed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100',
                    )}
                  >
                    Changed ({changedItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterView('unchanged')}
                    className={cn(
                      'rounded-lg px-2.5 py-1 font-medium transition',
                      filterView === 'unchanged'
                        ? 'bg-surface-container-high text-on-surface'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    Unchanged ({unchangedCount})
                  </button>
                </div>
              </div>

              {/* Diff Table */}
              <div className="max-h-60 overflow-y-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest divide-y divide-outline-variant/10">
                {displayList?.length === 0 ? (
                  <p className="py-6 text-center text-xs text-on-surface-variant">
                    No items match the selected filter.
                  </p>
                ) : (
                  displayList?.map((item) => (
                    <div
                      key={item.itemId}
                      className={cn(
                        'flex items-center justify-between p-3 text-xs transition',
                        item.hasChanged && 'bg-emerald-50/40 dark:bg-emerald-950/20',
                      )}
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-on-surface truncate">{item.name}</span>
                          <span className="rounded bg-surface-container px-1.5 py-0.5 text-[10px] text-on-surface-variant">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div>
                          <span className="text-on-surface-variant">₹{item.oldPrice}</span>
                          <span className="text-[10px] text-on-surface-variant">/{item.unit}</span>
                        </div>

                        <ArrowRight className="h-3 w-3 text-on-surface-variant" />

                        <div className="min-w-[60px]">
                          <span className="font-bold text-on-surface">₹{item.newPrice}</span>
                          <span className="text-[10px] text-on-surface-variant">/{item.unit}</span>
                        </div>

                        {/* Change Badge */}
                        <div className="w-20 text-right">
                          {item.hasChanged ? (
                            <span
                              className={cn(
                                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold',
                                item.diff > 0
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                              )}
                            >
                              {item.diff > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {item.diff > 0 ? `+₹${item.diff}` : `-₹${Math.abs(item.diff)}`}
                            </span>
                          ) : (
                            <span className="text-[11px] text-on-surface-variant/70">No change</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {invalidOrUnmatched > 0 && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  ⚠️ Note: {invalidOrUnmatched} row(s) in the file did not match any active scrap items and will be skipped.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-outline-variant/15 bg-surface-container/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-on-surface-variant">
            {parsedDiff ? (
              <span>
                <strong className="text-emerald-600 font-bold">{changedItems.length} rate updates</strong> ready to apply.
              </span>
            ) : (
              <span>Upload an Excel or CSV file to preview changes.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-outline-variant/30 px-4 py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyUpdates}
              disabled={applying || !parsedDiff || changedItems.length === 0}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-40 shadow-sm shadow-emerald-600/20"
            >
              {applying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Apply All Rates ({changedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
