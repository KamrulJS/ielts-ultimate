import { notFound } from 'next/navigation';
import { PublicShell } from '@/layouts/PublicShell';
import { ServiceDetailView } from '@/modules/public/ServiceDetailView';
import servicesData from '@/data/public/services-pages.json';

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = servicesData[slug];
  if (!page) {
    return { title: 'Service — IELTS Ultimate' };
  }
  return {
    title: `${page.title} — IELTS Ultimate`,
    description: page.subheadline,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  if (!servicesData[slug]) notFound();

  return (
    <PublicShell>
      <ServiceDetailView slug={slug} />
    </PublicShell>
  );
}

