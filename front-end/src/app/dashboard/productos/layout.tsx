export default async function ProductosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1 p-10">{children}</main>
    </>
  );
}
