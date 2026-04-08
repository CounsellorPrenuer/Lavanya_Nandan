import {NextResponse} from 'next/server';
import {createClient} from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kwashosy',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const phone = String(body?.phone || '').trim();
    const subject = String(body?.subject || '').trim();
    const message = String(body?.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {ok: false, error: 'Name, email, and message are required.'},
        {status: 400}
      );
    }

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        {ok: false, error: 'Server token missing.'},
        {status: 500}
      );
    }

    await writeClient.create({
      _type: 'contactSubmission',
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json(
      {ok: false, error: 'Failed to submit form. Please try again.'},
      {status: 500}
    );
  }
}
