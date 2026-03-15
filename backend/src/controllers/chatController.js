const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const { generateResponse, extractIntent, extractSearchParams } = require('../services/aiService');

const generateSessionId = () => {
  return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const getAvailableCities = async () => {
  try {
    const fromCities = await Bus.distinct('from', { availableSeats: { $gt: 0 } });
    const toCities = await Bus.distinct('to', { availableSeats: { $gt: 0 } });
    const allCities = [...new Set([...fromCities, ...toCities])].sort();
    return allCities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return ['Lahore', 'Islamabad', 'Karachi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Rawalpindi', 'Sialkot', 'Gujranwala'];
  }
};

const getCities = async (req, res) => {
  try {
    const cities = await getAvailableCities();
    res.json({ cities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

const getBusTypes = async () => {
  try {
    const types = await Bus.distinct('busType');
    return types;
  } catch (error) {
    return ['Standard', 'Express', 'Luxury', 'Sleeper'];
  }
};

const buildSystemPrompt = async () => {
  const cities = await getAvailableCities();
  const busTypes = await getBusTypes();

  return `You are Artcraft Bus Booking Assistant, a helpful chatbot for a bus ticket booking system.

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

Available cities in the system: ${cities.join(', ')}

Bus types available: ${busTypes.join(', ')}

Response format for bus search results:
"Available buses from [FROM] to [TO]:
1. [Bus Name] - [Time] - Rs.[Price] - [Seats] seats available - [Type]
2. ..."

Response format for user bookings:
"Your Bookings:
1. [Bus Name] | [From] → [To] | [Date] | [Time] | Status: [Status] | Booking ID: [ID]
2. ..."

Always respond in English.`;
};

const handleSearchTicket = async (params) => {
  const { from, to, date } = params;
  
  if (!from || !to) {
    const cities = await getAvailableCities();
    return `To search for tickets, please provide:\n• Departure city\n• Destination city\n\nAvailable cities: ${cities.join(', ')}\n\nFor example: "I want to go from ${cities[0]} to ${cities[1]}"`;
  }

  const query = {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    availableSeats: { $gt: 0 }
  };

  if (date) {
    query.travelDate = date;
  }

  const buses = await Bus.find(query).sort({ departureTime: 1 });

  if (buses.length === 0) {
    return `No buses found from ${from} to ${to}${date ? ` on ${date}` : ''}. Try different cities or date.`;
  }

  let response = `🚌 Available buses from ${from} to ${to}:\n\n`;
  buses.forEach((bus, index) => {
    response += `${index + 1}. ${bus.busName} - ${bus.departureTime} to ${bus.arrivalTime}\n`;
    response += `   💰 Rs. ${bus.price} | ${bus.availableSeats} seats | ${bus.busType}\n`;
    if (bus.amenities && bus.amenities.length > 0) {
      response += `   ✨ ${bus.amenities.join(', ')}\n`;
    }
    response += '\n';
  });

  response += 'To book a ticket, use the search page or provide your preferred bus number.';
  return response;
};

const handleShowBookings = async (userId) => {
  if (!userId) {
    return 'Please log in to view your bookings. You can do this from the login page.';
  }

  const bookings = await Booking.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);

  if (bookings.length === 0) {
    return 'You have no bookings yet. Use "Search Tickets" to find available buses.';
  }

  let response = '📋 Your Bookings:\n\n';
  bookings.forEach((booking, index) => {
    response += `${index + 1}. ${booking.busName}\n`;
    response += `   📍 ${booking.from} → ${booking.to}\n`;
    response += `   📅 ${booking.travelDate} | 🕐 ${booking.departureTime}\n`;
    response += `   💵 Rs. ${booking.totalPrice} | Status: ${booking.status}\n`;
    response += `   🔖 Booking ID: ${booking._id}\n\n`;
  });

  response += 'To cancel a booking, say "Cancel my booking" and provide the booking ID.';
  return response;
};

const handleCancelBooking = async (userId, bookingId) => {
  if (!userId) {
    return 'Please log in to cancel a booking.';
  }

  if (!bookingId) {
    return 'To cancel a booking, please provide the booking ID.\n\nYour recent bookings:\n';
  }

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    
    if (!booking) {
      return 'Booking not found. Please check your booking ID.';
    }

    if (booking.status === 'Cancelled') {
      return 'This booking is already cancelled.';
    }

    await Booking.findByIdAndUpdate(bookingId, { status: 'Cancelled' });
    
    return `✅ Booking cancelled successfully!\n\nBooking ID: ${bookingId}\nBus: ${booking.busName}\nRoute: ${booking.from} → ${booking.to}`;
  } catch (error) {
    return 'Failed to cancel booking. Please check the booking ID and try again.';
  }
};

const handleHelp = async () => {
  const cities = await getAvailableCities();
  return `🎯 I can help you with:

1. 🔍 Search Tickets
   "Find buses from ${cities[0] || 'Lahore'} to ${cities[1] || 'Karachi'}"
   "Search ticket from ${cities[2] || 'Islamabad'} to ${cities[3] || 'Multan'}"

2. 📋 My Bookings
   "Show my bookings"
   "View my tickets"

3. ❌ Cancel Booking
   "Cancel my booking"
   (Provide booking ID when asked)

4. ❓ FAQ
   "How to book?"
   "What's the refund policy?"

5. 💡 General Help
   "Help"
   "What can you do?"

Just type naturally and I'll assist you!`;
};

const handleFAQ = async (question) => {
  const cities = await getAvailableCities();
  const q = question.toLowerCase();
  
  if (q.includes('book') || q.includes('booking process')) {
    return `📝 How to Book:
1. Search for buses using departure & destination cities (${cities.slice(0, 3).join(', ')}...)
2. Select your preferred bus and seats
3. Enter passenger details (name, phone)
4. Confirm your booking
5. Receive booking confirmation

You can also ask me to search for tickets!`;
  }
  
  if (q.includes('cancel') || q.includes('refund')) {
    return `🔄 Cancellation & Refund:
- You can cancel your booking anytime before departure
- Refunds are processed within 5-7 business days
- Partial refund may apply for late cancellations

To cancel, say "Cancel my booking" and provide your booking ID.`;
  }
  
  if (q.includes('payment')) {
    return `💳 Payment Methods:
- Cash on delivery
- Credit/Debit cards
- EasyPaisa
- JazzCash

All transactions are secure and encrypted.`;
  }
  
  if (q.includes('seat') || q.includes('choose')) {
    return `🪑 Seat Selection:
- You can choose your preferred seat when booking
- Seat numbers are shown in the seat selection screen
- Some seats may have additional charges (front row, sleeper)

Use the search page to find buses and select seats.`;
  }

  if (q.includes('cities') || q.includes('routes')) {
    return `🗺️ Available Routes:\n\nWe operate buses between these cities:\n${cities.map((city, i) => `${i + 1}. ${city}`).join('\n')}\n\nJust tell me where you want to go!`;
  }

  return `For more help, you can:
• Visit our Help page in the navigation
• Contact support at support@artcraft.com
• Ask me anything about booking!`;
};

const chat = async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let session;
    let chatSessionId = sessionId;

    if (!chatSessionId) {
      chatSessionId = generateSessionId();
    }

    session = await ChatSession.findOne({ sessionId: chatSessionId });

    if (!session) {
      session = await ChatSession.create({
        sessionId: chatSessionId,
        userId: userId || null,
        messages: []
      });
    }

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    session.messages.push(userMessage);

    const intent = extractIntent(message);
    let botResponse = '';
    let actionTaken = false;

    const searchParams = await extractSearchParams(message);

    if (intent === 'search_ticket' && (searchParams.from || searchParams.to)) {
      botResponse = await handleSearchTicket(searchParams);
      actionTaken = true;
    } 
    else if (intent === 'show_bookings') {
      botResponse = await handleShowBookings(userId);
      actionTaken = true;
    }
    else if (intent === 'cancel_booking') {
      const bookingIdMatch = message.match(/[a-fA-F0-9]{24}/);
      const bookingId = bookingIdMatch ? bookingIdMatch[0] : null;
      botResponse = await handleCancelBooking(userId, bookingId);
      actionTaken = true;
    }
    else if (intent === 'help') {
      botResponse = await handleHelp();
      actionTaken = true;
    }
    else if (intent === 'faq') {
      botResponse = await handleFAQ(message);
      actionTaken = true;
    }

    if (!actionTaken) {
      const systemPrompt = await buildSystemPrompt();
      const historyForAI = session.messages.slice(-10).map(msg => ({
        sender: msg.role,
        content: msg.content
      }));
      botResponse = await generateResponse(message, historyForAI, systemPrompt);
    }

    const botMessage = {
      role: 'bot',
      content: botResponse,
      timestamp: new Date()
    };
    session.messages.push(botMessage);

    if (userId && !session.userId) {
      session.userId = userId;
    }
    await session.save();

    res.json({
      response: botResponse,
      sessionId: chatSessionId,
      intent: intent,
      actionTaken: actionTaken
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await ChatSession.findOne({ sessionId });
    
    if (!session) {
      return res.json({ messages: [], sessionId });
    }

    res.json({
      messages: session.messages,
      sessionId: session.sessionId,
      userId: session.userId
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};

module.exports = {
  chat,
  getChatHistory,
  getAvailableCities,
  getCities
};