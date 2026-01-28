'use client';

import { useRouter } from 'next/navigation';

export default function EditPage() {
  const router = useRouter();

  // This page uses the same component as /new but with the ?id query param
  // Redirect to the new page with type and id params
  router.push('/admin/content/new');

  return null;
}
