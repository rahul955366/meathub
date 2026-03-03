import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');
    const API_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:8000';

    try {
        const res = await fetch(`${API_URL}/api/contextual-ai/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ response: "Internal Assistant Error" }, { status: 500 });
    }
}
