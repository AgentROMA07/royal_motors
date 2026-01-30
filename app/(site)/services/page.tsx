import { Container } from '@/components/ui/Container';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { getDictionary } from '@/lib/i18n';

export default function ServicesPage() {
  const dictionary = getDictionary('kz');
  return (
    <div>
      <div className="relative py-24 bg-[#0B0B0D] overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {dictionary.nav.services}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
        </Container>
      </div>
      <ServicesSection dictionary={dictionary} />
    </div>
  );
}
