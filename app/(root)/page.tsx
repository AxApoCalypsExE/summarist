import Features from "../components/Features";
import Footer from "../components/Footer";
import Landing from "../components/Landing";
import LoginModal from "../components/LoginModal";
import Navbar from "../components/Navbar";
import Numbers from "../components/Numbers";
import Reviews from "../components/Reviews";

export default function Home() {
  return (
    <body>
      <LoginModal />
      <Navbar />
      <div className="flex items-center justify-center flex-col">
        <Landing />
        <Features />
        <Reviews />
        <Numbers />
      </div>
      <Footer />
    </body>
  );
}
