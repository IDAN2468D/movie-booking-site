import { redirect } from 'next/navigation';

export default async function BookMovieRedirect({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  redirect(`/movie/${movieId}`);
}
