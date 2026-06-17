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
            targetUrl = `${API_URL}/api/butchers/reset_stock/`;
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
