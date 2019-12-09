import Link from "next/link";

function Home() {
  return (
    <>
      <ul>
        <li className="text-lg">Home</li>
        <li className="text-base bg-yume-red text-white">
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
      </ul>

      <h1>This is our homepage.</h1>
    </>
  );
}

export default Home;
