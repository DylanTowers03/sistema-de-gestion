import { DashboardHeader } from "@/app/components/dashboard-header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import UserProvider from "@/app/components/UserContext";
import SessionGuard from "../components/SessionGuard";
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <UserProvider session={session}>
      <SessionGuard />
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex">{children}</div>
      </div>
    </UserProvider>
  );
}
