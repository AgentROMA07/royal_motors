'use client';

import { useState, useEffect, useMemo } from 'react';
import { Car } from '@/lib/cars';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import { getAttributes, Attribute } from '@/actions/attributes';

interface FilterState {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  bodyTypes: string[];
  condition: string;
  fuelTypes: string[];
  transmissions: string[];
  driveTypes: string[];
  engineVolumeRanges: string[];
}

interface InventoryFiltersProps {
  cars: Car[];
  locale: Locale;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function InventoryFilters({ cars, locale, onFilterChange, className }: InventoryFiltersProps) {
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    getAttributes().then(setAttributes);
  }, []);

  const getOptions = (category: string) => 
    attributes.filter(a => a.category === category);
  
  // Extract unique values for selects
  const uniqueMakes = useMemo(() => Array.from(new Set(cars.map(c => c.make))).sort(), [cars]);
  
  const [filters, setFilters] = useState<FilterState>({
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    bodyTypes: [],
    condition: 'all',
    fuelTypes: [],
    transmissions: [],
    driveTypes: [],
    engineVolumeRanges: []
  });

  const [isOpen, setIsOpen] = useState(false);

  // Filter models based on selected make
  const availableModels = useMemo(() => {
    if (!filters.make) return [];
    return Array.from(new Set(cars.filter(c => c.make === filters.make).map(c => c.model))).sort();
  }, [cars, filters.make]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const toggleBodyType = (type: string) => {
    handleCheckboxChange('bodyTypes', type);
  };

  const engineRanges = [
    { id: 'small', label: '< 1.5L', min: 0, max: 1.5 },
    { id: 'medium', label: '1.6L - 2.4L', min: 1.6, max: 2.4 },
    { id: 'powerful', label: '2.5L - 3.5L', min: 2.5, max: 3.5 },
    { id: 'large', label: '> 4.0L', min: 4.0, max: 10.0 },
  ];

  return (
    <div className={cn("bg-[#111114] p-6 rounded-xl border border-white/10 text-white", className)}>
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-white/10">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      <div className={cn("space-y-8", isOpen ? "block" : "hidden md:block")}>
        {/* Basic Filters */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Основные</h3>
          
          {/* Make & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Марка</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.make}
                onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value, model: '' }))}
              >
                <option value="">Все марки</option>
                {uniqueMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Модель</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.model}
                onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                disabled={!filters.make}
              >
                <option value="">Все модели</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>Состояние</Label>
            <div className="flex bg-neutral-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setFilters({...filters, condition: 'all'})}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                  filters.condition === 'all' 
                    ? "bg-white text-black shadow-sm" 
                    : "text-neutral-500 hover:text-black"
                )}
              >
                Все
              </button>
              {getOptions('condition').map(attr => (
                <button
                  key={attr.slug}
                  onClick={() => setFilters({...filters, condition: attr.slug})}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                    filters.condition === attr.slug 
                      ? "bg-white text-black shadow-sm" 
                      : "text-neutral-500 hover:text-black"
                  )}
                >
                  {locale === 'ru' ? attr.nameRu : attr.nameKz}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label>Цена (₸)</Label>
            <div className="flex gap-2 items-center">
              <Input 
                type="number" 
                placeholder="От" 
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                className="bg-white text-gray-900"
              />
              <span>-</span>
              <Input 
                type="number" 
                placeholder="До" 
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                className="bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label>Год выпуска</Label>
            <div className="flex gap-2 items-center">
              <Input 
                type="number" 
                placeholder="От" 
                value={filters.yearMin}
                onChange={(e) => setFilters(prev => ({ ...prev, yearMin: e.target.value }))}
                className="bg-white text-gray-900"
              />
              <span>-</span>
              <Input 
                type="number" 
                placeholder="До" 
                value={filters.yearMax}
                onChange={(e) => setFilters(prev => ({ ...prev, yearMax: e.target.value }))}
                className="bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Body Type */}
          <div className="space-y-2">
            <Label>Тип кузова</Label>
            <div className="flex flex-wrap gap-2">
              {getOptions('bodyType').map((attr) => (
                <button
                  key={attr.slug}
                  onClick={() => toggleBodyType(attr.slug)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                    filters.bodyTypes.includes(attr.slug)
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-black"
                  )}
                >
                  {locale === 'ru' ? attr.nameRu : attr.nameKz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Filters */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">Технические характеристики</h3>
          
          {/* Fuel Type */}
          <div className="space-y-2">
            <Label>Тип топлива</Label>
            <div className="grid grid-cols-2 gap-2">
              {getOptions('fuelType').map((attr) => (
                <label key={attr.slug} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.fuelTypes.includes(attr.slug)}
                    onChange={() => handleCheckboxChange('fuelTypes', attr.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    {locale === 'ru' ? attr.nameRu : attr.nameKz}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <Label>Коробка передач</Label>
            <div className="grid grid-cols-2 gap-2">
              {getOptions('transmission').map((attr) => (
                <label key={attr.slug} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.transmissions.includes(attr.slug)}
                    onChange={() => handleCheckboxChange('transmissions', attr.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    {locale === 'ru' ? attr.nameRu : attr.nameKz}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Drive Type */}
          <div className="space-y-2">
            <Label>Привод</Label>
            <div className="grid grid-cols-2 gap-2">
              {getOptions('driveType').map((attr) => (
                <label key={attr.slug} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.driveTypes.includes(attr.slug)}
                    onChange={() => handleCheckboxChange('driveTypes', attr.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    {locale === 'ru' ? attr.nameRu : attr.nameKz}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Engine Volume */}
          <div className="space-y-2">
            <Label>Объем двигателя</Label>
            <div className="grid grid-cols-1 gap-2">
              {engineRanges.map((range) => (
                <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.engineVolumeRanges.includes(range.id)}
                    onChange={() => handleCheckboxChange('engineVolumeRanges', range.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setFilters({
            make: '',
            model: '',
            yearMin: '',
            yearMax: '',
            priceMin: '',
            priceMax: '',
            bodyTypes: [],
            condition: 'all',
            fuelTypes: [],
            transmissions: [],
            driveTypes: [],
            engineVolumeRanges: []
          })}
        >
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
}
