
"use client"
import SignOut from "@/components/sign-out";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ClientProfilePage() {
    const router = useRouter()
    const { data: session, error, isPending } = authClient.useSession();
    if (!isPending && error) {
        router.push('/login')
    }
    return (
        <div className={'h-screen w-screen flex items-center justify-center'}>'
            {
                isPending ?
                    <div className={'flex flex-col gap-2 items-center'}>
                        <LoaderIcon className={'animate-spin'} />
                        <p>Loading your session</p>
                    </div> :
                    <Card>
                        <CardHeader>
                            <CardTitle className={'flex items-center justify-between'}>
                                <p>This is your session</p>
                                <SignOut />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre>
                                {JSON.stringify(session, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
            }
        </div>
    );
}