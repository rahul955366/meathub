import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000';

    try {
        const res = await fetch(`${API_URL}/api/contextual-ai/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
