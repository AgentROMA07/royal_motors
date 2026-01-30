'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
  links: { href: string; label: string }[];
  contact: {
    phone: string;
    whatsapp: string;
  };
  locale: string;
}

export function MobileNav({ links, contact, locale }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    // eslint-disable-next-line
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuContent = (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-[9999] w-full max-w-[300px] bg-[#111114] border-l border-white/10 p-6 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <span className="font-heading font-extrabold text-2xl text-white tracking-wide">
            MENU
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col gap-6 flex-1">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-lg font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
           <Button asChild className="w-full bg-transparent border border-white/20 text-white font-medium hover:bg-white/10 rounded-full h-11 transition-all" size="default">
            <Link href={`https://wa.me/${contact.whatsapp}`} target="_blank">
               <Phone className="mr-2 h-4 w-4" />
               WhatsApp
            </Link>
          </Button>
          
          <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90 rounded-full h-11 transition-all" size="default">
             <Link href={`tel:${contact.phone}`} className="w-full h-full flex items-center justify-center">
               {locale === 'ru' ? 'Позвонить' : 'Қоңырау шалу'}
             </Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="lg:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {mounted && createPortal(menuContent, document.body)}
    </div>
  );
}
