import { google, gmail_v1 } from 'googleapis';

export interface EmailContent {
  text: string;
  html: string;
  hasAttachments: boolean;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  date: string;
  labelIds: string[];
  isUnread: boolean;
  isImportant: boolean;
  timestamp: string;
  sizeEstimate: number;
  content: EmailContent;
}

export interface EmailFetchOptions {
  maxResults?: number;
  query?: string;
  labelIds?: string[];
  includeSpamTrash?: boolean;
}



class GmailService {
  private gmail: gmail_v1.Gmail;
  private oauth2Client: any;

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2();
    this.oauth2Client.setCredentials({ access_token: accessToken });
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  /**
   * Decode base64url encoded content
   */
  private decodeBase64Url(str: string): string {
    try {
      // Convert base64url to base64
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if necessary
      while (base64.length % 4) {
        base64 += '=';
      }
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch (error) {
      console.error('Error decoding base64url:', error);
      return str; // Return original if decoding fails
    }
  }

  /**
   * Extract email content from Gmail message payload
   */
  private extractEmailContent(payload: any): EmailContent {
    let textContent = '';
    let htmlContent = '';
    let hasAttachments = false;
    
    const extractFromPart = (part: any): void => {
      if (part.filename && part.filename.length > 0) {
        hasAttachments = true;
      }
      
      if (part.mimeType === 'text/plain' && part.body?.data) {
        textContent += this.decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        htmlContent += this.decodeBase64Url(part.body.data);
      } else if (part.parts && Array.isArray(part.parts)) {
        // Recursively process multipart content
        part.parts.forEach(extractFromPart);
      }
    };
    
    if (payload.parts && Array.isArray(payload.parts)) {
      payload.parts.forEach(extractFromPart);
    } else if (payload.body?.data) {
      // Single part message
      if (payload.mimeType === 'text/plain') {
        textContent = this.decodeBase64Url(payload.body.data);
      } else if (payload.mimeType === 'text/html') {
        htmlContent = this.decodeBase64Url(payload.body.data);
      }
    }
    
    return { 
      text: textContent, 
      html: htmlContent, 
      hasAttachments 
    };
  }

  /**
   * Get header value from email headers array
   */
  private getHeader(headers: any[], name: string): string {
    return headers.find(header => 
      header.name?.toLowerCase() === name.toLowerCase()
    )?.value || '';
  }

  /**
   * Build Gmail search query from timestamp and other filters
   */
  private buildQuery(fromTimestamp?: number, options?: EmailFetchOptions): string {
    const queryParts: string[] = [];

    // Add timestamp filter if provided
    if (fromTimestamp) {
      const date = new Date(fromTimestamp);
      const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '/');
      queryParts.push(`after:${formattedDate}`);
    }

    // Add custom query if provided
    if (options?.query) {
      queryParts.push(options.query);
    }

    return queryParts.join(' ');
  }

  /**
   * Fetch emails from a particular timestamp
   */
  async fetchEmailsFromTimestamp(
    fromTimestamp: number,
    options: EmailFetchOptions = {}
  ) {
    try {
      const {
        maxResults = 10,
        labelIds,
        includeSpamTrash = false
      } = options;

      const query = this.buildQuery(fromTimestamp, options);

      const messagesResponse = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: query || undefined,
        labelIds: labelIds,
        includeSpamTrash: includeSpamTrash
      });

      if (!messagesResponse.data.messages || messagesResponse.data.messages.length === 0) {
        return {
          emails: [],
          totalCount: 0,
          nextPageToken: messagesResponse.data.nextPageToken,
          message: 'No emails found for the specified timestamp'
        };
      }

      // Get full details for each message
      const emailPromises = messagesResponse.data.messages.map(async (message) => {
        const emailResponse = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });
        
        const email = emailResponse.data;
        const headers = email.payload?.headers || [];
        
        // Extract email content
        const content = this.extractEmailContent(email.payload);
        
        return {
          id: email.id!,
          threadId: email.threadId!,
          snippet: email.snippet || '',
          from: this.getHeader(headers, 'From'),
          to: this.getHeader(headers, 'To'),
          cc: this.getHeader(headers, 'Cc'),
          bcc: this.getHeader(headers, 'Bcc'),
          subject: this.getHeader(headers, 'Subject'),
          date: this.getHeader(headers, 'Date'),
          labelIds: email.labelIds || [],
          isUnread: email.labelIds?.includes('UNREAD') || false,
          isImportant: email.labelIds?.includes('IMPORTANT') || false,
          timestamp: email.internalDate!,
          sizeEstimate: email.sizeEstimate || 0,
          content
        } as EmailMessage;
      });

      const emails = await Promise.all(emailPromises);
      
      // Filter emails by timestamp (Gmail's after: query is not precise to the millisecond)
      const filteredEmails = emails.filter(email => {
        const emailTimestamp = parseInt(email.timestamp);
        return emailTimestamp >= fromTimestamp;
      });

      return {
        emails: filteredEmails,
        totalCount: messagesResponse.data.resultSizeEstimate || 0,
        nextPageToken: messagesResponse.data.nextPageToken,
        message: `Successfully fetched ${filteredEmails.length} emails from timestamp ${fromTimestamp}`
      };
      
    } catch (error) {
      console.error('Error fetching emails from timestamp:', error);
      throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch recent emails (wrapper for fetchEmailsFromTimestamp)
   */
  async fetchRecentEmails(options: EmailFetchOptions = {}) {
    try {
      const messagesResponse = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: options.maxResults || 10,
        q: options.query || undefined,
        labelIds: options.labelIds,
        includeSpamTrash: options.includeSpamTrash || false
      });

      if (!messagesResponse.data.messages || messagesResponse.data.messages.length === 0) {
        return {
          emails: [],
          totalCount: 0,
          nextPageToken: messagesResponse.data.nextPageToken,
          message: 'No emails found'
        };
      }

      // Get full details for each message
      const emailPromises = messagesResponse.data.messages.map(async (message) => {
        const emailResponse = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });
        
        const email = emailResponse.data;
        const headers = email.payload?.headers || [];
        
        // Extract email content
        const content = this.extractEmailContent(email.payload);
        
        return {
          id: email.id!,
          threadId: email.threadId!,
          snippet: email.snippet || '',
          from: this.getHeader(headers, 'From'),
          to: this.getHeader(headers, 'To'),
          cc: this.getHeader(headers, 'Cc'),
          bcc: this.getHeader(headers, 'Bcc'),
          subject: this.getHeader(headers, 'Subject'),
          date: this.getHeader(headers, 'Date'),
          labelIds: email.labelIds || [],
          isUnread: email.labelIds?.includes('UNREAD') || false,
          isImportant: email.labelIds?.includes('IMPORTANT') || false,
          timestamp: email.internalDate!,
          sizeEstimate: email.sizeEstimate || 0,
          content
        } as EmailMessage;
      });

      const emails = await Promise.all(emailPromises);

      return {
        emails: emails,
        totalCount: messagesResponse.data.resultSizeEstimate || 0,
        nextPageToken: messagesResponse.data.nextPageToken || undefined,
        message: `Successfully fetched ${emails.length} recent emails`
      };
      
    } catch (error) {
      console.error('Error fetching recent emails:', error);
      throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a single email by ID
   */
  async getEmailById(emailId: string): Promise<EmailMessage> {
    try {
      const emailResponse = await this.gmail.users.messages.get({
        userId: 'me',
        id: emailId,
        format: 'full'
      });
      
      const email = emailResponse.data;
      const headers = email.payload?.headers || [];
      
      // Extract email content
      const content = this.extractEmailContent(email.payload);
      
      return {
        id: email.id!,
        threadId: email.threadId!,
        snippet: email.snippet || '',
        from: this.getHeader(headers, 'From'),
        to: this.getHeader(headers, 'To'),
        cc: this.getHeader(headers, 'Cc'),
        bcc: this.getHeader(headers, 'Bcc'),
        subject: this.getHeader(headers, 'Subject'),
        date: this.getHeader(headers, 'Date'),
        labelIds: email.labelIds || [],
        isUnread: email.labelIds?.includes('UNREAD') || false,
        isImportant: email.labelIds?.includes('IMPORTANT') || false,
        timestamp: email.internalDate!,
        sizeEstimate: email.sizeEstimate || 0,
        content
      };
      
    } catch (error) {
      console.error('Error fetching email by ID:', error);
      throw new Error(`Failed to fetch email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate access token
   */
  async validateToken(): Promise<boolean> {
    try {
      const tokenResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${this.oauth2Client.credentials.access_token}`);
      return tokenResponse.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}

/**
 * Factory function to create GmailService instance
 */
export const createGmailService = (accessToken: string): GmailService => {
  return new GmailService(accessToken);
};

/**
 * Utility function to convert date to timestamp
 */
export const dateToTimestamp = (date: Date): number => {
  return date.getTime();
};

/**
 * Utility function to get timestamp for X days ago
 */
export const getDaysAgoTimestamp = (days: number): number => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.getTime();
};

export default GmailService;