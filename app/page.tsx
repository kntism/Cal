export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        <div>
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Hello Cal
          </h1>
        </div>
        <div className="leading-7 [&:not(:first-child)]:mt-6">by Lu & Sun</div>
      </main>
    </div>
  );
}
