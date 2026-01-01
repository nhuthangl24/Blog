import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get title from URL
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Nhuthangl24 Security Blog';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)', // Dark Mode Gradient
            color: 'white',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
              backgroundSize: '100px 100px',
            }}
          />

          {/* Blog Name / Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              opacity: 0.8,
              fontSize: 24,
              textTransform: 'uppercase',
              letterSpacing: 4,
              fontWeight: 600,
            }}
          >
            Nhuthangl24 / Security
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1.2,
              padding: '0 60px',
              background: 'linear-gradient(to bottom right, #fff, #94a3b8)',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
