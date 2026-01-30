import { Container } from '@/components/ui/Container';
import { getDictionary } from '@/lib/i18n';
import { getBrandConfig } from '@/lib/brand';

export default function AboutPage() {
  const dictionary = getDictionary('ru');
  const brand = getBrandConfig();
  
  return (
    <div className="bg-[#0B0B0D] min-h-screen">
      {/* Header */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {dictionary.nav.about}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
            <p className="text-xl text-white/80 leading-relaxed">
              {brand.identity.name} — {dictionary.hero.subtitle}
            </p>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container className="pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none mb-16 text-center">
            <p className="text-2xl font-light text-white leading-relaxed">
              Наша цель - предоставить вам качественный сервис.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group">
               <h3 className="font-heading font-bold text-2xl text-white mb-4 group-hover:text-primary transition-colors">
                 {dictionary.benefits.items[0].title}
               </h3>
               <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                 {dictionary.benefits.items[0].desc}
               </p>
             </div>
             
             <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group">
               <h3 className="font-heading font-bold text-2xl text-white mb-4 group-hover:text-primary transition-colors">
                 {dictionary.benefits.items[2].title}
               </h3>
               <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                 {dictionary.benefits.items[2].desc}
               </p>
             </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
