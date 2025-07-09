"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  showAdvancedFilters?: boolean;
  onToggleAdvancedFilters?: () => void;
}

export function DataSearchFilter({
  searchValue,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  showAdvancedFilters = false,
  onToggleAdvancedFilters,
}: DataSearchFilterProps) {
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAdvancedFilters}
          className={
            showAdvancedFilters ? "bg-muted cursor-pointer" : "cursor-pointer"
          }
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {filter.label}
                    </label>
                    <Select
                      value={activeFilters[filter.key] || "all"}
                      onValueChange={(value) =>
                        onFilterChange(filter.key, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Seleccionar ${filter.label.toLowerCase()}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 flex-wrap"
        >
          <span className="text-sm text-muted-foreground">
            Filtros activos:
          </span>
          {Object.entries(activeFilters).map(
            ([key, value]) =>
              value && (
                <Badge key={key} variant="secondary" className="text-xs">
                  {filters.find((f) => f.key === key)?.label}: {value}
                  <button
                    onClick={() => onFilterChange(key, "")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
