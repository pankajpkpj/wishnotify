'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LandingPage() {
  const router = useRouter()
  const waitlistRef = useRef<HTMLDivElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const scrollToWL = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => emailInputRef.current?.focus(), 600)
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const joinWL = async () => {
    if (!validateEmail(email)) {
      setEmailError(true)
      emailInputRef.current?.focus()
      setTimeout(() => setEmailError(false), 1600)
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email })

    setSubmitting(false)

    if (error && error.code !== '23505') {
      console.error('Waitlist error:', error)
      setEmailError(true)
      setTimeout(() => setEmailError(false), 1600)
      return
    }

    setSubmitted(true)
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">WishNotify<span>.</span></a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => router.push('/login')}>Sign in</button>
          <button className="btn-dark" onClick={() => router.push('/signup')}>Join waitlist →</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Early access — joining waitlist now
        </div>
        <h1>Wish on time<span className="muted">.</span><br />Every time<span className="muted">.</span></h1>
        <p className="hero-sub">WishNotify reminds you of birthdays, anniversaries, and every occasion that matters — delivered via WhatsApp or SMS, exactly when you need it.</p>
        <div className="hero-btns">
          <button className="btn-primary-lg" onClick={scrollToWL}>
            Join the waitlist
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </button>
          <button className="btn-outline-lg" onClick={() => document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>See how it works</button>
        </div>

        {/* Fake dashboard mockup */}
        <div className="hero-mockup">
          <div className="mockup-inner">
            <div className="dash-bar">
              <span className="dash-brand">WishNotify</span>
              <div className="dash-tabs">
                <span className="d-tab on">Reminders</span>
                <span className="d-tab">Contacts</span>
                <span className="d-tab">Settings</span>
              </div>
            </div>
            <div className="dash-head">
              <span>Upcoming reminders</span>
              <button className="dash-add">+ Add reminder</button>
            </div>
            <div className="r-row">
              <div className="r-av av1">PR</div>
              <div className="r-info"><div className="r-name">Priya Sharma</div><div className="r-occ">🎂 Birthday</div></div>
              <div className="r-date">Apr 10, 2026<br /><span className="r-pill today">Today</span></div>
              <span className="r-ch ch-wa">WhatsApp</span>
            </div>
            <div className="r-row">
              <div className="r-av av2">RS</div>
              <div className="r-info"><div className="r-name">Rahul & Sunita</div><div className="r-occ">💍 Anniversary</div></div>
              <div className="r-date">Apr 12, 2026<br /><span className="r-pill soon">In 3 days</span></div>
              <span className="r-ch ch-sms">SMS</span>
            </div>
            <div className="r-row">
              <div className="r-av av3">AM</div>
              <div className="r-info"><div className="r-name">Aryan Mehta</div><div className="r-occ">🎓 Graduation</div></div>
              <div className="r-date">Apr 22, 2026<br /><span className="r-pill normal">In 13 days</span></div>
              <span className="r-ch ch-wa">WhatsApp</span>
            </div>
            <div className="r-row">
              <div className="r-av av4">NK</div>
              <div className="r-info"><div className="r-name">Neha Kapoor</div><div className="r-occ">🎂 Birthday</div></div>
              <div className="r-date">May 3, 2026<br /><span className="r-pill normal">In 24 days</span></div>
              <span className="r-ch ch-wa">WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          <span className="m-item">WhatsApp reminders</span><span className="m-item">Birthday alerts</span><span className="m-item">Anniversary reminders</span><span className="m-item">SMS notifications</span><span className="m-item">Custom occasions</span><span className="m-item">1-day advance</span><span className="m-item">Day-of reminders</span><span className="m-item">Unlimited contacts</span><span className="m-item">Works worldwide</span><span className="m-item">2-minute setup</span>
          <span className="m-item">WhatsApp reminders</span><span className="m-item">Birthday alerts</span><span className="m-item">Anniversary reminders</span><span className="m-item">SMS notifications</span><span className="m-item">Custom occasions</span><span className="m-item">1-day advance</span><span className="m-item">Day-of reminders</span><span className="m-item">Unlimited contacts</span><span className="m-item">Works worldwide</span><span className="m-item">2-minute setup</span>
        </div>
      </div>

      {/* PROBLEM */}
      <div className="problem-wrap">
        <div className="problem-inner">
          <div>
            <p className="sec-tag">The problem</p>
            <h2>People forget<span className="muted">.</span><br />Relationships suffer<span className="muted">.</span></h2>
            <p>We're all busy. Birthdays slide past. Anniversaries go unacknowledged. A missed occasion feels like a small thing — until it isn't. WishNotify makes sure you're always the person who remembered.</p>
          </div>
          <div className="stats">
            <div className="stat"><div className="stat-n">68%</div><div className="stat-l">of people have missed a close friend's birthday in the past year</div></div>
            <div className="stat"><div className="stat-n">3x</div><div className="stat-l">stronger relationships when people feel consistently remembered</div></div>
            <div className="stat"><div className="stat-n">2 min</div><div className="stat-l">to set up your entire reminder list — works forever after</div></div>
            <div className="stat"><div className="stat-n">0</div><div className="stat-l">apps for your contacts to install — just WhatsApp or SMS</div></div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="sec" id="how">
        <p className="sec-tag">How it works</p>
        <h2>Set it up once<span className="muted">.</span><br />Never forget again<span className="muted">.</span></h2>
        <p className="sec-sub">Three steps. No complexity. No ongoing effort required.</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">Step 01</div>
            <div className="step-ico">👤</div>
            <h3>Add your people</h3>
            <p>Add contacts with their important dates — birthdays, anniversaries, graduations, or any custom occasion you care about.</p>
          </div>
          <div className="step">
            <div className="step-n">Step 02</div>
            <div className="step-ico">⏰</div>
            <h3>Choose your timing</h3>
            <p>Get reminded the day before to plan, or on the day when it counts. Set a default or customise per person. WhatsApp or SMS — your choice.</p>
          </div>
          <div className="step">
            <div className="step-n">Step 03</div>
            <div className="step-ico">💬</div>
            <h3>Receive &amp; wish</h3>
            <p>WishNotify sends a timely nudge right when you need it. Reach out, send a gift, or just call — you'll always be on time.</p>
          </div>
        </div>
      </div>

      {/* FEATURES BENTO */}
      <div className="sec" id="features" style={{paddingTop:0}}>
        <p className="sec-tag">Features</p>
        <h2>Built different<span className="muted">.</span></h2>
        <p className="sec-sub">Everything you need. Nothing you don't.</p>
        <div className="bento">
          <div className="bc dark s7">
            <p className="bc-tag">Delivery</p>
            <h3>WhatsApp &amp; SMS — your choice</h3>
            <p>Reminders land where you already are. No new app needed. Works on any phone, anywhere in the world.</p>
            <div className="notifs">
              <div className="nb">
                <div className="nb-top"><span className="nb-app">WishNotify · WhatsApp</span><span className="nb-t">9:00 AM</span></div>
                <div className="nb-title">🎂 Today is Priya's birthday!</div>
                <div className="nb-body">Don't forget to reach out — she'd love to hear from you.</div>
                <span className="nb-pill pwa">WhatsApp</span>
              </div>
              <div className="nb">
                <div className="nb-top"><span className="nb-app">WishNotify · SMS</span><span className="nb-t">8:30 AM</span></div>
                <div className="nb-title">💍 Tomorrow: Rahul &amp; Sunita's anniversary</div>
                <div className="nb-body">25 years — consider sending something special tonight.</div>
                <span className="nb-pill psms">SMS</span>
              </div>
            </div>
          </div>

          <div className="bc s5">
            <p className="bc-tag">Timing</p>
            <h3>Remind me when I want</h3>
            <p>Day before to plan ahead, day-of for last-minute magic, or both. Customisable per contact.</p>
            <div className="timing-opts">
              <div className="t-opt on"><span className="t-radio"></span>1 day before — plan ahead</div>
              <div className="t-opt"><span className="t-radio"></span>Day of — right when it matters</div>
              <div className="t-opt"><span className="t-radio"></span>Both — belt and suspenders</div>
            </div>
          </div>

          <div className="bc s4">
            <p className="bc-tag">Occasions</p>
            <h3>Every moment covered</h3>
            <p>Birthdays, anniversaries, graduations, festivals, work milestones — any occasion that matters to you.</p>
          </div>

          <div className="bc s4">
            <p className="bc-tag">Privacy</p>
            <h3>Your data stays yours</h3>
            <p>We never sell, share, or use your contacts' data. Private, encrypted, and only ever used to remind you.</p>
          </div>

          <div className="bc s4">
            <p className="bc-tag">Scale</p>
            <h3>No limits on contacts</h3>
            <p>Family, friends, teammates — add everyone. Pro plan supports unlimited contacts with no slowdown.</p>
          </div>
        </div>
      </div>

      {/* WAITLIST */}
      <div className="wl-section" ref={waitlistRef} id="waitlist">
        <h2>Never miss a moment<span className="muted">.</span></h2>
        <p className="sub">Join the waitlist. Early members get a founding rate — locked in forever.</p>
        
        {!submitted ? (
          <>
            <div className="wl-form" id="wl-form-wrap">
              <input 
                type="email" 
                placeholder="you@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinWL()}
                ref={emailInputRef}
                style={{ borderColor: emailError ? 'rgba(239,68,68,.6)' : '' }}
              />
              <button onClick={joinWL} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Get early access'}
              </button>
            </div>
            <p className="wl-note">No spam. No credit card. Just a heads-up when we go live.</p>
          </>
        ) : (
          <div className="wl-success">You're on the list. We'll reach out when we launch.</div>
        )}
      </div>

      {/* FAQ */}
      <div className="sec" id="faq">
        <p className="sec-tag">FAQ</p>
        <h2>Common questions<span className="muted">.</span></h2>
        <div className="faq-list">
          {[
            { q: 'What is WishNotify?', a: 'WishNotify is a reminder service for the people who matter to you. Add contacts with their special dates, set your timing and channel preference, and receive WhatsApp or SMS alerts so you\'re always the first to wish them well.' },
            { q: 'How are reminders delivered?', a: 'Via WhatsApp or SMS — whichever you prefer. You set a default for all contacts or choose per person. No app needs to be installed on your end to receive them.' },
            { q: 'Can I be reminded the day before, not just on the day?', a: 'Yes. Choose 1 day before, on the day itself, or both — globally or per individual contact. You\'re fully in control of the timing.' },
            { q: 'What kinds of occasions can I add?', a: 'Anything. Birthdays, wedding anniversaries, work anniversaries, graduations, festivals, and fully custom occasions. If it matters to you, add it.' },
            { q: 'Is my data private?', a: 'Completely. We never sell, share, or use your contacts\' information for anything other than sending you reminders. Everything is encrypted and stored privately.' },
            { q: 'When will WishNotify launch?', a: 'We\'re in the final stages of development. Join the waitlist to be among the first to access WishNotify — and lock in your founding member rate for life.' }
          ].map((item, index) => (
            <div className="faq-item" key={index}>
              <button 
                className={`faq-q ${openFaqIndex === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                {item.q}
                <span className="faq-ico">+</span>
              </button>
              {openFaqIndex === index && (
                <div className="faq-a open">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="foot-inner">
        <span className="foot-logo">WishNotify<span>.</span></span>
        <div className="foot-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="mailto:hello@wishnotify.com">Contact</a>
        </div>
        <span className="foot-copy">© WishNotify 2026. All rights reserved.</span>
      </div>
    </>
  )
}