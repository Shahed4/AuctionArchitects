import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { subject, body, to } = await req.json();

  const apiKey = process.env.NYLAS_API_KEY;
  const grantId = process.env.NYLAS_GRANT_ID;     // Changed from NYLAS_CLIENT_ID
  const baseUrl = process.env.NYLAS_BASE_URL;     // Changed from NYLAS_API_URL

  if (!apiKey || !grantId || !baseUrl) {
    return NextResponse.json(
      { error: 'Missing environment variables.' },
      { status: 500 }
    );
  }
  
  const url = `${baseUrl}/v3/grants/${grantId}/messages/send`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject,
        body: body,
        to: [{ name: "Invoice@NOREPLY", email: to }],
        tracking_options: {
          opens: true,
          links: true,
          thread_replies: true,
          label: 'test label',
        },
      }),
    });

    if (!response.ok) {
      const errorRes = await response.json();
      return NextResponse.json({ error: errorRes }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
