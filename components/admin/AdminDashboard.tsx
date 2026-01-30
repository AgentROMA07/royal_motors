'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/lib/cars';
import { CarForm } from './CarForm';
import { AttributesManager } from './AttributesManager';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, LogOut, Edit, List } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { getCars, createCar, updateCar, deleteCar } from '@/app/actions';
import { seedAttributes } from '@/actions/attributes';
import { adminDictionary } from '@/lib/admin-dictionary';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'attributes'>('list');
  const [inventory, setInventory] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'ru' | 'kz'>('ru');

  const dict = adminDictionary[lang];

  useEffect(() => {
    const loadData = async () => {
      try {
        await seedAttributes(); // Ensure attributes are seeded
        const data = await getCars();
        setInventory(data);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveCar = async (car: Car) => {
    let success = false;
    if (editingCar) {
      success = await updateCar(car);
      if (success) {
        setInventory(inventory.map(c => c.id === car.id ? car : c));
      }
    } else {
      success = await createCar(car);
      if (success) {
        setInventory([car, ...inventory]);
      }
    }
    
    if (success) {
      setView('list');
      setEditingCar(null);
    } else {
      alert(dict.saveError);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm(dict.deleteConfirm)) {
      const success = await deleteCar(id);
      if (success) {
        setInventory(inventory.filter(c => c.id !== id));
      } else {
        alert(dict.deleteError);
      }
    }
  };

  if (view === 'attributes') {
    return (
      <AttributesManager 
        lang={lang} 
        dict={dict} 
        onClose={() => setView('list')} 
      />
    );
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{view === 'edit' ? dict.editCar : dict.addCarTitle}</h1>
          <Button variant="ghost" onClick={() => { setView('list'); setEditingCar(null); }}>{dict.backToList}</Button>
        </div>
        <CarForm 
          initialData={editingCar || undefined} 
          onSave={handleSaveCar} 
          onCancel={() => { setView('list'); setEditingCar(null); }} 
          lang={lang}
          dict={dict}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-none overflow-x-hidden">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="w-full px-4 py-2 min-h-[4rem] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{dict.dashboard}</h1>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setLang('ru')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === 'ru' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLang('kz')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === 'kz' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                KZ
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              onClick={() => setView('attributes')} 
              variant="outline" 
              className="gap-2 text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
            >
              <List className="h-4 w-4" /> Справочники
            </Button>
            <Button onClick={() => setView('add')} className="gap-2">
              <Plus className="h-4 w-4" /> {dict.addCar}
            </Button>
            <Button variant="outline" onClick={onLogout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> {dict.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col min-w-0">
        <div className="bg-white shadow-sm border-y sm:border-0 flex-1 flex flex-col">
          <div className="p-6 border-b shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">{dict.inventory} ({inventory.length})</h2>
          </div>
          
          <div className="divide-y overflow-auto flex-1">
            {inventory.length === 0 && !loading ? (
               <div className="p-8 text-center text-gray-500">
                 {dict.noCars}
               </div>
            ) : null}
            
            {loading ? (
               <div className="p-8 text-center text-gray-500">
                 {dict.loading}
               </div>
            ) : null}

            {inventory.map((car) => (
              <div key={car.id} className="p-4 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-16 w-24 sm:h-20 sm:w-32 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image 
                      src={car.images[0]} 
                      alt={car.model}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Mobile-only title/details for better space usage */}
                  <div className="sm:hidden ml-4 flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate text-gray-900">{car.make} {car.model}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                       {formatPrice(car.price)}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block min-w-0">
                  <h3 className="font-bold text-lg truncate text-gray-900">{car.make} {car.model}</h3>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-1 items-center">
                    <span>{car.year}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{formatPrice(car.price)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{car.mileage.toLocaleString()} км</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end items-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleEdit(car)}
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{dict.edit}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(car.id)}
                    title={dict.delete}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
