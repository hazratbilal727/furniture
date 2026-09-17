"use client";

import { useState } from "react";
import { PageHero } from "../components/page-hero";
import { RouteShell } from "../components/route-shell";

const facebookUrl =
  "https://www.facebook.com/profile.php?id=61594251901318&sk=followers";

const contactPeople = [
  {
    name: "Muntazir Khan",
    role: "Owner",
    mobile: "03239693972",
    whatsapp: "923239693972",
    initials: "MK",
  },
  {
    name: "Azaz Ali",
    role: "Partner",
    mobile: "03009700227",
    whatsapp: "923009700227",
    initials: "AA",
  },
  {
    name: "Abd Ullah",
    role: "Team Member",
    mobile: "03251851838",
    whatsapp: "923251851838",
    initials: "AU",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <RouteShell>
      <main className="contact-page">
        <PageHero
          eyebrow="WE ARE HERE TO HELP"
          title={
            <>
              Let’s make your space <i>feel right.</i>
            </>
          }
          copy="Ask us about a piece, a room, delivery, or a custom direction. Our team would love to hear from you."
          image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85"
        />
        <section className="contact-route">
          <div className="contact-details">
            <p className="eyebrow">VISIT OR WRITE</p>
            <h2>Come say hello.</h2>
            <p>
              Our studio is open Monday to Saturday, 10am to 7pm. Walk in for a
              browse or call ahead for a considered consultation.
            </p>
            <div className="contact-list">
              <div>
                <i className="icon fa-solid fa-location-dot" />
                <span>
                  <strong>Studio</strong>University Road, Peshawar
                </span>
              </div>
              <div>
                <i className="icon fa-solid fa-clock" />
                <span>
                  <strong>Opening hours</strong>Monday to Saturday, 10am to 7pm
                </span>
              </div>
              <div>
                <i className="icon fa-solid fa-phone" />
                <span>
                  <strong>Phone</strong>
                  <a href="tel:+92915273555">+92 91 527 3555</a>
                </span>
              </div>
              <div>
                <i className="icon fa-solid fa-envelope" />
                <span>
                  <strong>Email</strong>
                  <a href="mailto:hello@muntazirandsons.com">
                    hello@muntazirandsons.com
                  </a>
                </span>
              </div>
            </div>
            <div className="contact-quick-actions">
              <a className="contact-call-button" href="tel:+92915273555">
                <i className="icon fa-solid fa-phone" /> Call the studio
              </a>
              <a
                className="contact-facebook-button"
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon fa-brands fa-facebook-f" /> Facebook
              </a>
            </div>
          </div>
          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <p className="eyebrow">SEND A MESSAGE</p>
            <h3>Tell us what you’re imagining.</h3>
            <label>
              Name
              <input required name="name" placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                name="email"
                placeholder="you@example.com"
              />
            </label>
            <label>
              How can we help?
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Tell us a little about what you need"
              />
            </label>
            <button className="button button-primary" type="submit">
              {sent ? "Message received" : "Send message"}{" "}
              <i className="icon fa-solid fa-arrow-right" />
            </button>
            {sent && (
              <p className="form-message">
                Thank you. A member of our team will be in touch soon.
              </p>
            )}
          </form>
        </section>
        <section className="contact-team">
          <div className="contact-section-heading">
            <div>
              <p className="eyebrow">DIRECT CONTACT</p>
              <h2>Speak with our team.</h2>
            </div>
            <p>
              Call directly or start a WhatsApp conversation with the person who
              can help.
            </p>
          </div>
          <div className="contact-team-grid">
            {contactPeople.map((person) => (
              <article className="contact-person-card" key={person.name}>
                <div
                  className="contact-person-placeholder"
                  role="img"
                  aria-label={`${person.name} profile placeholder`}
                >
                  <span>{person.initials}</span>
                  <i className="icon fa-solid fa-user" />
                </div>
                <div className="contact-person-info">
                  <p className="eyebrow">{person.role}</p>
                  <h3>{person.name}</h3>
                  <div className="contact-person-actions">
                    <a
                      className="contact-phone-button"
                      href={`tel:${person.mobile}`}
                    >
                      <i className="icon fa-solid fa-phone" /> {person.mobile}
                    </a>
                    <a
                      className="contact-whatsapp-button"
                      href={`https://wa.me/${person.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Message ${person.name} on WhatsApp`}
                    >
                      <i className="icon fa-brands fa-whatsapp" /> WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="contact-note">
          <i className="icon fa-solid fa-message" />
          <div>
            <p className="eyebrow">A QUICK NOTE</p>
            <h2>Good conversations make better rooms.</h2>
            <p>
              Whether you are furnishing one corner or an entire home, tell us
              what you need and we’ll help you find the right direction.
            </p>
          </div>
          <a
            className="contact-note-link"
            href="mailto:hello@muntazirandsons.com"
          >
            Email our studio <i className="icon fa-solid fa-arrow-right" />
          </a>
        </section>
      </main>
    </RouteShell>
  );
}
