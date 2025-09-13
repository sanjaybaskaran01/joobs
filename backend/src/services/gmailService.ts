import { Gmail } from 'googleapis/build/src/apis/gmail/v1';
import { createGmailClient } from '../config/google';
import { getFirestore } from '../config/firebase';

export interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: {
      data?: string;
    };
    parts?: Array<{
      mimeType: string;
      body: { data?: string };
      headers?: Array<{ name: string; value: string }>;
    }>;
  };
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}

export interface EmailListResponse {
  messages: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export class GmailService {
  private gmail: Gmail;
  private userId: string;

  constructor(accessToken: string, userId: string) {
    this.gmail = createGmailClient(accessToken);
    this.userId = userId;
  }

  async getEmails(maxResults: number = 10, pageToken?: string): Promise<EmailListResponse> {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        pageToken,
        q: 'in:inbox' // Only get inbox emails
      });

      return response.data as EmailListResponse;
    } catch (error) {
      console.error('Error fetching emails list:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  async getEmailDetails(messageId: string): Promise<EmailMessage> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      return response.data as EmailMessage;
    } catch (error) {
      console.error('Error fetching email details:', error);
      throw new Error('Failed to fetch email details');
    }
  }

  async getEmailsWithDetails(maxResults: number = 10, pageToken?: string) {
    try {
      // Get list of emails
      const emailList = await this.getEmails(maxResults, pageToken);
      
      if (!emailList.messages || emailList.messages.length === 0) {
        return {
          emails: [],
          nextPageToken: emailList.nextPageToken,
          resultSizeEstimate: emailList.resultSizeEstimate
        };
      }

      // Get details for each email
      const emailDetails = await Promise.all(
        emailList.messages.map(message => this.getEmailDetails(message.id))
      );

      // Process and format email data
      const processedEmails = emailDetails.map(email => this.processEmail(email));

      return {
        emails: processedEmails,
        nextPageToken: emailList.nextPageToken,
        resultSizeEstimate: emailList.resultSizeEstimate
      };
    } catch (error) {
      console.error('Error fetching emails with details:', error);
      throw new Error('Failed to fetch emails with details');
    }
  }

  private processEmail(email: EmailMessage) {
    const headers = email.payload.headers;
    
    const getHeader = (name: string): string => {
      const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
      return header ? header.value : '';
    };

    const getEmailBody = (payload: any): string => {
      if (payload.body && payload.body.data) {
        return Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }
      
      if (payload.parts) {
        for (const part of payload.parts) {
          if (part.mimeType === 'text/plain' && part.body && part.body.data) {
            return Buffer.from(part.body.data, 'base64').toString('utf-8');
          }
          if (part.mimeType === 'text/html' && part.body && part.body.data) {
            return Buffer.from(part.body.data, 'base64').toString('utf-8');
          }
        }
      }
      
      return '';
    };

    return {
      id: email.id,
      threadId: email.threadId,
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      snippet: email.snippet,
      body: getEmailBody(email.payload),
      sizeEstimate: email.sizeEstimate,
      internalDate: new Date(parseInt(email.internalDate)).toISOString()
    };
  }

  async searchEmails(query: string, maxResults: number = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: query
      });

      const emailList = response.data as EmailListResponse;
      
      if (!emailList.messages || emailList.messages.length === 0) {
        return { emails: [], resultSizeEstimate: 0 };
      }

      const emailDetails = await Promise.all(
        emailList.messages.map(message => this.getEmailDetails(message.id))
      );

      const processedEmails = emailDetails.map(email => this.processEmail(email));

      return {
        emails: processedEmails,
        resultSizeEstimate: emailList.resultSizeEstimate
      };
    } catch (error) {
      console.error('Error searching emails:', error);
      throw new Error('Failed to search emails');
    }
  }
}

export const getGmailServiceForUser = async (userId: string): Promise<GmailService> => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const googleTokens = userData?.googleTokens;

    if (!googleTokens || !googleTokens.access_token) {
      throw new Error('User has not authorized Gmail access');
    }

    return new GmailService(googleTokens.access_token, userId);
  } catch (error) {
    console.error('Error getting Gmail service for user:', error);
    throw error;
  }
};

