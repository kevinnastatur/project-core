'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { PaginationMeta } from '@/types';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onSearch?: (search: string) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  columns, data, meta, onPageChange, onSearch, searchPlaceholder = 'Search...',
  isLoading, actions,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      {onSearch && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <Input
            data-testid="data-table-search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 border-[#E5E7EB] focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F9F9FB] hover:bg-[#F9F9FB]">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-xs uppercase tracking-[0.15em] font-semibold text-[#6B7280] py-3"
                >
                  {col.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-xs uppercase tracking-[0.15em] font-semibold text-[#6B7280] py-3 text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12 text-[#6B7280]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12 text-[#6B7280]">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-[#F9F9FB] transition-colors" data-testid={`data-table-row-${idx}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm text-[#111827]">
                      {col.render ? col.render(item) : String(item[col.key] ?? '-')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">{actions(item)}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between" data-testid="data-table-pagination">
          <p className="text-sm text-[#6B7280]">
            Showing {meta.from} to {meta.to} of {meta.total} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page <= 1}
              onClick={() => onPageChange?.(meta.current_page - 1)}
              data-testid="pagination-prev"
              className="border-[#E5E7EB]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - meta.current_page) <= 2 || p === 1 || p === meta.last_page)
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-[#6B7280]">...</span>
                  )}
                  <Button
                    variant={p === meta.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange?.(p)}
                    data-testid={`pagination-page-${p}`}
                    className={p === meta.current_page ? 'bg-[#002FA7] hover:bg-[#002585]' : 'border-[#E5E7EB]'}
                  >
                    {p}
                  </Button>
                </span>
              ))}
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => onPageChange?.(meta.current_page + 1)}
              data-testid="pagination-next"
              className="border-[#E5E7EB]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
