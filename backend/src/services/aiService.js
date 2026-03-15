const { GoogleGenerativeAI } = require('@google/generative-ai');
const Bus = require('../models/Bus');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DEFAULT_SYSTEM_PROMPT = `You are Artcraft Bus Booking Assistant, a helpful chatbot for a bus ticket booking system.

Your capabilities:
1. Help users search for available bus tickets between cities
2. Show user's bookings
3. Help cancel bookings (ask for booking ID)
4. Answer FAQs about ticket booking, cancellation, refund policies
5. Guide users through the booking process

Important rules:
- Be friendly and concise
- Always respond in a helpful manner
- If user asks to search tickets, ask for: departure city, destination city, and travel date (if not provided)
- If user asks to show bookings, inform them they need to be logged in
- If user asks to cancel booking, ask for booking ID
- Only provide booking-related information, don't answer unrelated questions
- Format bus results clearly with: Bus Name, Time, Price, Available Seats

Response format for bus search results:
"Available buses from [FROM] to [TO]:
1. [Bus Name] - [Time] - Rs.[Price] - [Seats] seats available - [Type]
2. ..."

Response format for user bookings:
"Your Bookings:
1. [Bus Name] | [From] → [To] | [Date] | [Time] | Status: [Status] | Booking ID: [ID]
2. ..."

Always respond in English.`;

async function getCitiesFromDB() {
  try {
    const fromCities = await Bus.distinct('from');
    const toCities = await Bus.distinct('to');
    return [...new Set([...fromCities, ...toCities])].map(c => c.toLowerCase());
  } catch (error) {
    return ['No city data available'];
  }
}

async function generateResponse(userMessage, conversationHistory = [], customSystemPrompt = null) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const systemPrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;
    
    const historyWithSystem = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ];

    const chat = model.startChat({
      history: historyWithSystem,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

function extractIntent(userMessage) {
  const message = userMessage.toLowerCase();
  
  const intentPatterns = {
    search_ticket: [
      'book ticket', 'find ticket', 'search bus', 'search ticket',
      'want to go', 'going to', 'travel to', 'bus from', 'to book',
      'available buses', 'tickets from', 'need a bus'
    ],
    show_bookings: [
      'my bookings', 'show bookings', 'my tickets', 'show my bookings',
      'my bookings', 'booking history', 'previous bookings'
    ],
    cancel_booking: [
      'cancel ticket', 'cancel booking', 'cancel my ticket',
      'cancel my booking', 'delete booking'
    ],
    help: [
      'help', 'what can you do', 'capabilities', 'commands',
      'what can you help with', 'options'
    ],
    faq: [
      'how does', 'what is', 'policy', 'refund', 'payment',
      'question', 'faq', 'information'
    ]
  };

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (message.includes(pattern)) {
        return intent;
      }
    }
  }

  return 'general';
}

async function extractSearchParams(userMessage) {
  const message = userMessage.toLowerCase();
  const cities = await getCitiesFromDB();
  
  let from = null;
  let to = null;
  let date = null;
  
  const datePattern = /\d{4}-\d{2}-\d{2}/;
  const dateMatch = userMessage.match(datePattern);
  if (dateMatch) {
    date = dateMatch[0];
  }
  
  const foundCities = cities.filter(city => message.includes(city));
  
  if (foundCities.length >= 2) {
    const fromIdx = message.indexOf(foundCities[0]);
    const toIdx = message.indexOf(foundCities[1]);
    
    if (fromIdx < toIdx) {
      from = foundCities[0].toUpperCase();
      to = foundCities[1].toUpperCase();
    } else {
      from = foundCities[1].toUpperCase();
      to = foundCities[0].toUpperCase();
    }
  } else if (foundCities.length === 1) {
    const toMatch = message.match(/to\s+(\w+)/i);
    if (toMatch) {
      const destination = toMatch[1].toLowerCase();
      if (cities.includes(destination)) {
        from = foundCities[0].toUpperCase();
        to = destination.toUpperCase();
      }
    }
  }

  return { from, to, date };
}

module.exports = {
  generateResponse,
  extractIntent,
  extractSearchParams,
  DEFAULT_SYSTEM_PROMPT,
  getCitiesFromDB
};