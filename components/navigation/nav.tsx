import {auth} from '@/server/auth'
import { UserButton } from './user-button';
import { Button } from '@/components/ui/button';


export default async function Nav() {
    const session = await auth();
    console.log(session);

    return(
        <header>
            <nav>
                <ul>
                    <li>logo</li>
                    {!session ? (
                        <li className="flex items-center justify-center">
                        <Button asChild>
                            Sign in
                        </Button>
                        </li>
                    ) : (
                        <li className="flex items-center justify-center">
                        <UserButton expires={session?.expires} user={session?.user} />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}