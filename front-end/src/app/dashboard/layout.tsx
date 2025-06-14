export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
