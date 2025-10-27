import WebsiteTimer from '../components/WebsiteTimer'

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        <WebsiteTimer />
        <div className="leading-7 [&:not(:first-child)]:mt-6">by Lu & Sun</div>
      </main>
    </div>
  );
}
