"use client"
import { getProtectedMessage } from "@/app/actions/message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function MessagePage() {
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState('');
    const getMessage = async () => {
        setLoading(true);
        const res = await getProtectedMessage();
        setMessage(JSON.stringify(res.data))
        setLoading(false);
    }
    return (
        <div className={'h-screen w-screen flex items-center justify-center'}>
            <Card className={'w-full max-w-lg'}>
                <CardHeader>
                    <CardTitle>
                        <div className={'flex w-full justify-between items-center'}>
                            <span>Message</span>
                            <Button disabled={loading} onClick={getMessage}>
                                {
                                    loading ? <Loader className={'animate-spin h-5 w-5'} /> : <span>Get</span>
                                }
                            </Button>
                        </div>
                    </CardTitle>
                    <CardContent>
                        <p className={''}>
                            {message}
                        </p>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
}