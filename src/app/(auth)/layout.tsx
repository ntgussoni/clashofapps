// we center vertically and horizontally

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh w-full items-center  ">{children}</div>;
}
