'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Plus, Trash2 } from 'lucide-react';
import { adminDictionary } from '@/lib/admin-dictionary';
import { 
  getAttributes, 
  createAttribute, 
  deleteAttribute, 
  Attribute,
  AttributeCategory 
} from '@/actions/attributes';

type AdminDict = typeof adminDictionary['ru'];

interface AttributesManagerProps {
  lang: 'ru' | 'kz';
  dict: AdminDict;
  onClose: () => void;
}

const CATEGORIES: { value: AttributeCategory; labelRu: string; labelKz: string }[] = [
  { value: 'condition', labelRu: 'Состояние', labelKz: 'Жағдайы' },
  { value: 'bodyType', labelRu: 'Тип кузова', labelKz: 'Кузов түрі' },
  { value: 'fuelType', labelRu: 'Тип топлива', labelKz: 'Жанармай түрі' },
  { value: 'transmission', labelRu: 'Коробка передач', labelKz: 'Беріліс қорабы' },
  { value: 'driveType', labelRu: 'Привод', labelKz: 'Жетек' },
];

export function AttributesManager({ lang, dict, onClose }: AttributesManagerProps) {
  const [activeCategory, setActiveCategory] = useState<AttributeCategory>('bodyType');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New attribute form
  const [newSlug, setNewSlug] = useState('');
  const [newNameRu, setNewNameRu] = useState('');
  const [newNameKz, setNewNameKz] = useState('');

  const loadAttributes = useCallback(async () => {
    setLoading(true);
    const data = await getAttributes(activeCategory);
    setAttributes(data);
    setLoading(false);
  }, [activeCategory]);

  useEffect(() => {
    // eslint-disable-next-line
    loadAttributes();
  }, [loadAttributes]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug || !newNameRu || !newNameKz) return;

    // Validate slug (letters, numbers, hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(newSlug)) {
      alert('Код (slug) должен содержать только латинские буквы, цифры и дефис');
      return;
    }

    const success = await createAttribute({
      category: activeCategory,
      slug: newSlug,
      nameRu: newNameRu,
      nameKz: newNameKz,
    });

    if (success) {
      setNewSlug('');
      setNewNameRu('');
      setNewNameKz('');
      loadAttributes();
    } else {
      alert('Ошибка при создании атрибута');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(dict.deleteConfirm)) return;
    
    const success = await deleteAttribute(id);
    if (success) {
      setAttributes(attributes.filter(a => a.id !== id));
    } else {
      alert(dict.deleteError);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Справочники</h1>
        <Button variant="ghost" onClick={onClose}>{dict.backToList}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border p-2 space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lang === 'ru' ? cat.labelRu : cat.labelKz}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Add New Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Добавить новый элемент</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Код (slug)</Label>
                <Input 
                  value={newSlug} 
                  onChange={e => setNewSlug(e.target.value.toLowerCase())}
                  placeholder="sedan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Название (RU)</Label>
                <Input 
                  value={newNameRu} 
                  onChange={e => setNewNameRu(e.target.value)}
                  placeholder="Седан"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Название (KZ)</Label>
                <Input 
                  value={newNameKz} 
                  onChange={e => setNewNameKz(e.target.value)}
                  placeholder="Седан"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </form>
          </div>

          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-4 py-3">Код</th>
                  <th className="px-4 py-3">RU</th>
                  <th className="px-4 py-3">KZ</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attributes.map((attr) => (
                  <tr key={attr.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-600">{attr.slug}</td>
                    <td className="px-4 py-3">{attr.nameRu}</td>
                    <td className="px-4 py-3">{attr.nameKz}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(attr.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title={dict.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {attributes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Список пуст
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
