import { Link } from "react-router-dom";

export default function Secret() {
    return (
        <>
      <div className="homepage font-sans flex justify-center ">
      {/* Hero Section */}
      <section className="max-w-screen-md relative text-white h-screen flex flex-col justify-center items-center text-center">
        <h1 className="m text-6xl font-extrabold mb-8 gradient-text">Here's your secret information that only YOU can see. </h1>
        <p className="t text-lg md:text-xl mb-6 max-w-lg mx-auto">
          Your biometric features were analyzed and authenticated by the system. Congratulations!
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
        <Link to="/"
          href="#features"
          className="glowing-button t"
        >
            Home
        </Link>
        </div>
       
      </section>

    </div>
          </>
    )
}