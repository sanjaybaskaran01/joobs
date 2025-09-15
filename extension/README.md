# How to Open and Run the Extension

## 1. Install Dependencies
```bash
pnpm install
```

## 2. Configure Environment Variables
Edit the `.env` file in the `extension` directory. Example:
```properties
# Editable only via CLI
CLI_CEB_DEV=true
CLI_CEB_FIREFOX=false

# Editable
CEB_FIREBASE_API_KEY="your-firebase-api-key"
```
You can update these values using the CLI or by editing the file directly.

## 3. Development Mode
To run the extension in development mode:
```bash
pnpm dev
```
This will start the development server and enable hot-reloading.

## 4. Build for Production
To build the extension for production:
```bash
pnpm build
```
The output will be in the `dist` folder.

## 5. Load the Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `dist` folder inside the extension directory

## 6. Open the Extension
- Click the JobTrax extension icon in your Chrome toolbar.
- Follow the sign-in flow and grant necessary permissions.
