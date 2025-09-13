import { Router, Request, Response } from 'express';
import { getGmailServiceForUser } from '../services/gmailService';
import { verifyIdToken } from '../services/authService';

const router = Router();

// Middleware to verify Firebase token
const authenticateToken = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(idToken);
    
    // Add user info to request object
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get user's emails
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { maxResults = 10, pageToken } = req.query;

    const gmailService = await getGmailServiceForUser(userId);
    const result = await gmailService.getEmailsWithDetails(
      parseInt(maxResults as string),
      pageToken as string
    );

    res.json({
      success: true,
      data: result,
      message: 'Emails fetched successfully'
    });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    
    if (error.message === 'User has not authorized Gmail access') {
      return res.status(403).json({
        error: 'Gmail access not authorized',
        message: 'Please complete Google OAuth authentication to access Gmail'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch emails',
      message: error.message
    });
  }
});

// Get specific email by ID
router.get('/:emailId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { emailId } = req.params;

    const gmailService = await getGmailServiceForUser(userId);
    const emailDetails = await gmailService.getEmailDetails(emailId);
    const processedEmail = (gmailService as any).processEmail(emailDetails);

    res.json({
      success: true,
      data: processedEmail,
      message: 'Email details fetched successfully'
    });
  } catch (error: any) {
    console.error('Error fetching email details:', error);
    
    if (error.message === 'User has not authorized Gmail access') {
      return res.status(403).json({
        error: 'Gmail access not authorized',
        message: 'Please complete Google OAuth authentication to access Gmail'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch email details',
      message: error.message
    });
  }
});

// Search emails
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { query } = req.params;
    const { maxResults = 10 } = req.query;

    const gmailService = await getGmailServiceForUser(userId);
    const result = await gmailService.searchEmails(
      decodeURIComponent(query),
      parseInt(maxResults as string)
    );

    res.json({
      success: true,
      data: result,
      message: 'Email search completed successfully'
    });
  } catch (error: any) {
    console.error('Error searching emails:', error);
    
    if (error.message === 'User has not authorized Gmail access') {
      return res.status(403).json({
        error: 'Gmail access not authorized',
        message: 'Please complete Google OAuth authentication to access Gmail'
      });
    }

    res.status(500).json({
      error: 'Failed to search emails',
      message: error.message
    });
  }
});

// Get email statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const gmailService = await getGmailServiceForUser(userId);
    
    // Get recent emails for statistics
    const recentEmails = await gmailService.getEmails(50);
    
    // Get unread emails
    const unreadEmails = await gmailService.searchEmails('is:unread', 50);
    
    res.json({
      success: true,
      data: {
        totalRecent: recentEmails.resultSizeEstimate,
        unreadCount: unreadEmails.resultSizeEstimate,
        lastUpdated: new Date().toISOString()
      },
      message: 'Email statistics fetched successfully'
    });
  } catch (error: any) {
    console.error('Error fetching email statistics:', error);
    
    if (error.message === 'User has not authorized Gmail access') {
      return res.status(403).json({
        error: 'Gmail access not authorized',
        message: 'Please complete Google OAuth authentication to access Gmail'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch email statistics',
      message: error.message
    });
  }
});

export { router as emailRoutes };

