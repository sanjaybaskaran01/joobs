// Content script for Gmail integration
// This script runs on Gmail pages to detect and parse job-related emails

class GmailJobTracker {
  constructor() {
    this.jobKeywords = [
      'application', 'interview', 'offer', 'rejection', 'assessment',
      'coding challenge', 'technical interview', 'phone screen',
      'onsite interview', 'final round', 'congratulations',
      'unfortunately', 'next steps', 'position', 'role',
      'thank you for applying', 'we received your application'
    ];

    this.companyDomains = [
      'google.com', 'microsoft.com', 'apple.com', 'meta.com',
      'amazon.com', 'netflix.com', 'uber.com', 'airbnb.com',
      'spotify.com', 'dropbox.com', 'salesforce.com'
    ];

    this.init();
  }

  init() {
    // Wait for Gmail to load
    if (this.isGmailPage()) {
      this.observeEmailChanges();
      this.scanExistingEmails();
    }
  }

  isGmailPage() {
    return window.location.hostname === 'mail.google.com';
  }

  observeEmailChanges() {
    // Observer for new emails or navigation changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          this.scanForJobEmails();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  scanExistingEmails() {
    setTimeout(() => {
      this.scanForJobEmails();
    }, 2000); // Give Gmail time to load
  }

  scanForJobEmails() {
    // Gmail email selectors (these may need updating based on Gmail's UI changes)
    const emailElements = document.querySelectorAll('[data-thread-id], .zA');
    
    emailElements.forEach((emailElement) => {
      this.analyzeEmail(emailElement);
    });
  }

  analyzeEmail(emailElement) {
    try {
      const emailData = this.extractEmailData(emailElement);
      
      if (this.isJobRelatedEmail(emailData)) {
        const jobInfo = this.parseJobInformation(emailData);
        this.sendToExtension(jobInfo);
      }
    } catch (error) {
      console.error('Error analyzing email:', error);
    }
  }

  extractEmailData(emailElement) {
    // Extract email subject, sender, content, and date
    const subjectElement = emailElement.querySelector('[data-thread-perm-id] span[title], .bog span');
    const senderElement = emailElement.querySelector('.yW span[title], .go span');
    const contentElement = emailElement.querySelector('.ii.gt .a3s, .ii.gt div');
    const dateElement = emailElement.querySelector('.g3 span[title], .xY span');

    return {
      subject: subjectElement?.textContent || subjectElement?.title || '',
      sender: senderElement?.textContent || senderElement?.title || '',
      content: contentElement?.textContent || '',
      date: dateElement?.title || dateElement?.textContent || '',
      element: emailElement
    };
  }

  isJobRelatedEmail(emailData) {
    const { subject, sender, content } = emailData;
    const fullText = `${subject} ${sender} ${content}`.toLowerCase();

    // Check for job-related keywords
    const hasJobKeywords = this.jobKeywords.some(keyword => 
      fullText.includes(keyword.toLowerCase())
    );

    // Check if sender is from a known company domain
    const isFromCompany = this.companyDomains.some(domain => 
      sender.toLowerCase().includes(domain)
    );

    // Check for recruiter email patterns
    const recruiterPatterns = [
      'recruiter', 'hiring', 'talent', 'hr@', 'careers@', 
      'jobs@', 'recruitment', 'people@'
    ];
    const isFromRecruiter = recruiterPatterns.some(pattern => 
      sender.toLowerCase().includes(pattern)
    );

    return hasJobKeywords || isFromCompany || isFromRecruiter;
  }

  parseJobInformation(emailData) {
    const { subject, sender, content, date } = emailData;
    
    // Extract company name from email domain or content
    const company = this.extractCompanyName(sender, content);
    
    // Extract position from subject or content
    const position = this.extractPosition(subject, content);
    
    // Determine status based on email content
    const status = this.determineStatus(subject, content);
    
    // Extract salary if mentioned
    const salary = this.extractSalary(content);
    
    // Extract location if mentioned
    const location = this.extractLocation(content);

    return {
      company,
      position,
      status,
      salary,
      location,
      emailDate: date,
      emailSubject: subject,
      emailSender: sender,
      source: 'gmail_auto_detection'
    };
  }

  extractCompanyName(sender, content) {
    // Try to extract from email domain
    const emailMatch = sender.match(/@([^.]+)/);
    if (emailMatch) {
      const domain = emailMatch[1];
      // Capitalize first letter
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }

    // Try to extract from content
    const companyPatterns = [
      /at ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*) team/g,
      /join ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
    ];

    for (const pattern of companyPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return 'Unknown Company';
  }

  extractPosition(subject, content) {
    // Common position keywords
    const positionKeywords = [
      'engineer', 'developer', 'analyst', 'manager', 'director',
      'specialist', 'coordinator', 'lead', 'senior', 'junior',
      'intern', 'consultant', 'architect', 'designer', 'scientist'
    ];

    const text = `${subject} ${content}`;
    
    // Try to find position in subject first
    for (const keyword of positionKeywords) {
      const regex = new RegExp(`([\\w\\s]*${keyword}[\\w\\s]*)`, 'gi');
      const match = text.match(regex);
      if (match) {
        return match[0].trim();
      }
    }

    return 'Unknown Position';
  }

  determineStatus(subject, content) {
    const text = `${subject} ${content}`.toLowerCase();

    if (text.includes('congratulations') || text.includes('offer') || text.includes('pleased to offer')) {
      return 'offer';
    } else if (text.includes('interview') || text.includes('next round') || text.includes('schedule')) {
      return 'interview';
    } else if (text.includes('assessment') || text.includes('coding challenge') || text.includes('test')) {
      return 'oa';
    } else if (text.includes('unfortunately') || text.includes('not moving forward') || text.includes('rejected')) {
      return 'rejected';
    } else if (text.includes('received') || text.includes('thank you for applying')) {
      return 'applied';
    }

    return 'applied'; // Default status
  }

  extractSalary(content) {
    const salaryPatterns = [
      /\$[\d,]+(?:-\$?[\d,]+)?(?:k|,000)?/g,
      /[\d,]+k?-[\d,]+k salary/g,
      /compensation.*\$[\d,]+/g
    ];

    for (const pattern of salaryPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  extractLocation(content) {
    const locationPatterns = [
      /(?:in|at|based in)\s+([A-Z][a-z]+(?:,?\s+[A-Z][A-Z])?)/g,
      /([A-Z][a-z]+,\s+[A-Z][A-Z])/g,
      /(San Francisco|New York|Los Angeles|Seattle|Austin|Boston|Chicago|Remote)/gi
    ];

    for (const pattern of locationPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return null;
  }

  sendToExtension(jobInfo) {
    // Send job information to the extension background script
    chrome.runtime.sendMessage({
      type: 'JOB_EMAIL_DETECTED',
      data: jobInfo
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending job info:', chrome.runtime.lastError);
      } else {
        console.log('Job info sent successfully:', response);
      }
    });
  }
}

// Initialize the Gmail job tracker
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GmailJobTracker();
  });
} else {
  new GmailJobTracker();
}