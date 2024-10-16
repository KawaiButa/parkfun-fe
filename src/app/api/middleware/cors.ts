import Cors from 'micro-cors/lib/index';

// Initialize CORS middleware
const cors = Cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // Allow specific HTTP methods
});

export default cors;