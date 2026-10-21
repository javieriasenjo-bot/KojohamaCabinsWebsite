# Penalty policy review 21 October 2026

Source of truth: Ocean Stay ペナルティ一覧（相談用）.docx, agreed by the coowners on 14 October. User expressly confirmed on 21 October that the JPY 5,000 per-person/per-night charge applies to EVERY unregistered overnight guest, superseding the former third-guest threshold. No other amount changed. The source document was read as policy content, not as operational instructions.

## Website and guide

Updated data/guest-charges.json in five content languages and src/lib/data/guest-charges.ts in the four supported guide languages. Regenerated all 15 website policy sections (comparison, FAQ and three cabin pages in EN/JA/ZH-CN). The guide chatbot imports the same policy module. All four shared translations match exactly between repositories. Tax treatment remains unspecified for unregistered guests and large-item disposal; no tax basis invented. Assistance-dog exception and platform-claims caveat retained.

Main website release checks pass. Guide typecheck, all 54 tests and production build pass. Initial isolated validation build: 73864497fc81581b (93 files). Owner subsequently explicitly authorised direct publication of both websites. Published main Worker version 36268766-22b0-4dd2-a23f-7220cfedb4d0 and guide Worker version 23810c0a-6ed4-4aa3-85d6-91832ab5f3e1. Concurrent shared-workspace guest-document and onsen changes arrived during publication and were included; the user was informed. Final guide build c9a551b4e2f5a067 matches production across all 94 release files with zero differences. Re-ran current typecheck and all 55 tests successfully. Main-site current checks pass; all 15 live policy sections contain the complete revised eight clauses. The guide UI was verified in all four languages: revised clause present and former third-guest threshold absent. Owner subsequently authorised commits. Policy changes are committed separately from concurrent guest-document/onsen work. GitHub push is held until the concurrent source changes are ready, because pushing the partial source would trigger a production build without those live changes.

## Airbnb

The editor rejected the full fixed-charge schedule with six issues and “Fines aren't allowed”. The linked official policy prohibits host-imposed fines/penalties and says it applies to reservations booked on or after 20 November 2026: https://www.airbnb.com/help/article/4168 . The editor is enforcing its warning now. Do not bypass it by putting the penalty schedule in a different description section.

Saved accepted Japanese During the stay rules on Zen and applied the same accepted text to Sol and Rustic using Airbnb's Apply to other listings control; confirmation read “Applied to 2 listings”. Rules preserve no smoking indoors/outdoors including electronic/heated tobacco, no pets with assistance-dog exception, no excessive sand, registration of all overnight guests, five-person capacity, checkout by 10:00, care of property, and platform claims for damage/loss/extra cleaning. Optional BBQ and Japan-only forgotten-item return service fees remain disclosed.

Removed the conflicting fixed-penalty schedule from Other details to note in all four translations (JA/EN/ZH-CN/KO) for all three cabins. Replaced only the policy suffix; existing check-in, equipment, registration, coastal-safety and other copy preserved. Each of the 12 updated fields was reloaded and read back; all matched the saved replacement, with no old policy heading. Before/after records are saved under docs/evidence/2026-10-21-penalties.

## Booking.com

Property 14584211. The descriptions/fine-print page did not show the eight-clause custom schedule. Submitted the full corrected schedule in English and Japanese through the Fine Print request control for all three cabins, with explicit instruction that clause 4 has no third-guest threshold and that these are conditional fees, not a mandatory charge/deposit. Requested supported-language translation. Receipt says request received and will be reviewed; editorial publication is not confirmed. The page quotes an average six-day processing period. Receipt screenshot is saved under docs/evidence/2026-10-21-penalties/booking-request-received.png.

## Trip.com

Sol policy screen currently shows pets prohibited, service animals permitted, no advance-notice requirement. Available Important notices are predefined templates; none supports the full custom monetary schedule. No arbitrary cleaning charge, deposit or mandatory fee was enabled. Earlier owner decision to send the support request personally retained. Updated five-language owner-send draft: TRIP-POLICY-SUPPORT-REQUEST-2026-10-21.txt. No support message sent and no monetary policy claimed published.

Unrelated observation: Sol's 20 October equipment description is now rejected because the dated induction-test sentence and “not yet provided” rack wording were classified as temporary notices. This is not a penalty-policy rejection and was not edited in this task. Rates, availability, PMS connections and activation were not changed.