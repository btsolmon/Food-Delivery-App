/* eslint-disable @next/next/no-img-element */
import { Container } from "./components/Container";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Home() {
  return (
<div className="bg-[#18181b]">
  <Header></Header>
  <Container>
    <div>
      <img src="/homepageimg.png" alt="Homepage" />
    </div>
  </Container>
  <Footer></Footer>
</div>
  );
}
