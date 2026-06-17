"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.3 });
    }, []);

    useEffect(() => {
        NProgress.done();
        return () => {
            // No startup here to avoid duplicate performance marks
        };
    }, [pathname, searchParams]);

    return null;
}
