import { useEffect } from "react";

export default function useTitle({ title }: { title: string }) {
    useEffect(() => {
        document.title = `${title} | ChatBot`;
    }, [title])
}