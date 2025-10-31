import Image from "next/image";
import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="page">
      <main className="card">
        <header className="navbar">
          <span className="brand">PETER</span>
          <nav className="nav-links">
            <Link href="#">Home</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </nav>
          <button className="menu-button" aria-label="Open menu">
            <span />
          </button>
        </header>

        <section className="hero" id="about">
          <div>
            <p className="hero-subtitle">Business English</p>
            <h1 className="hero-title">
              Teacher &amp; <strong>Tutor</strong>
            </h1>
            <p className="hero-location">Maceió, Alagoas</p>
            <button className="hero-button" type="button">
              Get in touch
            </button>
          </div>
          <div className="hero-image">
            <div className="hero-portrait">
              <Image
                src="/images/peter.png"
                alt="Peter Focke"
                width={432}
                height={560}
                priority
              />
            </div>
          </div>
        </section>

        <section className="intro">
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Ullae oestorp
            enim. Donec ut aliquet veniam, quis nusdtrd exercitation ullamco
            neque auiat metus at.
          </p>
        </section>

        <section className="services">
          <div className="service-card">
            <div className="service-icon">
              <Image
                src="/components/briefcase-fill.svg"
                alt="Business English"
                width={32}
                height={32}
              />
            </div>
            <h3>Business English</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ullae
              oestorp enim.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <Image
                src="/components/chat-dots-fill.svg"
                alt="Communication Skills"
                width={32}
                height={32}
              />
            </div>
            <h3>Communication Skills</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ullae
              oestorp enim.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <Image
                src="/components/display.svg"
                alt="Online Lessons"
                width={32}
                height={32}
              />
            </div>
            <h3>Online Lessons</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ullae
              oestorp enim.
            </p>
          </div>
        </section>

        <section className="contact-card" id="contact">
          <div className="contact-text">
            <h4>Lorem ipsum dolor sit amet consectetur adipiscing elit.</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ullae
              oestorp enim. Donec ut aliquet veniam, quis nusdtrd exercitation
              ullamco neque auiat metus at.
            </p>
          </div>
          <button className="contact-button" type="button">
            Send message
          </button>
        </section>
      </main>
    </div>
  );
}
