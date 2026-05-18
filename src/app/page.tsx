import Hero            from "@/components/Hero";
import Portfolio       from "@/components/Portfolio";
import Process         from "@/components/Process";
import BookingWorkflow from "@/components/BookingWorkflow";
import FAQ             from "@/components/FAQ";
import Footer          from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Portfolio />
        <Process />
        <BookingWorkflow />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
