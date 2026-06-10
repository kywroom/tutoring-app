export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div style={{ padding: 40 }}>
      <h1>과외방</h1>

      <h2 style={{ color: "blue", fontSize: 30 }}>
        방 ID: {id}
      </h2>
    </div>
  )
}