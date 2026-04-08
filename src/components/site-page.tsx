"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Compass,
  FileCheck2,
  GraduationCap,
  Menu,
  NotebookText,
  Send,
  Star,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Image as SanityImage, PortableTextBlock } from "sanity";
import { urlFor } from "@/sanity/lib/image";

type Feature = { text: string; included: boolean };
type PlanCard = { title: string; price: string; features: Feature[] };
type AudiencePlan = {
  key: string;
  label: string;
  standard: PlanCard;
  premium: PlanCard;
};
type CustomPackage = {
  title: string;
  price: string;
  description: string;
  icon?: string;
};

export type HomePageData = {
  brandName: string;
  tagline: string;
  about: PortableTextBlock[];
  primaryColor?: string;
  secondaryColor?: string;
  phone?: string;
  email?: string;
  officeLocation?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  founder?: {
    fullName?: string;
    designation?: string;
    bio?: PortableTextBlock[];
    photo?: SanityImage;
    logo?: SanityImage;
  };
  services?: {
    name: string;
    description: string;
    audience: string;
    mode: string;
  }[];
  testimonials?: {
    quote: string;
    name: string;
    designation: string;
  }[];
  successStory?: { story: string; author: string };
  gallery?: { image: SanityImage; caption?: string }[];
  audiencePlans?: AudiencePlan[];
  customPackages?: CustomPackage[];
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Founder", href: "#about-founder" },
  { label: "Services", href: "#services" },
  { label: "Plans", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const iconMap = {
  cv: FileCheck2,
  linkedin: CircleUserRound,
  roadmap: Compass,
  counselling: NotebookText,
  study: GraduationCap,
  support: Star,
} as const;

function getIcon(iconName?: string) {
  const key = (iconName || "").toLowerCase() as keyof typeof iconMap;
  return iconMap[key] || Compass;
}

function formatPrice(price: string) {
  const cleaned = price.trim().replace(/^(?:\?|Rs\.?\s*|INR\s*)/i, "");
  return `\u20B9${cleaned}`;
}

function Plan({
  title,
  price,
  features,
  variant,
}: PlanCard & { title: string; variant: "standard" | "premium" }) {
  return (
    <article className={`plan-card-v3 ${variant}`}>
      <div className="plan-head-v3">
        <p className="plan-tier">{title}</p>
        <h4 className="plan-price-v2">{formatPrice(price)}</h4>
      </div>
      <ul className="feature-list-v2">
        {features?.map((feature, idx) => (
          <li key={`${feature.text}-${idx}`} className="feature-row-v2">
            {feature.included ? (
              <CheckCircle2 size={18} className="icon-positive" />
            ) : (
              <XCircle size={18} className="icon-negative" />
            )}
            <span className={!feature.included ? "excluded-feature" : ""}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <a href="#contact" className="cta-solid small">
        Get Started
      </a>
    </article>
  );
}

export function SitePage({ data }: { data: HomePageData }) {
  const accent = data.primaryColor || "#6F52B5";
  const softAccent = data.secondaryColor || "#E8DDF8";
  const plans = useMemo(() => data.audiencePlans || [], [data.audiencePlans]);
  const [activePlan, setActivePlan] = useState(plans[0]?.key || "default");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const selected = useMemo(
    () => plans.find((p) => p.key === activePlan) || plans[0],
    [plans, activePlan],
  );
  const gallerySlides = useMemo(() => {
    const items = data.gallery || [];
    const chunks: typeof items[] = [];
    for (let i = 0; i < items.length; i += 2) {
      chunks.push(items.slice(i, i + 2));
    }
    return chunks;
  }, [data.gallery]);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormLoading(true);
    setFormMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    });

    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      setFormMessage(payload.error || "Could not send message. Try again.");
      setFormLoading(false);
      return;
    }

    setFormMessage("Thank you. Your message has been submitted successfully.");
    setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
    setFormLoading(false);
  }

  function goPrevGallery() {
    if (!gallerySlides.length) return;
    setGalleryIndex((prev) =>
      prev === 0 ? gallerySlides.length - 1 : prev - 1,
    );
  }

  function goNextGallery() {
    if (!gallerySlides.length) return;
    setGalleryIndex((prev) =>
      prev === gallerySlides.length - 1 ? 0 : prev + 1,
    );
  }

  const cssVars = {
    "--accent": accent,
    "--soft-accent": softAccent,
  } as CSSProperties;

  return (
    <div className="site-shell-v2" style={cssVars}>
      <header className="top-nav" id="top">
        <div className="nav-brand">
          {data.founder?.logo ? (
            <Image
              src={urlFor(data.founder.logo).width(120).height(64).url()}
              width={120}
              height={64}
              alt={data.brandName}
              className="nav-logo"
            />
          ) : null}
          <div>
            <p className="brand-title">{data.brandName}</p>
            <p className="brand-subtitle">{data.tagline}</p>
          </div>
        </div>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMobileNavOpen((v) => !v)}
          type="button"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`nav-links ${mobileNavOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero-v2">
        <div className="hero-content">
          <p className="eyebrow">Career Counselling Platform</p>
          <h1>{data.brandName}</h1>
          <p className="hero-tagline">{data.tagline}</p>
          <div className="portable-text hero-copy">
            <PortableText value={data.about || []} />
          </div>
          <div className="hero-cta-row">
            <a href="#contact" className="cta-solid">
              Book Counselling <ArrowRight size={16} />
            </a>
            <a href="#packages" className="cta-ghost">
              Explore Plans
            </a>
          </div>
        </div>

        {data.founder?.photo ? (
          <div className="hero-image-wrap">
            <Image
              src={urlFor(data.founder.photo).width(720).height(840).url()}
              width={720}
              height={840}
              alt={data.founder.fullName || "Founder portrait"}
              className="founder-portrait-v2"
            />
          </div>
        ) : null}
      </section>

      <section className="section-v2 founder-section-v2" id="about-founder">
        <p className="eyebrow">Founder</p>
        <h2>{data.founder?.fullName}</h2>
        <p className="founder-role-v2">{data.founder?.designation}</p>
        <div className="portable-text">
          <PortableText value={data.founder?.bio || []} />
        </div>
      </section>

      <section className="section-v2" id="services">
        <div className="section-head">
          <p className="eyebrow">What We Offer</p>
          <h2>Services</h2>
        </div>
        <div className="service-grid-v2">
          {data.services?.map((service, index) => (
            <article key={service.name} className="service-card-v2">
              <span className="service-index">0{index + 1}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="chip-row-v2">
                <span>{service.audience}</span>
                <span>{service.mode}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-v2 plan-section-v2" id="packages">
        <div className="section-head">
          <p className="eyebrow">Mentorship</p>
          <h2>Plans & Packages</h2>
        </div>

        <div className="tab-row-v2">
          {plans.map((plan) => (
            <button
              type="button"
              key={plan.key}
              onClick={() => setActivePlan(plan.key)}
              className={plan.key === selected?.key ? "active-tab-v2" : "tab-v2"}
            >
              {plan.label}
            </button>
          ))}
        </div>

        {selected ? (
          <div className="plan-grid-v2">
            <Plan
              title={`Standard - ${selected.standard.title}`}
              price={selected.standard.price}
              features={selected.standard.features || []}
              variant="standard"
            />
            <Plan
              title={`Premium - ${selected.premium.title}`}
              price={selected.premium.price}
              features={selected.premium.features || []}
              variant="premium"
            />
          </div>
        ) : null}

        <h3 className="addon-title-v2">Customizable Add-on Packages</h3>
        <div className="addon-grid-v2">
          {data.customPackages?.map((pack) => {
            const Icon = getIcon(pack.icon);
            return (
              <article key={pack.title} className="addon-card-v2">
                <div className="addon-icon-wrap-v2">
                  <Icon size={24} />
                </div>
                <h4>{pack.title}</h4>
                <p className="addon-price-v2">{formatPrice(pack.price)}</p>
                <p>{pack.description}</p>
                <a href="#contact" className="cta-ghost small">
                  Enquire
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-v2" id="testimonials">
        <div className="section-head">
          <p className="eyebrow">Social Proof</p>
          <h2>Testimonials</h2>
        </div>
        <div className="testimonial-grid-v2">
          {data.testimonials?.map((item, idx) => (
            <article key={`${item.name}-${idx}`} className="testimonial-card-v2">
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <p className="quote-author-v2">
                {item.name}
                <span>{item.designation}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {data.successStory ? (
        <section className="section-v2 story-v2">
          <div>
            <p className="eyebrow">Success Story</p>
            <h2>Real Transformation</h2>
          </div>
          <p>{data.successStory.story}</p>
          <p className="quote-author-v2">{data.successStory.author}</p>
        </section>
      ) : null}

      <section className="section-v2" id="gallery">
        <div className="section-head">
          <p className="eyebrow">Moments</p>
          <h2>Gallery</h2>
        </div>
        <div className="gallery-slider-v2">
          <button
            type="button"
            className="gallery-nav-btn"
            onClick={goPrevGallery}
            aria-label="Previous gallery slide"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="gallery-viewport-v2">
            <div
              className="gallery-track-v2"
              style={{ transform: `translateX(-${galleryIndex * 100}%)` }}
            >
              {gallerySlides.map((group, slideIdx) => (
                <div key={slideIdx} className="gallery-slide-v2">
                  {group.map((entry, idx) => (
                    <figure key={`${slideIdx}-${idx}`} className="gallery-card-v2">
                      <Image
                        src={urlFor(entry.image).width(1200).url()}
                        width={1200}
                        height={800}
                        alt={entry.caption || `Gallery image ${slideIdx * 2 + idx + 1}`}
                        className="gallery-image-v2"
                      />
                      {entry.caption ? <figcaption>{entry.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="gallery-nav-btn"
            onClick={goNextGallery}
            aria-label="Next gallery slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="gallery-counter-v2">
          {gallerySlides.length ? galleryIndex + 1 : 0} / {gallerySlides.length}
        </div>
      </section>

      <section className="section-v2 contact-v2" id="contact">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h2>Start Your Career Clarity Journey</h2>
          <p className="contact-copy">
            Fill in this form and we will get back to you with a personalized guidance plan.
          </p>
          <div className="contact-meta">
            <p>
              <strong>Phone:</strong> <a href={`tel:${data.phone}`}>{data.phone}</a>
            </p>
            <p>
              <strong>Email:</strong> <a href={`mailto:${data.email}`}>{data.email}</a>
            </p>
            <p>
              <strong>Location:</strong> {data.officeLocation || "Online and Hybrid"}
            </p>
          </div>
        </div>

        <form className="contact-form" onSubmit={submitForm}>
          <label>
            Name
            <input
              value={formState.name}
              onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={formState.phone}
              onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
            />
          </label>
          <label>
            Subject
            <input
              value={formState.subject}
              onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
            />
          </label>
          <label className="full-width">
            Message
            <textarea
              rows={5}
              value={formState.message}
              onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
              required
            />
          </label>

          <button className="cta-solid submit-btn" disabled={formLoading} type="submit">
            {formLoading ? "Submitting..." : "Send Message"}
            <Send size={15} />
          </button>

          {formMessage ? <p className="form-message">{formMessage}</p> : null}
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <p className="brand-title">{data.brandName}</p>
          <p>{data.tagline}</p>
        </div>

        <div className="footer-links">
          {navItems.slice(1).map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="footer-social">
          {data.instagram ? (
            <Link href={data.instagram} target="_blank">
              Instagram
            </Link>
          ) : null}
          {data.linkedin ? (
            <Link href={data.linkedin} target="_blank">
              LinkedIn
            </Link>
          ) : null}
          {data.youtube ? (
            <Link href={data.youtube} target="_blank">
              YouTube
            </Link>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
