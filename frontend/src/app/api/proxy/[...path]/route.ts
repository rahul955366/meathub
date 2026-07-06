import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function proxyRequest(request: NextRequest, params: Promise<{ path: string[] }>, method: string) {
    const { path } = await params;
    const pathStr = path.join('/');
    const authHeader = request.headers.get('authorization');
    const searchParams = new URL(request.url).searchParams.toString();
    const targetUrl = `${API_URL}/api/${pathStr}/${searchParams ? '?' + searchParams : ''}`;

    try {
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
            cache: 'no-store',
        };

        if (method !== 'GET' && method !== 'HEAD') {
            const body = await request.json().catch(() => ({}));
            fetchOptions.body = JSON.stringify(body);
        }

        const res = await fetch(targetUrl, fetchOptions);
        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, params, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, params, 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, params, 'PUT');
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, params, 'PATCH');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, params, 'DELETE');
}
