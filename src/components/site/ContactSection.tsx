import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { org } from "@/data/site";

export function ContactSection({ id = "contact" }: { id?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
  };

  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28 bg-surface border-t border-hairline">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="eyebrow text-brand-red">Get in Touch</p>
            <h2 className="display-2 mt-3 text-ink">Contact the Foundation</h2>
            <p className="lede mt-4">
              Whether you are reaching out to volunteer, discuss a partnership, or verify campaign
              documentation, our team responds to all genuine enquiries.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xs bg-green-wash text-green-deep">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </h4>
                  <a
                    href={`mailto:${org.email}`}
                    className="mt-1 block text-base font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
                  >
                    {org.email}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official correspondence &amp; partnerships
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xs bg-green-wash text-green-deep">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Operational Region
                  </h4>
                  <p className="mt-1 text-base font-semibold text-ink">
                    Jigawa State &amp; Kano State Corridor
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Northern Nigeria, Federal Republic of Nigeria
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Quick Contact Form */}
          <Reveal delay={120}>
            <div className="rounded-sm border border-hairline bg-background p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-wash text-green-deep">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink mt-4">
                    Message Received
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you for contacting Abba Roller Foundation. A member of our team will
                    review your message and reply to{" "}
                    <span className="font-semibold text-ink">{formState.email}</span> shortly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: "", email: "", topic: "General Inquiry", message: "" });
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-ink mb-2">Send a Message</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                      >
                        Your Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Amina Bello"
                        className="w-full rounded-xs border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-green-deep focus:bg-background"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full rounded-xs border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-green-deep focus:bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="topic"
                      className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                    >
                      Subject / Topic
                    </label>
                    <select
                      id="topic"
                      value={formState.topic}
                      onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-green-deep focus:bg-background"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Volunteer Application">Volunteer Application</option>
                      <option value="Institutional Partnership">Institutional Partnership</option>
                      <option value="Donation & CSR Inquiry">Donation &amp; CSR Inquiry</option>
                      <option value="Media & Press Inquiry">Media &amp; Press Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Please share how you would like to collaborate or ask your question..."
                      className="w-full rounded-xs border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-green-deep focus:bg-background resize-y"
                    />
                  </div>

                  <Button type="submit" variant="default" size="lg" className="w-full gap-2">
                    <Send className="size-4" />
                    Submit Message
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
