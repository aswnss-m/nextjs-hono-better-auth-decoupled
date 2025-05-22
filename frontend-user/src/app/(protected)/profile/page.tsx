import { authClient } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignOut from "@/components/sign-out";

export default async function ProfilePage() {
    const { data: session, error } = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })
    if (error) {
        redirect('/login')
    }
    return (
        <div className={'h-screen w-screen flex items-center justify-center'}>'
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
        </div>
    );
}