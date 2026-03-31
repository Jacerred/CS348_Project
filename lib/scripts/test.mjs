'use client'
import { addSeller, getAllSellers } from '@/lib/actions';

const sellers = await getAllSellers();
console.log(sellers);