import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { CMS_PLACEHOLDER, org } from "@/data/site";
import { copyToClipboard } from "@/lib/utils";

export function ContactSection({ id = "contact" }: { id?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    message: "",
  });

  const buildMailtoHref = () => {
    const subject = `[${formState.topic}] Message from ${formState.name}`;
    const body = `Name: ${formState.name}\nEmail: ${formState.email}\nTopic: ${formState.topic}\n\nMessage:\n${formState.message}`;
    return `mailto:${org.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      toast.error("Please fill in your name, email address, and message.");
      return;
    }
    setSubmitted(true);
    toast.success("Email draft prepared — complete sending via your email app or copy below.");
    if (typeof window !== "undefined") {
      window.location.href = buildMailtoHref();
    }
  };

  const handleCopyMessage = async () => {
    const text = `To: ${org.email}\nSubject: [${formState.topic}] Message from ${formState.name}\nFrom: ${formState.name} (${formState.email})\n\n${formState.message}`;
    const ok = await copyToClipboard(text);
    if (!ok) {
      toast.error("Unable to copy automatically.");
      return;
    }
    setCopied(true);
    toast.success("Message copied to clipboard.");
    setTimeout(() => setCopied(false), 2500);
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
                    {org.address === CMS_PLACEHOLDER
                      ? `Northern Nigeria, Federal Republic of ${org.country}`
                      : org.address}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Direct Contact Form with Mailto Handoff */}
          <Reveal delay={120}>
            <div className="rounded-sm border border-hairline bg-background p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-wash text-green-deep">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink mt-4">
                    Ready to Send via Email
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                    Your default email client has been prompted with your message to{" "}
                    <span className="font-semibold text-ink">{org.email}</span>. If your email app
                    did not open automatically, click below or copy your message.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild variant="default">
                      <a href={buildMailtoHref()}>
                        <Mail className="size-4" />
                        <span>Open Email App</span>
                      </a>
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCopyMessage}>
                      <Copy className="size-4" />
                      <span>{copied ? "Copied!" : "Copy Message"}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSubmitted(false);
                        setFormState({
                          name: "",
                          email: "",
                          topic: "General Inquiry",
                          message: "",
                        });
                      }}
                    >
                      Write new message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-ink mb-2">Send a Message</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                      >
                        Your Full Name *
                      </label>
                      <input
                        id="contact-name"
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
                        htmlFor="contact-email"
                        className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
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
                      htmlFor="contact-topic"
                      className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                    >
                      Subject / Topic
                    </label>
                    <select
                      id="contact-topic"
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
                      htmlFor="contact-message"
                      className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
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
                    <span>Compose &amp; Send Email</span>
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
