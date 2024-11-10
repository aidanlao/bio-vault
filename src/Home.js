import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
      <div className="homepage font-sans">
      {/* Hero Section */}
      <section className="relative text-white h-screen flex flex-col justify-center items-center text-center">
        <h1 className="m text-6xl font-extrabold mb-8 gradient-text">Believe it when you see it.</h1>
        <p className="t text-lg md:text-xl mb-6 max-w-lg mx-auto">
          A secure biometric identity management tool.
        </p>
        <div className="flex gap-5">
        <Link to="/login"
          href="#features"
          className="glowing-button t"
        >
            Login
        </Link>
        <Link to="/register"
          href="#features"
          className="glowing-button t"
        >
            Register
        </Link>
        </div>
       
      </section>

    </div>
          </>
    )
}