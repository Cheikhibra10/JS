import { useEffect, useState } from "react";
import ClientComponent from "./component/ClientComponent";
import ClientSkeleton from "../../skeleton/ClientListSkeleton";


export default function ClientPage(){
    const [isArticleApproLoading, setIsArticleApproLoading] = useState<boolean>(true);
    useEffect(() => {
        setTimeout(() => setIsArticleApproLoading(false), 2000);
    }, []);

    return(
    <main className="mt-8 mx-4 md:mx-8 rounded-xl bg-white screen p-4 shadow-sm">
            {isArticleApproLoading ? <ClientSkeleton /> : <ClientComponent />}
    </main>
    )
}