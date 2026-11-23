import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CalendarPlus,
  Heart,
  Check,
  X,
  Send,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Remplacez par votre clé d'accès Web3Forms
const WEB3FORMS_ACCESS_KEY = 'fefe8d79-ff63-4433-94d2-6a822e414434'
export default function WeddingInvitation() {
  const targetDate = new Date('2026-12-22T13:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 29,
    hours: 0,
    minutes: 34,
    seconds: 7,
  });

  const [activeModal, setActiveModal] = useState<'rsvp' | 'wishes' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // État du formulaire RSVP
  const [rsvpData, setRsvpData] = useState({
    name: '',
    attendance: 'Accepte avec joie',
    guests: '1 personne',
  });

  // État du formulaire de vœux
  const [wishData, setWishData] = useState({
    name: '',
    message: '',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const handleAddToCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'DTSTART:20261222T130000Z',
      'DTEND:20261222T180000Z',
      'SUMMARY:Invitation de mariage - Hadjer Rahmani',
      'LOCATION:Salle des Fêtes la blanche , Khemis Miliana, Algérie',
      'DESCRIPTION:Avec leurs familles, ils ont la joie de vous convier à célébrer leur union.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invitation-mariage.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Envoyer la confirmation de présence par e-mail
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Réponse mariage : ${rsvpData.name} (${rsvpData.attendance})`,
          from_name: 'Site Invitation Mariage',
          Nom_Invite: rsvpData.name,
          Statut: rsvpData.attendance,
          Nombre_Invites: rsvpData.guests,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRsvpSubmitted(true);
        setRsvpData({ name: '', attendance: 'Accepte avec joie', guests: '1 personne' });
      } else {
        setErrorMsg("Échec de l'envoi de la réponse. Veuillez réessayer.");
      }
    } catch {
      setErrorMsg('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Envoyer les félicitations et vœux par e-mail
  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nouveau message de félicitations de ${wishData.name}`,
          from_name: 'Site Invitation Mariage',
          Nom_Expediteur: wishData.name,
          Message_Felicitations: wishData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setWishSubmitted(true);
        setWishData({ name: '', message: '' });
      } else {
        setErrorMsg("Échec de l'envoi du message. Veuillez réessayer.");
      }
    } catch {
      setErrorMsg('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div
      className="min-h-screen bg-[#1E2530] flex items-center justify-center p-0 sm:p-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <main className="relative w-full max-w-[420px] min-h-screen sm:min-h-[840px] bg-[#F5F0E8] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between text-[#2C352D]">
        {/* En-tête floral supérieur */}
        <div className="relative w-full h-36 pointer-events-none select-none">
          <img
            src="bg1.jpg"
            alt="Composition florale supérieure"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F0E8]" />
        </div>
        {/* Bouton audio */}

        {/* Contenu principal */}
        <div className="relative z-10 px-6 -mt-6 flex flex-col items-center text-center flex-1">

    <p className="mt-4 px-3 py-1.5 rounded-xl bg-white/60 border border-[#E2D7C5] text-[11px] italic text-[#687369] w-full text-center">
  Pour vous offrir une soirée de détente et de fête, notre mariage se déroule <span className="font-semibold text-[#4E584F] not-italic">sans enfants</span>.
</p>
          {/* <span className="px-4 py-1 rounded-full bg-white/75 border border-[#D8CBB8] text-[10px] font-semibold tracking-[0.2em] text-[#8E795B] uppercase shadow-xs">
            Réservez la date
          </span> */}

          <h1
            className="mt-3 text-[34px] leading-tight font-semibold text-[#232B24]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Invitation de Mariage
          </h1>

          <h2
            className="mt-1 text-[38px] leading-none text-[#9B825E]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Hadjer Rahmani
          </h2>

          <div className="my-3 flex items-center gap-2 text-[#B89F7D]">
            <span className="h-[1px] w-10 bg-[#D5C5AE]" />
            <span className="text-xs">❧</span>
            <span className="h-[1px] w-10 bg-[#D5C5AE]" />
          </div>

          <p className="text-[13px] italic text-[#4E584F] max-w-[290px] leading-relaxed">
            Avec leurs familles, ils ont la joie de vous convier à célébrer leur union
          </p>

          {/* Compte à rebours */}
          <div className="mt-5 w-full flex items-center justify-center gap-2">
            {[
              { label: 'JOURS', value: formatNumber(timeLeft.days) },
              { label: 'HEURES', value: formatNumber(timeLeft.hours) },
              { label: 'MIN', value: formatNumber(timeLeft.minutes) },
              { label: 'SEC', value: formatNumber(timeLeft.seconds) },
            ].map((item, idx) => (
              <React.Fragment key={item.label}>
                <div className="flex-1 max-w-[74px] py-3 px-2 rounded-2xl bg-white/75 backdrop-blur-md border border-[#E2D7C5] shadow-[0_6px_20px_rgba(44,53,45,0.05)] flex flex-col items-center">
                  <span
                    className="text-[28px] font-bold leading-none text-[#232B24]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {item.value}
                  </span>
                  <span className="mt-1.5 text-[9px] font-semibold tracking-[0.14em] text-[#8E795B]">
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <span className="text-[#B89F7D] font-bold text-sm select-none">:</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Carte date et heure */}
          <div className="mt-4 w-full px-4 py-3.5 rounded-2xl bg-white/75 backdrop-blur-md border border-[#E2D7C5] shadow-[0_6px_20px_rgba(44,53,45,0.04)] flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#F5F0E8] border border-[#E2D7C5] flex items-center justify-center shrink-0 text-[#9B825E]">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#232B24]">
                Mardi, 22 Décembre 2026
              </p>
              <p className="text-[12px] text-[#687369] mt-0.5">13:00</p>
            </div>
          </div>

          {/* Carte lieu */}
          <div className="mt-3 w-full p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-[#E2D7C5] shadow-[0_6px_20px_rgba(44,53,45,0.04)] text-left">
            <p className="text-[14px] font-semibold text-[#232B24]">
              Salle des Fêtes la blanche 
            </p>
            <p className="text-[12px] text-[#687369] mt-0.5">
              Khemis Miliana, Algérie
            </p>

            <div className="mt-3 flex items-center gap-2">
              <a
                href="https://maps.app.goo.gl/ehfUFdbQvrAv7tXc9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-full bg-[#536450] hover:bg-[#435240] text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                Voir sur Google Maps
              </a>

              <button
                onClick={handleAddToCalendar}
                className="flex-1 py-2 px-3 rounded-full bg-white/80 hover:bg-white border border-[#CBBBA0] text-[#7D6646] text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Ajouter à l'agenda
              </button>
            </div>
          </div>

          {/* Programme */}
          <div className="mt-4 w-full px-2 text-left">
            <div className="relative pl-5 space-y-2.5 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#CBBBA0]">
              {[
                { time: '13h30', title: 'Réception & Accueil des invités' },
                { time: '16h00', title: 'Café et Musique' },
                { time: '18h00', title: 'Fin de fête ' },
              ].map((event) => (
                <div key={event.time} className="relative flex items-center gap-2 text-[12px]">
                  <span className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-[#F5F0E8] border-2 border-[#9B825E]" />
                  <span className="font-semibold text-[#232B24]">{event.time}</span>
                  <span className="text-[#9B825E]">—</span>
                  <span className="text-[#4E584F]">{event.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-5 w-full flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setRsvpSubmitted(false);
                setErrorMsg(null);
                setActiveModal('rsvp');
              }}
              className="py-2.5 px-4 rounded-full bg-[#3D4B3B] hover:bg-[#2F3B2E] text-white text-[11.5px] font-medium shadow-md transition shrink-0"
            >
              Confirmer présence (RSVP)
            </button>

            <button
              onClick={() => {
                setWishSubmitted(false);
                setErrorMsg(null);
                setActiveModal('wishes');
              }}
              className="py-2.5 px-2 text-[11.5px] font-medium text-[#2C352D] hover:text-[#8E795B] underline underline-offset-4 transition text-right"
            >
              Envoyer félicitations & vœux
            </button>
          </div>
        </div>

        {/* Pied de page floral inférieur */}
        <div className="relative w-full h-28 mt-2 pointer-events-none select-none flex items-end justify-center">
          <img
            src="bg1.jpg"
            alt="Composition florale inférieure"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#F5F0E8]" />
          <ChevronDown className="relative z-10 mb-2 w-4 h-4 text-[#4E584F]/70 animate-bounce" />
        </div>

        {/* Fenêtre modale */}
        {activeModal && (
          <div className="absolute inset-0 z-30 bg-[#1E2530]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <div className="w-full bg-[#FAF7F2] border border-[#E2D7C5] rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3">
                <h3
                  className="text-xl font-semibold text-[#232B24]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {activeModal === 'rsvp' ? 'Confirmer votre présence' : 'Envoyer vos vœux'}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full hover:bg-[#EFE8DC] text-[#5C675D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <p className="mt-3 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {errorMsg}
                </p>
              )}

              {activeModal === 'rsvp' ? (
                rsvpSubmitted ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#536450]/15 text-[#536450] flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-[#232B24]">Merci pour votre confirmation !</p>
                    <p className="text-xs text-[#687369]">Nous avons hâte de célébrer ce moment avec vous.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="mt-4 space-y-3 text-left">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5C675D] mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                        placeholder="Entrez votre nom"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD0BE] text-xs focus:outline-none focus:border-[#536450]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-[#5C675D] mb-1">
                          Présence
                        </label>
                        <select
                          value={rsvpData.attendance}
                          onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD0BE] text-xs focus:outline-none focus:border-[#536450]"
                        >
                          <option value="Accepte avec joie">Accepte avec joie</option>
                          <option value="Décline à regret">Décline à regret</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#5C675D] mb-1">
                          Nombre d'invités
                        </label>
                        <select
                          value={rsvpData.guests}
                          onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD0BE] text-xs focus:outline-none focus:border-[#536450]"
                        >
                          <option value="1 personne">1 personne</option>
                          <option value="2 personnes">2 personnes</option>
                          <option value="3 personnes">3 personnes</option>
                          <option value="4+ famille">4+ famille</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-2.5 rounded-full bg-[#3D4B3B] hover:bg-[#2F3B2E] disabled:opacity-60 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer la confirmation'
                      )}
                    </button>
                  </form>
                )
              ) : wishSubmitted ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#9B825E]/15 text-[#9B825E] flex items-center justify-center mx-auto">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-[#232B24]">Message envoyé !</p>
                  <p className="text-xs text-[#687369]">Merci pour vos chaleureux vœux.</p>
                </div>
              ) : (
                <form onSubmit={handleWishSubmit} className="mt-4 space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5C675D] mb-1">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      required
                      value={wishData.name}
                      onChange={(e) => setWishData({ ...wishData, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD0BE] text-xs focus:outline-none focus:border-[#536450]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5C675D] mb-1">
                      Votre message
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={wishData.message}
                      onChange={(e) => setWishData({ ...wishData, message: e.target.value })}
                      placeholder="Écrivez un mot de félicitations ou un vœu..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD0BE] text-xs focus:outline-none focus:border-[#536450] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-full bg-[#9B825E] hover:bg-[#856E4D] disabled:opacity-60 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Envoyer les vœux
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}