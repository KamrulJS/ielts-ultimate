import { notFound } from 'next/navigation';
import { PublicShell } from '@/layouts/PublicShell';
import { ResourceDetailView } from '@/modules/public/ResourceDetailView';
import resourcesData from '@/data/public/resources-pages.json';

export function generateStaticParams() {
  return Object.keys(resourcesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = resourcesData[slug];
  if (!page) {
    return { title: 'Resource — IELTS Ultimate' };
  }
  return {
    title: `${page.title} — IELTS Ultimate`,
    description: page.subheadline,
  };
}

export default async function ResourcePage({ params }) {
  const { slug } = await params;
  if (!resourcesData[slug]) notFound();

  return (
    <PublicShell>
      <ResourceDetailView slug={slug} />
    </PublicShell>
  );
}

