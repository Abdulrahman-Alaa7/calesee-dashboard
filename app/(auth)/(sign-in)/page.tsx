import Heading from "../../utils/Heading";
import Login from "../../../components/Login";
import Footer from "../../../components/Footer";
import GuestProtected from "../../../hooks/GuestProtected";

export default function Home() {
  return (
    <GuestProtected>
      <Heading title="Calesee Login" description="" keywords="" />
      <Login />
      <Footer />
    </GuestProtected>
  );
}
