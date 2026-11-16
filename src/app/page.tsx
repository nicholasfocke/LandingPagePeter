import About from "@/components/landing/About";
import BusinessSkills from "@/components/landing/BusinessSkills";
import Clients from "@/components/landing/Clients";
import Course from "@/components/landing/Course";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import GetStarted from "@/components/landing/GetStarted";
import Hero from "@/components/landing/Hero";
import Method from "@/components/landing/Method";
import Programs from "@/components/landing/Programs";
import SiteFooter from "@/components/landing/SiteFooter";
import SiteHeader from "@/components/landing/SiteHeader";
import Situations from "@/components/landing/Situations";
import Testimonials from "@/components/landing/Testimonials";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import "./landing.css";

const organizationData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "HPE Brazil — High Performance English",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  founder: { "@type": "Person", name: "Peter Focke" },
  sameAs: ["https://www.instagram.com/peterfocke/"],
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className="landing">
        <Hero />
        <Situations />
        <Method />
        <About />
        <BusinessSkills />
        <Programs />
        <Clients />
        <Testimonials />
        <Course />
        <GetStarted />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}
