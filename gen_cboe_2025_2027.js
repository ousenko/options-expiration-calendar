// npm install luxon
const { DateTime } = require('luxon');
const fs = require('fs');

// Expiration dates (third Friday of each month, as per CBOE rules)
const expirations = [
  // 2025
  '2025-01-17', '2025-02-21', '2025-03-21', '2025-04-17', '2025-05-16', '2025-06-20',
  '2025-07-18', '2025-08-15', '2025-09-19', '2025-10-17', '2025-11-21', '2025-12-19',
  // 2026
  '2026-01-16', '2026-02-20', '2026-03-20', '2026-04-17', '2026-05-15', '2026-06-18',
  '2026-07-17', '2026-08-21', '2026-09-18', '2026-10-16', '2026-11-20', '2026-12-18',
  // 2027
  '2027-01-15', '2027-02-19', '2027-03-19', '2027-04-16', '2027-05-21', '2027-06-18',
  '2027-07-16', '2027-08-20', '2027-09-17', '2027-10-15', '2027-11-19', '2027-12-17'
];

// Function to create a single event in iCalendar format
function createEvent(dateStr) {
  // Event time: 17:00 MSK (UTC+3)
  const dt = DateTime.fromISO(dateStr, { zone: 'Europe/Moscow' }).set({ hour: 17, minute: 0, second: 0 });
  const dtStart = dt.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dtEnd = dt.plus({ minutes: 30 }).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

  const title = `⛔️ Expiration: ${dt.toFormat('dd LLLL yyyy')} ⛔️`;

  // Reminders: 10, 7, 4, 2, 1 days before, and at event time (in minutes before event)
  const reminders = [10, 7, 4, 2, 1, 0].map(days => `
BEGIN:VALARM
TRIGGER:-P${days}D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${title}
END:VALARM`).join('');

  // UID for uniqueness (you can change the domain part)
  const uid = `exp-cboe-${dateStr.replace(/-/g, '')}@yourdomain.com`;

  return `
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${DateTime.now().toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${title}
DESCRIPTION:Monthly CBOE options expiration
LOCATION:Online
${reminders}
END:VEVENT`;
}

// Generate the entire calendar
const calendar = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//YourCompany//CBOE Expiration Calendar//EN
${expirations.map(createEvent).join('\n')}
END:VCALENDAR
`;

// Save the .ics file
fs.writeFileSync('cboe_expirations_2025_2027.ics', calendar.trim());

console.log('ICS calendar created: cboe_expirations_2025_2027.ics');
