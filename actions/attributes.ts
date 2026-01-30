'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { adminDictionary } from '@/lib/admin-dictionary';
import { 
  CAR_CONDITIONS, 
  CAR_BODY_TYPES, 
  CAR_FUEL_TYPES, 
  CAR_TRANSMISSIONS, 
  CAR_DRIVE_TYPES 
} from '@/lib/constants';

export type AttributeCategory = 
  | 'condition'
  | 'bodyType'
  | 'fuelType'
  | 'transmission'
  | 'driveType';

export interface Attribute {
  id: string;
  category: string;
  slug: string;
  nameRu: string;
  nameKz: string;
  sortOrder: number;
}

export async function getAttributes(category?: AttributeCategory): Promise<Attribute[]> {
  try {
    const where = category ? { category } : {};
    return await prisma.attribute.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch attributes:', error);
    return [];
  }
}

export async function createAttribute(data: {
  category: string;
  slug: string;
  nameRu: string;
  nameKz: string;
}): Promise<boolean> {
  try {
    // Get max sort order to append to end
    const last = await prisma.attribute.findFirst({
      where: { category: data.category },
      orderBy: { sortOrder: 'desc' },
    });
    
    await prisma.attribute.create({
      data: {
        ...data,
        sortOrder: (last?.sortOrder || 0) + 1,
      },
    });
    
    revalidatePath('/admin');
    revalidatePath('/inventory');
    return true;
  } catch (error) {
    console.error('Failed to create attribute:', error);
    return false;
  }
}

export async function deleteAttribute(id: string): Promise<boolean> {
  try {
    await prisma.attribute.delete({
      where: { id },
    });
    
    revalidatePath('/admin');
    revalidatePath('/inventory');
    return true;
  } catch (error) {
    console.error('Failed to delete attribute:', error);
    return false;
  }
}

export async function seedAttributes() {
  try {
    const count = await prisma.attribute.count();
    if (count > 0) return; // Already seeded

    console.log('Seeding attributes...');
    
    const dict = adminDictionary.ru.form;
    const dictKz = adminDictionary.kz.form;
    
    // Helper to seed a category
    const seedCategory = async (category: AttributeCategory, items: readonly string[], dictMapRu: Record<string, string>, dictMapKz: Record<string, string>) => {
      for (let i = 0; i < items.length; i++) {
        const slug = items[i];
        await prisma.attribute.create({
          data: {
            category,
            slug,
            nameRu: dictMapRu[slug] || slug,
            nameKz: dictMapKz[slug] || slug,
            sortOrder: i,
          },
        });
      }
    };

    await seedCategory('condition', CAR_CONDITIONS, dict.conditions, dictKz.conditions);
    await seedCategory('bodyType', CAR_BODY_TYPES, dict.bodyTypes, dictKz.bodyTypes);
    await seedCategory('fuelType', CAR_FUEL_TYPES, dict.fuelTypes, dictKz.fuelTypes);
    await seedCategory('transmission', CAR_TRANSMISSIONS, dict.transmissions, dictKz.transmissions);
    await seedCategory('driveType', CAR_DRIVE_TYPES, dict.driveTypes, dictKz.driveTypes);
    
    console.log('Attributes seeded successfully');
  } catch (error) {
    console.error('Failed to seed attributes:', error);
  }
}
