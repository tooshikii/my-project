import AlbumSphere from "@/components/albumSphere";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const { userName } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/list/${userName}`, {
    cache: "no-store",
  });

  const data = await res.json();

  console.log({ data });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{userName}'s Albums</h1>
      <p className="text-gray-600">Check console for API response</p>
      <p className="text-sm text-gray-500 mt-2">Found {data.count} albums</p>
      <AlbumSphere albums={data.albums} />
    </div>
  );
}
