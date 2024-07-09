import { auth } from '@/server/auth';
import { UserButton } from './user-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Nav() {
  const session = await auth();
  console.log(session);

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Logo</div>
        <ul className="flex space-x-4">
          {!session ? (
            <li>
              <Button asChild>
                <Link className="flex gap-2 items-center" href="/api/auth/signin">
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
