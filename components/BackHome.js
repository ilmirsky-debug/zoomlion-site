import Link from "next/link";

export default function BackHome() {
  return (
    <Link
      href="/"
      className="w-full px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-black transition block text-center"
    >
      ← На главную
    </Link>
  );
}
