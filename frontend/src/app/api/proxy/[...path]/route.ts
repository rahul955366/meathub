import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:8000';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathStr = path.join('/');
    const authHeader = request.headers.get('authorization');

    try {
        const body = await request.json().catch(() => ({}));

        // Handle specific custom paths
        let targetUrl = `${API_URL}/api/${pathStr}/`;

        // Special mapping for our reset-stock action
        if (pathStr === 'butcher-reset-stock') {
            // In a real app, we'd need to know WHICH butcher. 
            // But for this proxy, let's assume the backend 'me' logic or token is used.
            // Actually, the reset_stock action is detail=True, so it needs an ID.
            // Let's make it a general action or use a specific mapping.
            // For now, let's map it to a placeholder or wait.
        }

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
    }
}
