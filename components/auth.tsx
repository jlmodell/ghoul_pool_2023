import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Auth() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <Link href="/signin">Sign in</Link>
      <Link href="/register">Register</Link>
    </div>
  );
}
