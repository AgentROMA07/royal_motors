import { Container } from '@/components/ui/Container';
import { ContactSection } from '@/components/sections/ContactSection';
import { getDictionary } from '@/lib/i18n';

export default function ContactPage() {
  const dictionary = getDictionary('kz');
  return (
    <div>
      <div className="relative py-24 bg-[#0B0B0D] overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {dictionary.contact.title}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
        </Container>
      </div>
      <ContactSection dictionary={dictionary} withTitle={false} />
    </div>
  );
}
